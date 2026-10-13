type LeadSource = "brief" | "contact";

export type LeadAutomationInput = {
  source: LeadSource;
  recordId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  budget?: string;
  services?: string[];
  goals?: string[];
  message?: string;
  timeline?: string;
};

export type LeadAnalysis = {
  summary: string;
  qualification: "high" | "medium" | "low";
  recommendedNextStep: string;
  suggestedServices: string[];
  internalNotes: string;
};

export type LeadAutomationResult = {
  analysis?: LeadAnalysis;
  hubspotContactId?: string;
  aiAnalyzed: boolean;
  crmCreated: boolean;
  emailSent: boolean;
  whatsappSent: boolean;
  errors: string[];
};

const defaultAnalysis: LeadAnalysis = {
  summary: "New lead submitted. Review the submitted requirements before responding.",
  qualification: "medium",
  recommendedNextStep: "Review the brief and contact the lead within one business day.",
  suggestedServices: [],
  internalNotes: "Automated AI analysis is not configured.",
};

function safeText(value: string | undefined, maxLength = 1_500) {
  return (value || "").trim().slice(0, maxLength);
}

async function analyzeLead(input: LeadAutomationInput): Promise<LeadAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return defaultAnalysis;

  const leadContext = {
    source: input.source,
    company: safeText(input.company),
    industry: safeText(input.industry),
    budget: safeText(input.budget),
    services: input.services || [],
    goals: input.goals || [],
    message: safeText(input.message),
    timeline: safeText(input.timeline),
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_LEAD_MODEL || "gpt-5-mini",
      store: false,
      instructions:
        "You are a B2B growth-agency lead analyst. Analyze only the supplied lead details. Do not invent facts, promise outcomes, set prices, or make decisions on behalf of the agency. Return valid JSON matching the required schema.",
      input: `Lead details:\n${JSON.stringify(leadContext)}`,
      text: {
        format: {
          type: "json_schema",
          name: "lead_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              qualification: { type: "string", enum: ["high", "medium", "low"] },
              recommendedNextStep: { type: "string" },
              suggestedServices: { type: "array", items: { type: "string" } },
              internalNotes: { type: "string" },
            },
            required: [
              "summary",
              "qualification",
              "recommendedNextStep",
              "suggestedServices",
              "internalNotes",
            ],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI lead analysis failed (${response.status}).`);
  }

  const data = (await response.json()) as { output_text?: string };
  if (!data.output_text) throw new Error("OpenAI returned no lead analysis.");
  return JSON.parse(data.output_text) as LeadAnalysis;
}

async function createHubSpotContact(input: LeadAutomationInput) {
  const accessToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!accessToken) return undefined;

  const nameParts = input.name.trim().split(/\s+/, 2);
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        email: input.email,
        firstname: nameParts[0] || input.name,
        lastname: nameParts[1] || "",
        phone: input.phone || "",
        company: input.company || "",
        lifecyclestage: "lead",
      },
    }),
  });

  if (!response.ok) throw new Error(`HubSpot contact creation failed (${response.status}).`);
  const data = (await response.json()) as { id?: string };
  return data.id;
}

function acknowledgementText(input: LeadAutomationInput) {
  const scheduleUrl = process.env.CALENDLY_SCHEDULING_URL;
  const greeting = `Hi ${input.name}, thanks for contacting PulseAI Digital.`;
  const schedule = scheduleUrl ? ` You can choose a strategy-call time here: ${scheduleUrl}` : "";
  return `${greeting} We received your request and our team will review it shortly.${schedule}`;
}

async function sendAcknowledgementEmail(input: LeadAutomationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: "We received your PulseAI inquiry",
      text: acknowledgementText(input),
    }),
  });
  if (!response.ok) throw new Error(`Resend acknowledgement failed (${response.status}).`);
  return true;
}

async function sendWhatsAppAcknowledgement(input: LeadAutomationInput) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  if (!token || !phoneNumberId || !templateName || !input.phone) return false;

  const to = input.phone.replace(/[^0-9]/g, "");
  if (!to) return false;

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: input.name }],
          },
        ],
      },
    }),
  });
  if (!response.ok) throw new Error(`WhatsApp acknowledgement failed (${response.status}).`);
  return true;
}

export async function runLeadAutomation(input: LeadAutomationInput): Promise<LeadAutomationResult> {
  const errors: string[] = [];
  let analysis = defaultAnalysis;
  let aiAnalyzed = false;

  try {
    analysis = await analyzeLead(input);
    aiAnalyzed = Boolean(process.env.OPENAI_API_KEY);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Lead analysis failed.");
  }

  const [hubspot, email, whatsapp] = await Promise.allSettled([
    createHubSpotContact(input),
    sendAcknowledgementEmail(input),
    sendWhatsAppAcknowledgement(input),
  ]);

  for (const result of [hubspot, email, whatsapp]) {
    if (result.status === "rejected") {
      errors.push(result.reason instanceof Error ? result.reason.message : "Lead automation failed.");
    }
  }

  return {
    analysis,
    hubspotContactId: hubspot.status === "fulfilled" ? hubspot.value : undefined,
    aiAnalyzed,
    crmCreated: hubspot.status === "fulfilled" && Boolean(hubspot.value),
    emailSent: email.status === "fulfilled" && email.value,
    whatsappSent: whatsapp.status === "fulfilled" && whatsapp.value,
    errors,
  };
}
