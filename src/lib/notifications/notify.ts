/**
 * Telegram & Email Notification Dispatcher
 * Dispatches real-time alerts when a prospective client completes an onboarding brief or contact inquiry.
 */

interface NotificationPayload {
  type: "BRIEF_SUBMITTED" | "CONTACT_INQUIRY" | "PAYMENT_CONFIRMED";
  title: string;
  data: Record<string, unknown>;
}

export async function sendNotification(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
  const { type, title, data } = payload;
  console.log(`[Notification Engine] Processing event: ${type} - ${title}`);

  // Format message for Telegram
  let formattedMessage = `⚡ *PULSEAI DIGITAL NOTIFICATION* ⚡\n`;
  formattedMessage += `*Event:* ${title}\n\n`;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "") {
      const displayKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      const valStr = Array.isArray(value) ? value.join(", ") : String(value);
      formattedMessage += `• *${displayKey}:* ${valStr}\n`;
    }
  }

  formattedMessage += `\n📅 *Timestamp:* ${new Date().toISOString()}`;

  // 1. Send via Telegram if configured
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    try {
      const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const res = await fetch(url, {
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
        console.warn("[Telegram Notification Warning]:", errorText);
      } else {
        console.log("[Telegram Notification] Alert successfully delivered to Telegram.");
      }
    } catch (telegramErr) {
      console.warn("[Telegram Notification Network Error]:", telegramErr);
    }
  } else {
    console.log(
      "[Notification Engine] Telegram credentials not configured in .env.local (Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to enable live alerts)."
    );
  }

  // 2. Send via Email Webhook or SMTP if configured
  const emailNotificationUrl = process.env.EMAIL_NOTIFICATION_WEBHOOK;
  if (emailNotificationUrl) {
    try {
      await fetch(emailNotificationUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `[PulseAI] ${title}`,
          content: formattedMessage,
          data,
        }),
      });
      console.log("[Email Notification] Alert sent to configured webhook.");
    } catch (emailErr) {
      console.warn("[Email Notification Error]:", emailErr);
    }
  }

  return { success: true };
}
