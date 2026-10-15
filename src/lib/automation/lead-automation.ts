import { runAiTask } from "@/lib/ai/openrouter";
import { sendEmail } from "@/lib/email";

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
  proposalDraft?: ProposalDraft;
  launchPlan?: LaunchPlan;
  clientReplyDraft?: string;
  tasks: AutomationTaskDraft[];
  hubspotContactId?: string;
  aiAnalyzed: boolean;
  crmCreated: boolean;
  emailSent: boolean;
  whatsappSent: boolean;
  errors: string[];
};

export type ProposalDraft = {
  subject: string;
  body: string;
  scope: string[];
  nextSteps: string[];
};

export type LaunchPlan = {
  positioning: string;
  firstThirtyDays: string[];
  campaignIdeas: string[];
};

export type AutomationTaskDraft = {
  title: string;
  description: string;
  category: "review" | "proposal" | "onboarding" | "campaign";
};

export async function sendApprovedProposal(input: {
  name: string;
  email: string;
  company: string;
  proposal: ProposalDraft;
}) {
  const proposalText = [
    `Hi ${input.name},`,
    "",
    input.proposal.body,
    "",
    "Proposed scope:",
    ...input.proposal.scope.map((item) => `- ${item}`),
    "",
    "Next steps:",
    ...input.proposal.nextSteps.map((item) => `- ${item}`),
    "",
    "Reply to this email or use the scheduling link previously shared to discuss the proposal.",
  ].join("\n");

  await sendEmail({
    to: input.email,
    subject: input.proposal.subject || `Your PulseAI proposal for ${input.company}`,
    text: proposalText,
  });
}

const defaultAnalysis: LeadAnalysis = {
  summary: "New lead submitted. Review the submitted requirements before responding.",
  qualification: "medium",
  recommendedNextStep: "Review the brief and contact the lead within one business day.",
  suggestedServices: [],
  internalNotes: "Automated AI analysis is not configured.",
};

const defaultTasks: AutomationTaskDraft[] = [
  {
    title: "Review AI lead analysis",
    description: "Validate the lead context, qualification, and recommended next step before client-facing action.",
    category: "review",
  },
  {
    title: "Approve client proposal",
    description: "Confirm commercial scope, pricing, and terms before any proposal is sent.",
    category: "proposal",
  },
];

function safeText(value: string | undefined, maxLength = 1_500) {
  return (value || "").trim().slice(0, maxLength);
}

async function analyzeLead(input: LeadAutomationInput): Promise<LeadAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
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

  const output = await runAiTask("backend_lead_scoring", {
    systemPrompt:
      "You are a B2B growth-agency lead analyst. Analyze only the supplied lead details. Do not invent facts, promise outcomes, set prices, or make decisions on behalf of the agency. Return JSON only with summary, qualification (high, medium, or low), recommendedNextStep, suggestedServices (array), and internalNotes.",
    userPrompt: `Lead details:\n${JSON.stringify(leadContext)}`,
    responseFormat: "json",
  });
  return JSON.parse(output) as LeadAnalysis;
}

async function createProposalDraft(input: LeadAutomationInput, analysis: LeadAnalysis): Promise<ProposalDraft> {
  const output = await runAiTask("client_copywriting", {
    systemPrompt:
      "You write concise, professional B2B agency proposal drafts. Use only supplied facts. Do not quote a price, guarantee results, claim work has started, or make contractual commitments. Return JSON only with subject, body, scope (array), and nextSteps (array).",
    userPrompt: `Create an internal proposal draft for this lead. It requires human approval before sending.\nLead: ${JSON.stringify({
      company: input.company,
      industry: input.industry,
      budget: input.budget,
      services: input.services,
      goals: input.goals,
      timeline: input.timeline,
      message: input.message,
      analysis,
    })}`,
    responseFormat: "json",
    maxTokens: 1_000,
    temperature: 0.4,
  });

  return JSON.parse(output) as ProposalDraft;
}

async function createLaunchPlan(input: LeadAutomationInput, analysis: LeadAnalysis): Promise<LaunchPlan> {
  const output = await runAiTask("bulk_brainstorming", {
    systemPrompt:
      "You are an internal growth-marketing planner. Generate practical, non-guaranteed starting ideas from the supplied facts. Do not invent client assets, claim results, or authorize advertising spend. Return JSON only with positioning, firstThirtyDays (array), and campaignIdeas (array).",
    userPrompt: `Create an internal 30-day launch-plan draft for this lead. It requires strategy-team review before use.\nLead: ${JSON.stringify({
      company: input.company,
      industry: input.industry,
      budget: input.budget,
      services: input.services,
      goals: input.goals,
      timeline: input.timeline,
      message: input.message,
      analysis,
    })}`,
    responseFormat: "json",
    maxTokens: 1_200,
    temperature: 0.7,
  });

  return JSON.parse(output) as LaunchPlan;
}

async function createClientReplyDraft(input: LeadAutomationInput, analysis: LeadAnalysis) {
  return runAiTask("client_copywriting", {
    systemPrompt:
      "Write a concise and warm internal email-reply draft for a B2B agency. Do not state pricing, make guarantees, or claim work has begun. It must invite the lead to schedule a call if a link is supplied.",
    userPrompt: `Draft a reply to this enquiry. This is an internal draft requiring approval before it is sent.\nLead: ${JSON.stringify({
      name: input.name,
      company: input.company,
      service: input.services,
      message: input.message,
      analysis,
      schedulingUrl: process.env.CALENDLY_SCHEDULING_URL || "",
    })}`,
    maxTokens: 500,
    temperature: 0.4,
  });
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
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return false;
  await sendEmail({ to: input.email, subject: "We received your PulseAI inquiry", text: acknowledgementText(input) });
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
  let proposalDraft: ProposalDraft | undefined;
  let launchPlan: LaunchPlan | undefined;
  let clientReplyDraft: string | undefined;

  try {
    analysis = await analyzeLead(input);
    aiAnalyzed = Boolean(process.env.OPENROUTER_API_KEY);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Lead analysis failed.");
  }

  if (process.env.OPENROUTER_API_KEY) {
    if (input.source === "brief") {
      const [proposal, plan] = await Promise.allSettled([
        createProposalDraft(input, analysis),
        createLaunchPlan(input, analysis),
      ]);
      if (proposal.status === "fulfilled") proposalDraft = proposal.value;
      else errors.push(proposal.reason instanceof Error ? proposal.reason.message : "Proposal drafting failed.");
      if (plan.status === "fulfilled") launchPlan = plan.value;
      else errors.push(plan.reason instanceof Error ? plan.reason.message : "Launch-plan drafting failed.");
    } else {
      try {
        clientReplyDraft = await createClientReplyDraft(input, analysis);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Client reply drafting failed.");
      }
    }
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
    proposalDraft,
    launchPlan,
    clientReplyDraft,
    tasks: input.source === "brief"
      ? [
          ...defaultTasks,
          {
            title: "Review 30-day launch plan",
            description: "Validate channels, creative ideas, tracking, and dependencies before onboarding starts.",
            category: "onboarding",
          },
          {
            title: "Approve campaign activation",
            description: "Confirm client approval, access, tracking, creative, and ad-spend authorization before launch.",
            category: "campaign",
          },
        ]
      : defaultTasks,
    hubspotContactId: hubspot.status === "fulfilled" ? hubspot.value : undefined,
    aiAnalyzed,
    crmCreated: hubspot.status === "fulfilled" && Boolean(hubspot.value),
    emailSent: email.status === "fulfilled" && email.value,
    whatsappSent: whatsapp.status === "fulfilled" && whatsapp.value,
    errors,
  };
}
