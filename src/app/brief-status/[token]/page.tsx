import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Brief status | PulseAI Digital" };

const statusCopy = {
  queued: ["Brief received", "Your strategy workspace is queued for preparation."],
  processing: ["Preparing your strategy", "Our AI workflow is preparing internal recommendations for the team."],
  ready_for_review: ["Strategy under review", "Your PulseAI strategist is reviewing the brief and will contact you with next steps."],
  failed: ["Brief received", "Our team has been notified and will continue preparing your brief manually."],
} as const;

export default function BriefStatusPage({ params }: PageProps<"/brief-status/[token]">) {
  return (
    <main className="min-h-screen bg-[#fbfaf8] px-4 py-20 text-slate-900">
      <Suspense fallback={<StatusShell />}>
        <BriefStatus params={params} />
      </Suspense>
    </main>
  );
}

function StatusShell() {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-wider text-[#ff5b37]">PulseAI Digital</p>
      <h1 className="mt-2 text-3xl font-extrabold">Loading your strategy workspace</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">We are securely retrieving your brief status.</p>
    </section>
  );
}

async function BriefStatus({ params }: Pick<PageProps<"/brief-status/[token]">, "params">) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,}$/.test(token)) notFound();
  await connectToDatabase();
  const brief = await Brief.findOne({ clientTrackingToken: token }).lean();
  if (!brief) notFound();
  const [title, description] = statusCopy[brief.automationStatus] || statusCopy.queued;
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-wider text-[#ff5b37]">PulseAI Digital</p>
      <h1 className="mt-2 text-3xl font-extrabold">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
      <dl className="mt-7 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-slate-500">Business</dt><dd className="font-bold">{brief.businessName}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-slate-500">Submitted</dt><dd>{new Date(brief.createdAt).toLocaleDateString()}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd className="font-bold capitalize">{brief.automationStatus.replaceAll("_", " ")}</dd></div>
      </dl>
    </section>
  );
}
