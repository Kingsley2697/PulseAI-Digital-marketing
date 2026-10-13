# PulseAI Digital

Production marketing-lead intake and payment application.

## Lead automation

When a visitor submits the onboarding brief or contact form, the app always stores the submission first. If configured, it then:

1. Uses OpenRouter to generate an internal lead summary, qualification level, and recommended next step.
2. Creates a HubSpot CRM contact.
3. Sends the lead a Resend email acknowledgement, including the optional Calendly booking link.
4. Sends a pre-approved WhatsApp Cloud API template acknowledgement.
5. Sends the team its existing Telegram/email notification with the AI recommendation.
6. Produces an internal proposal draft, 30-day launch-plan draft, and approval-gated task queue for full briefs.

No provider is called until its environment variables are supplied. Failures in an optional automation are recorded without rejecting the client submission.

Copy the variables from `.env.local.example` into your deployment environment. The required configuration for the full workflow is:

```text
MONGODB_URI=
OPENROUTER_API_KEY=
OPENROUTER_LEAD_ANALYTICS_MODEL=
OPENROUTER_CLIENT_COPYWRITING_MODEL=
OPENROUTER_BULK_BRAINSTORMING_MODEL=
HUBSPOT_PRIVATE_APP_TOKEN=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CALENDLY_SCHEDULING_URL=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_TEMPLATE_NAME=
INTERNAL_AUTOMATION_TOKEN=
```

For WhatsApp, create and approve a business-initiated template containing one body variable: the customer name. The app does not send unapproved free-form outbound messages.

The public list endpoints for brief and contact records are deliberately disabled. Re-enable staff views only after adding server-side authentication and authorization.

Proposal delivery requires a staff-only `POST /api/internal/briefs/:briefId/approve-proposal` request with `Authorization: Bearer <INTERNAL_AUTOMATION_TOKEN>`. This deliberate approval boundary prevents AI from committing the business to pricing, contractual terms, advertising spend, or campaign publication.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
