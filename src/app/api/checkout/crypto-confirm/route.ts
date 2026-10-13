import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";
import { sendNotification } from "@/lib/notifications/notify";
import { getBlockchainExplorerUrl } from "@/lib/payments/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { briefId, invoiceId, txHash, network = "TRON (TRC-20)" } = body;

    if (!txHash || txHash.trim().length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid blockchain Transaction Hash / TxID.",
        },
        { status: 400 }
      );
    }

    const cleanTxHash = txHash.trim();
    const explorerUrl = getBlockchainExplorerUrl(network, cleanTxHash);

    await connectToDatabase();
    let brief = null;

    if (briefId) {
      brief = await Brief.findByIdAndUpdate(
        briefId,
        {
          cryptoTxHash: cleanTxHash,
          paymentStatus: "verifying",
          status: "in-progress",
          cryptoNetwork: network,
        },
        { new: true }
      );
    } else if (invoiceId) {
      brief = await Brief.findOneAndUpdate(
        { cryptoInvoiceId: invoiceId },
        {
          cryptoTxHash: cleanTxHash,
          paymentStatus: "verifying",
          status: "in-progress",
          cryptoNetwork: network,
        },
        { new: true }
      );
    }

    // Trigger instant alert for the agency team with direct block explorer link
    await sendNotification({
      type: "PAYMENT_CONFIRMED",
      title: `⚡ Real Crypto Payment Submitted for Verification`,
      data: {
        Business: brief?.businessName || "Client Brief",
        Client: brief?.contactName || "Decision Maker",
        Email: brief?.email || "N/A",
        Network: network,
        TxHash: cleanTxHash,
        BlockExplorer: explorerUrl,
        Status: "Pending On-Chain Confirmation",
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Blockchain transaction hash recorded. Our strategy desk has been alerted for on-chain block confirmation.",
      txHash: cleanTxHash,
      explorerUrl,
      paymentStatus: "verifying",
    });
  } catch (err: unknown) {
    console.error("[Crypto Confirm Error]:", err);
    const msg = err instanceof Error ? err.message : "Failed to record crypto transaction";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
