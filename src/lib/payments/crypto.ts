/**
 * Live Crypto Gateway Service (USDT, BTC, ETH) for International Client Billing
 * Uses direct on-chain receiving wallets and real blockchain explorer verification links.
 */

export interface CryptoInvoiceRequest {
  briefId?: string;
  amountUsd: number;
  currency: "USDT_TRC20" | "USDT_ERC20" | "BTC" | "ETH";
  clientEmail: string;
  clientName: string;
}

export interface CryptoInvoiceResponse {
  success: boolean;
  invoiceId: string;
  depositAddress: string;
  network: string;
  cryptoAmount: string;
  rateUsd: number;
  qrCodeUrl: string;
  expiresInMinutes: number;
  explorerUrl: string;
  error?: string;
}

/**
 * Fetch a current cryptocurrency rate before creating an invoice.
 */
async function getLiveCryptoRate(currency: string): Promise<number | null> {
  if (currency === "USDT_TRC20" || currency === "USDT_ERC20") {
    return 1.0; // Tether is 1:1 USD peg
  }

  try {
    const coinId = currency === "BTC" ? "bitcoin" : "ethereum";
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data[coinId]?.usd) {
        return Number(data[coinId].usd);
      }
    }
  } catch (err) {
    console.warn("[Crypto Rate Fetch Warning]: Unable to fetch current market rate", err);
  }

  return null;
}

export async function generateCryptoInvoice(
  request: CryptoInvoiceRequest
): Promise<CryptoInvoiceResponse> {
  const invoiceId = "PULSE-INV-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  const walletConfigs: Record<
    string,
    { addressEnv: string | undefined; network: string; defaultExplorer: string }
  > = {
    USDT_TRC20: {
      addressEnv: process.env.CRYPTO_USDT_TRC20_WALLET,
      network: "TRON (TRC-20)",
      defaultExplorer: "https://tronscan.org/#/transaction/",
    },
    USDT_ERC20: {
      addressEnv: process.env.CRYPTO_USDT_ERC20_WALLET || process.env.CRYPTO_ETH_WALLET,
      network: "Ethereum (ERC-20)",
      defaultExplorer: "https://etherscan.io/tx/",
    },
    BTC: {
      addressEnv: process.env.CRYPTO_BTC_WALLET,
      network: "Bitcoin Mainnet",
      defaultExplorer: "https://mempool.space/tx/",
    },
    ETH: {
      addressEnv: process.env.CRYPTO_ETH_WALLET,
      network: "Ethereum Mainnet",
      defaultExplorer: "https://etherscan.io/tx/",
    },
  };

  const selectedConfig = walletConfigs[request.currency] || walletConfigs.USDT_TRC20;
  const depositAddress = selectedConfig.addressEnv;

  if (!depositAddress) {
    return {
      success: false,
      invoiceId,
      depositAddress: "",
      network: selectedConfig.network,
      cryptoAmount: "0",
      rateUsd: 0,
      qrCodeUrl: "",
      expiresInMinutes: 0,
      explorerUrl: "",
      error: `Receiving wallet address for ${selectedConfig.network} is not configured. Please set the corresponding wallet variable in .env.local`,
    };
  }

  const rate = await getLiveCryptoRate(request.currency);
  if (!rate) {
    return {
      success: false,
      invoiceId,
      depositAddress: "",
      network: selectedConfig.network,
      cryptoAmount: "0",
      rateUsd: 0,
      qrCodeUrl: "",
      expiresInMinutes: 0,
      explorerUrl: "",
      error: "Unable to retrieve a current cryptocurrency exchange rate. Please try again shortly.",
    };
  }
  const calculatedCryptoAmount = (request.amountUsd / rate).toFixed(
    request.currency === "BTC" ? 6 : request.currency === "ETH" ? 4 : 2
  );

  return {
    success: true,
    invoiceId,
    depositAddress,
    network: selectedConfig.network,
    cryptoAmount: calculatedCryptoAmount,
    rateUsd: rate,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
      depositAddress
    )}`,
    expiresInMinutes: 120,
    explorerUrl: selectedConfig.defaultExplorer,
  };
}

export function getBlockchainExplorerUrl(currency: string, txHash: string): string {
  const cleanHash = txHash.trim();
  if (currency.includes("TRC20")) {
    return `https://tronscan.org/#/transaction/${cleanHash}`;
  }
  if (currency === "BTC") {
    return `https://mempool.space/tx/${cleanHash}`;
  }
  return `https://etherscan.io/tx/${cleanHash}`;
}
