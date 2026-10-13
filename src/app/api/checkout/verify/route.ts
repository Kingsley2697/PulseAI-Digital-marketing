import { NextRequest, NextResponse } from "next/server";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";
import { sendNotification } from "@/lib/notifications/notify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");
  const briefId = searchParams.get("briefId");

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  if (status !== "successful" || !transaction_id) {
    console.warn(`[Flutterwave Callback] Payment was not successful or missing transaction_id: status=${status}`);
    return NextResponse.redirect(
      `${baseUrl}/get-started?payment_status=failed&reason=${encodeURIComponent(
        status || "cancelled"
      )}`
    );
  }

  try {
    // 1. Verify directly against Flutterwave official API
    const verification = await verifyFlutterwaveTransaction(transaction_id);

    if (!verification.success || !verification.verified) {
      console.error("[Flutterwave Verification Failure]:", verification.error);
      return NextResponse.redirect(
        `${baseUrl}/get-started?payment_status=verification_failed&reason=${encodeURIComponent(
          verification.error || "Verification failed"
        )}`
      );
    }

    // 2. Update real Brief record in MongoDB
    await connectToDatabase();
    let updatedBrief = null;

    if (briefId) {
      updatedBrief = await Brief.findByIdAndUpdate(
        briefId,
        {
          paymentStatus: "paid",
          status: "converted",
          flwTransactionId: transaction_id,
          paymentRef: tx_ref || verification.tx_ref,
          paymentAmount: verification.amount,
          paymentVerifiedAt: new Date(),
        },
        { new: true }
      );
    } else if (tx_ref) {
      updatedBrief = await Brief.findOneAndUpdate(
        { paymentRef: tx_ref },
        {
          paymentStatus: "paid",
          status: "converted",
          flwTransactionId: transaction_id,
          paymentAmount: verification.amount,
          paymentVerifiedAt: new Date(),
        },
        { new: true }
      );
    }

    // 3. Dispatch real notification
    await sendNotification({
      type: "PAYMENT_CONFIRMED",
      title: `💰 Retainer Paid via Flutterwave: ${verification.currency} ${verification.amount}`,
      data: {
        TransactionId: transaction_id,
        Reference: tx_ref || verification.tx_ref,
        Amount: `${verification.currency} ${verification.amount}`,
        Customer: verification.customer?.name || "Client",
        Email: verification.customer?.email || "N/A",
        BriefBusiness: updatedBrief?.businessName || "Registered Client",
        Status: "VERIFIED_PAID",
      },
    });

    return NextResponse.redirect(
      `${baseUrl}/get-started?payment_verified=true&tx_ref=${encodeURIComponent(
        tx_ref || transaction_id
      )}&amount=${encodeURIComponent(String(verification.amount))}&currency=${encodeURIComponent(
        verification.currency || "NGN"
      )}`
    );
  } catch (err: unknown) {
    console.error("[Flutterwave Callback Exception]:", err);
    return NextResponse.redirect(
      `${baseUrl}/get-started?payment_status=error&reason=server_verification_error`
    );
  }
}
