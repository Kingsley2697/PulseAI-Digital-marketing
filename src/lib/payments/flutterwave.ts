/**
 * Flutterwave Integration Service (for NGN & African payments)
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
    // Return structured sandbox/demo payment payload for developer test mode
    return {
      success: true,
      isDemoMode: true,
      checkoutUrl: `/get-started?payment_mock=true&tx_ref=${options.tx_ref}&amount=${options.amount}&currency=${options.currency}`,
      message: "Flutterwave running in Test Mode (FLUTTERWAVE_SECRET_KEY not set). Test checkout enabled.",
      data: {
        link: `/get-started?payment_mock=true&tx_ref=${options.tx_ref}&amount=${options.amount}&currency=${options.currency}`,
        tx_ref: options.tx_ref,
      },
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
    if (data.status === "success") {
      return {
        success: true,
        isDemoMode: false,
        checkoutUrl: data.data.link,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: data.message || "Failed to initialize Flutterwave payment session.",
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
