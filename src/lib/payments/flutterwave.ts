/**
 * Live Flutterwave Integration Service (for NGN & African Payments)
 * Connects directly to the official Flutterwave v3 API.
 */

interface FlutterwaveInitOptions {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    phonenumber?: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
}

export async function initializeFlutterwavePayment(options: FlutterwaveInitOptions) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error:
        "Flutterwave API configuration missing: Set FLUTTERWAVE_SECRET_KEY in .env.local with your real Flutterwave Secret Key from your dashboard.",
    };
  }

  try {
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    const data = await res.json();
    if (data.status === "success" && data.data?.link) {
      return {
        success: true,
        checkoutUrl: data.data.link,
        tx_ref: options.tx_ref,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: data.message || "Failed to initialize Flutterwave payment session with Flutterwave API.",
      };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Network error contacting Flutterwave API";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify a real Flutterwave transaction server-side directly against Flutterwave v3 API.
 */
export async function verifyFlutterwaveTransaction(transactionId: string) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: "FLUTTERWAVE_SECRET_KEY is missing in environment variables.",
    };
  }

  try {
    const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.status === "success" && data.data?.status === "successful") {
      return {
        success: true,
        verified: true,
        amount: data.data.amount,
        currency: data.data.currency,
        tx_ref: data.data.tx_ref,
        customer: data.data.customer,
        flwData: data.data,
      };
    } else {
      return {
        success: false,
        verified: false,
        error: data.message || "Flutterwave transaction could not be verified or was not successful.",
        flwData: data.data,
      };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Network error verifying transaction with Flutterwave";
    return {
      success: false,
      verified: false,
      error: errorMessage,
    };
  }
}
