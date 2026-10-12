import { NextRequest, NextResponse } from "next/server";
import { initializeFlutterwavePayment } from "@/lib/payments/flutterwave";
import { generateCryptoInvoice } from "@/lib/payments/crypto";
import { sendNotification } from "@/lib/notifications/notify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gateway, // "flutterwave" | "crypto" | "test"
      amount,
      currency = "USD",
      customerEmail,
      customerName,
      customerPhone,
      planName = "PulseAI Growth Plan",
      briefId,
      cryptoCurrency = "USDT_TRC20",
    } = body;

    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: "Missing required payment parameters (amount, email, name)." },
        { status: 400 }
      );
    }

    if (gateway === "flutterwave") {
      const tx_ref = `PLSE-FLW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      const host = req.headers.get("host") || "localhost:3000";
      const redirect_url = `${protocol}://${host}/get-started?payment_success=true&tx_ref=${tx_ref}&plan=${encodeURIComponent(
        planName
      )}`;

      const flwResult = await initializeFlutterwavePayment({
        tx_ref,
        amount: Number(amount),
        currency: currency.toUpperCase(),
        redirect_url,
        customer: {
          email: customerEmail,
          phonenumber: customerPhone,
          name: customerName,
        },
        customizations: {
          title: `PulseAI Digital - ${planName}`,
          description: `Marketing Retainer & Setup Fee for ${customerName}`,
        },
      });

      return NextResponse.json({
        gateway: "flutterwave",
        ...flwResult,
      });
    } else if (gateway === "crypto") {
      const cryptoInvoice = generateCryptoInvoice({
        briefId,
        amountUsd: Number(amount),
        currency: cryptoCurrency,
        clientEmail: customerEmail,
        clientName: customerName,
      });

      await sendNotification({
        type: "PAYMENT_CONFIRMED",
        title: `⚡ Crypto Invoice Generated: ${customerName}`,
        data: {
          InvoiceId: cryptoInvoice.invoiceId,
          AmountUSD: `$${amount}`,
          CryptoDue: `${cryptoInvoice.cryptoAmount} ${cryptoInvoice.network}`,
          DepositAddress: cryptoInvoice.depositAddress,
          Client: `${customerName} (${customerEmail})`,
        },
      });

      return NextResponse.json({
        success: true,
        gateway: "crypto",
        invoice: cryptoInvoice,
      });
    } else {
      // Instant Sandbox / Test Simulator Mode
      const simulatedRef = `PULSE-TEST-${Date.now()}`;

      await sendNotification({
        type: "PAYMENT_CONFIRMED",
        title: `💳 Retainer Confirmed: ${customerName}`,
        data: {
          TransactionRef: simulatedRef,
          Client: `${customerName} (${customerEmail})`,
          Plan: planName,
          Amount: `${currency} ${amount}`,
          Status: "Simulated Instant Settlement",
        },
      });

      return NextResponse.json({
        success: true,
        gateway: "sandbox",
        tx_ref: simulatedRef,
        message: "Demo payment simulated successfully! Retainer activated.",
      });
    }
  } catch (err: unknown) {
    console.error("Payment checkout error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal payment routing error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
