/**
 * Crypto Gateway Service (USDT, BTC, ETH) for International USD Client Billing
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
  isMock: boolean;
}

export function generateCryptoInvoice(request: CryptoInvoiceRequest): CryptoInvoiceResponse {
  const invoiceId = "PULSE-CRYPTO-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  const mockWallets = {
    USDT_TRC20: {
      address: process.env.CRYPTO_USDT_TRC20_WALLET || "TP2R8aK9nB5GkM7wXZ4aF3jL8vN9qP1yZ2",
      network: "TRON (TRC-20)",
      rate: 1.0,
    },
    USDT_ERC20: {
      address: process.env.CRYPTO_ETH_WALLET || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      network: "Ethereum (ERC-20)",
      rate: 1.0,
    },
    BTC: {
      address: process.env.CRYPTO_BTC_WALLET || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      network: "Bitcoin Mainnet",
      rate: 68500,
    },
    ETH: {
      address: process.env.CRYPTO_ETH_WALLET || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      network: "Ethereum Mainnet",
      rate: 3450,
    },
  };

  const selected = mockWallets[request.currency] || mockWallets.USDT_TRC20;
  const calculatedCryptoAmount = (request.amountUsd / selected.rate).toFixed(
    request.currency === "BTC" ? 6 : request.currency === "ETH" ? 4 : 2
  );

  return {
    success: true,
    invoiceId,
    depositAddress: selected.address,
    network: selected.network,
    cryptoAmount: calculatedCryptoAmount,
    rateUsd: selected.rate,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      selected.address
    )}`,
    expiresInMinutes: 60,
    isMock: !process.env.CRYPTO_GATEWAY_API_KEY,
  };
}
