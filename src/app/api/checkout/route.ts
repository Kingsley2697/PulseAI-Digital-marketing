import { NextRequest, NextResponse } from "next/server";
import { initializeFlutterwavePayment } from "@/lib/payments/flutterwave";
import { generateCryptoInvoice } from "@/lib/payments/crypto";
import { sendNotification } from "@/lib/notifications/notify";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gateway, // "flutterwave" | "crypto"
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
      const redirect_url = `${protocol}://${host}/api/checkout/verify?briefId=${encodeURIComponent(
        briefId || ""
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

      if (!flwResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: flwResult.error || "Failed to initialize Flutterwave payment session.",
          },
          { status: 400 }
        );
      }

      // Record transaction reference against the MongoDB Brief if briefId provided
      if (briefId) {
        try {
          await connectToDatabase();
          await Brief.findByIdAndUpdate(briefId, {
            paymentRef: tx_ref,
            paymentAmount: Number(amount),
            paymentMethod: "flutterwave",
            preferredCurrency: currency.toUpperCase() as "USD" | "NGN",
          });
        } catch (dbErr) {
          console.warn("[DB Warning during checkout update]:", dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        gateway: "flutterwave",
        checkoutUrl: flwResult.checkoutUrl,
        tx_ref,
      });
    } else if (gateway === "crypto") {
      const cryptoInvoice = await generateCryptoInvoice({
        briefId,
        amountUsd: Number(amount),
        currency: cryptoCurrency,
        clientEmail: customerEmail,
        clientName: customerName,
      });

      if (!cryptoInvoice.success) {
        return NextResponse.json(
          {
            success: false,
            error: cryptoInvoice.error || "Failed to generate crypto invoice.",
          },
          { status: 400 }
        );
      }

      // Record invoice details against MongoDB Brief
      if (briefId) {
        try {
          await connectToDatabase();
          await Brief.findByIdAndUpdate(briefId, {
            cryptoInvoiceId: cryptoInvoice.invoiceId,
            cryptoNetwork: cryptoInvoice.network,
            cryptoDepositAddress: cryptoInvoice.depositAddress,
            cryptoAmount: cryptoInvoice.cryptoAmount,
            paymentAmount: Number(amount),
            paymentMethod: "crypto",
            paymentStatus: "pending",
          });
        } catch (dbErr) {
          console.warn("[DB Warning during crypto invoice record]:", dbErr);
        }
      }

      await sendNotification({
        type: "BRIEF_SUBMITTED",
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
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment gateway selected. Choose 'flutterwave' or 'crypto'.",
        },
        { status: 400 }
      );
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
