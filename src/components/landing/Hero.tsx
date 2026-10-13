import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const engagementSteps = [
  "Tell us about your business and priorities.",
  "Receive a tailored scope and commercial proposal.",
  "Approve your plan before campaign work begins.",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-radial-glow py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#fed7cc] bg-[#fff2ef] px-3.5 py-1.5 text-xs font-bold text-[#ff5b37] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#ff5b37]" />
            <span className="tracking-wide uppercase text-[11px]">AI-powered growth services</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-6xl">
            Smarter Marketing <br />
            Bigger <span className="font-serif italic text-[#ff5b37]">Impacts</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            PulseAI helps businesses plan, launch, and improve digital marketing programs with practical AI
            workflows and experienced strategic guidance.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5b37] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] hover:bg-[#e84a26]"
            >
              <span>Start Your Brief</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#roi-calculator"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50"
            >
              <span>Explore Planning Estimates</span>
              <ArrowRight className="h-4 w-4 text-[#ff5b37]" />
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-orange-950/5 sm:p-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2ef] text-[#ff5b37]">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#ff5b37]">A clear way to begin</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Build the right marketing plan before you commit.
          </h2>
          <ol className="mt-7 space-y-4">
            {engagementSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fff2ef] text-xs font-bold text-[#ff5b37]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5b37]" />
            <span>Every engagement is reviewed against your goals, budget, and delivery requirements.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
