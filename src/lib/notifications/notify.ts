/**
 * Staff notification gateway. Telegram is the only delivery channel for
 * brief, project, payment, and review notifications.
 */
export interface NotificationPayload {
  type: "BRIEF_SUBMITTED" | "CONTACT_INQUIRY" | "PAYMENT_CONFIRMED";
  title: string;
  data: Record<string, unknown>;
}

function escapeTelegramHtml(value: string) {
  return value.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character] || character);
}

function formatNotification({ type, title, data }: NotificationPayload) {
  const rows = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase());
      const content = Array.isArray(value) ? value.join(", ") : String(value);
      return `<b>${escapeTelegramHtml(label)}:</b> ${escapeTelegramHtml(content)}`;
    });

  return [
    "<b>PULSEAI DIGITAL ALERT</b>",
    `<b>Event:</b> ${escapeTelegramHtml(title)}`,
    `<b>Type:</b> ${escapeTelegramHtml(type)}`,
    "",
    ...rows,
    "",
    `<b>Timestamp:</b> ${new Date().toISOString()}`,
  ].join("\n").slice(0, 4_000);
}

export async function sendNotification(payload: NotificationPayload): Promise<{
  success: boolean;
  telegramSent: boolean;
  errors?: string[];
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return {
      success: false,
      telegramSent: false,
      errors: ["Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID."],
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatNotification(payload),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return { success: false, telegramSent: false, errors: [`Telegram delivery failed (${response.status}): ${details}`] };
    }

    return { success: true, telegramSent: true };
  } catch (error) {
    return {
      success: false,
      telegramSent: false,
      errors: [error instanceof Error ? `Telegram network error: ${error.message}` : "Telegram network error."],
    };
  }
}
