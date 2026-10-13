/**
 * Production Notification Engine (Telegram Bot & Email Service)
 * Dispatches live alerts when a client submits a marketing brief, contact inquiry, or payment.
 */

interface NotificationPayload {
  type: "BRIEF_SUBMITTED" | "CONTACT_INQUIRY" | "PAYMENT_CONFIRMED";
  title: string;
  data: Record<string, unknown>;
}

export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; telegramSent: boolean; emailSent: boolean; errors?: string[] }> {
  const { type, title, data } = payload;
  const errors: string[] = [];
  let telegramSent = false;
  let emailSent = false;

  console.log(`[Notification Engine] Processing live dispatch: ${type} - ${title}`);

  // Format message text
  let formattedMessage = `⚡ *PULSEAI DIGITAL LIVE ALERT* ⚡\n`;
  formattedMessage += `*Event:* ${title}\n\n`;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "") {
      const displayKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      const valStr = Array.isArray(value) ? value.join(", ") : String(value);
      formattedMessage += `• *${displayKey}:* ${valStr}\n`;
    }
  }

  formattedMessage += `\n📅 *Timestamp:* ${new Date().toISOString()}`;

  // 1. Dispatch to Telegram Bot
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: formattedMessage,
          parse_mode: "Markdown",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("[Telegram Dispatch Warning]:", errorText);
        errors.push(`Telegram Error: ${errorText}`);
      } else {
        console.log("[Telegram Dispatch] Live alert successfully sent to Telegram.");
        telegramSent = true;
      }
    } catch (telegramErr) {
      console.error("[Telegram Network Error]:", telegramErr);
      errors.push("Telegram network error");
    }
  } else {
    console.log(
      "[Notification Engine] Telegram credentials not set. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local to receive instant Telegram pings."
    );
  }

  // 2. Dispatch via Resend Email API if configured
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipientEmail =
    process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL || "growth@pulseai.digital";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "alerts@pulseai.digital";

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
          subject: `[PulseAI] ${title}`,
          text: formattedMessage.replace(/[*_]/g, ""),
        }),
      });

      if (res.ok) {
        console.log(`[Resend Email] Live notification delivered to ${recipientEmail}`);
        emailSent = true;
      } else {
        const emailErr = await res.text();
        console.warn("[Resend Email Warning]:", emailErr);
        errors.push(`Email error: ${emailErr}`);
      }
    } catch (emailErr) {
      console.error("[Resend Email Network Error]:", emailErr);
    }
  }

  // 3. Fallback / Webhook Email Dispatch
  const emailNotificationUrl = process.env.EMAIL_NOTIFICATION_WEBHOOK;
  if (!emailSent && emailNotificationUrl) {
    try {
      const res = await fetch(emailNotificationUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `[PulseAI] ${title}`,
          content: formattedMessage,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        emailSent = true;
        console.log("[Webhook Dispatch] Notification sent to configured webhook URL.");
      }
    } catch (whErr) {
      console.warn("[Webhook Dispatch Error]:", whErr);
    }
  }

  return {
    success: telegramSent || emailSent || errors.length === 0,
    telegramSent,
    emailSent,
    errors: errors.length > 0 ? errors : undefined,
  };
}
