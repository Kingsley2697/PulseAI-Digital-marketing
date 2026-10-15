import "server-only";

type EmailMessage = {
  to: string | string[];
  subject: string;
  text: string;
};

function getEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL must be configured before sending email.");
  }
  return { apiKey, from };
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

/** Sends transactional email through Resend without exposing credentials to clients. */
export async function sendEmail({ to, subject, text }: EmailMessage) {
  const { apiKey, from } = getEmailConfiguration();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, text }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend delivery failed (${response.status}): ${details || "Unknown error"}`);
  }
}

export async function sendCampaignReadyEmail(input: {
  name: string;
  email: string;
  company: string;
  assetReviewUrl: string;
  onboardingUrl: string;
}) {
  await sendEmail({
    to: input.email,
    subject: `Your PulseAI campaign assets are ready for review`,
    text: [
      `Hi ${input.name},`,
      "",
      `Your initial AI-generated campaign assets for ${input.company} are ready.`,
      "",
      `Review the Canva assets: ${input.assetReviewUrl}`,
      `Continue onboarding and view your campaign workspace: ${input.onboardingUrl}`,
      "",
      "Please share any feedback in the workspace so our team can prepare the next revision.",
      "",
      "PulseAI Digital",
    ].join("\n"),
  });
}
