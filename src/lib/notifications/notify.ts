/**
 * Production Notification Engine (Telegram Bot & Email Service)
 * Dispatches live alerts when a client submits a marketing brief, contact inquiry, or payment.
 */

interface NotificationPayload {
  type: "BRIEF_SUBMITTED" | "CONTACT_INQUIRY" | "PAYMENT_CONFIRMED";
  title: string;
  data: Record<string, unknown>;
  staffReviewAlert?: {
    dashboardUrl: string;
    summary: string;
  };
}

export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; telegramSent: boolean; emailSent: boolean; staffWhatsAppSent: boolean; errors?: string[] }> {
  const { type, title, data, staffReviewAlert } = payload;
  const errors: string[] = [];
  let telegramSent = false;
  let emailSent = false;
  let staffWhatsAppSent = false;

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
  const recipientEmail =
    process.env.STAFF_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL || "growth@pulseai.digital";
  if (isEmailConfigured()) {
    try {
      await sendEmail({ to: recipientEmail, subject: `[PulseAI] ${title}`, text: formattedMessage.replace(/[*_]/g, "") });
      console.log(`[Resend Email] Live notification delivered to ${recipientEmail}`);
      emailSent = true;
    } catch (emailErr) {
      console.error("[Resend Email Network Error]:", emailErr);
      errors.push(emailErr instanceof Error ? `Email error: ${emailErr.message}` : "Email network error");
    }
  }

  // 3. Alert the assigned staff member through an approved WhatsApp template.
  // Business-initiated WhatsApp messages must use a pre-approved template.
  const staffWhatsAppNumber = process.env.STAFF_WHATSAPP_NUMBER;
  const staffWhatsAppTemplate = process.env.STAFF_WHATSAPP_TEMPLATE_NAME;
  const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (staffReviewAlert && staffWhatsAppNumber && staffWhatsAppTemplate && whatsappAccessToken && whatsappPhoneNumberId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v22.0/${whatsappPhoneNumberId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${whatsappAccessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: staffWhatsAppNumber.replace(/[^0-9]/g, ""),
          type: "template",
          template: {
            name: staffWhatsAppTemplate,
            language: { code: process.env.STAFF_WHATSAPP_TEMPLATE_LANGUAGE || "en" },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: `${staffReviewAlert.summary}\n${staffReviewAlert.dashboardUrl}`,
                  },
                ],
              },
            ],
          },
        }),
      });

      if (response.ok) {
        staffWhatsAppSent = true;
      } else {
        const whatsappError = await response.text();
        console.warn("[Staff WhatsApp Alert Warning]:", whatsappError);
        errors.push(`Staff WhatsApp error: ${whatsappError}`);
      }
    } catch (whatsappError) {
      console.error("[Staff WhatsApp Alert Network Error]:", whatsappError);
      errors.push("Staff WhatsApp network error");
    }
  } else if (staffReviewAlert) {
    console.log(
      "[Notification Engine] Staff WhatsApp alert is not configured. Add STAFF_WHATSAPP_NUMBER and STAFF_WHATSAPP_TEMPLATE_NAME to enable it."
    );
  }

  // 4. Fallback / Webhook Email Dispatch
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
    staffWhatsAppSent,
    errors: errors.length > 0 ? errors : undefined,
  };
}
import { isEmailConfigured, sendEmail } from "@/lib/email";
