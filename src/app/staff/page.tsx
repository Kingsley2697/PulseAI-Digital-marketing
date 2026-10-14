import { redirect } from "next/navigation";
import { AlertCircle, CheckCircle2, LogOut, Send, Workflow } from "lucide-react";
import { getStaffSession } from "@/lib/auth/staff";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Brief } from "@/models/Brief";
import { AutomationTask } from "@/models/AutomationTask";
import { approveProposalAction, logoutStaffAction, updateAutomationTaskAction } from "@/app/staff/actions";

const statusStyles = {
  pending_review: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-sky-50 text-sky-800 border-sky-200",
  in_progress: "bg-blue-50 text-blue-800 border-blue-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

export default async function StaffDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const session = await getStaffSession();
  if (!session) redirect("/staff/login");
  const { message, error } = await searchParams;

  await connectToDatabase();
  const [briefs, tasks] = await Promise.all([
    Brief.find().sort({ createdAt: -1 }).limit(50).lean(),
    AutomationTask.find().sort({ createdAt: -1 }).limit(250).lean(),
  ]);
  const tasksByBrief = new Map<string, (typeof tasks)>();
  for (const task of tasks) {
    if (task.sourceType !== "brief") continue;
    const key = String(task.sourceId);
    tasksByBrief.set(key, [...(tasksByBrief.get(key) || []), task]);
  }

  return (
    <main className="min-h-screen bg-[#fbfaf8] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#ff5b37]">Staff-only workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Approval desk</h1>
            <p className="mt-2 text-sm text-slate-600">Signed in as {session.email}</p>
          </div>
          <form action={logoutStaffAction}>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </header>

        {message && (
          <p className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5" /> {message === "proposal-sent" ? "Proposal sent and onboarding activated." : "Task updated."}
          </p>
        )}
        {error && (
          <p className="mb-6 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="h-5 w-5" /> {error}
          </p>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-500">Briefs</p><p className="mt-1 text-3xl font-black">{briefs.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-500">Pending review</p><p className="mt-1 text-3xl font-black text-amber-600">{tasks.filter((task) => task.status === "pending_review").length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-500">In progress</p><p className="mt-1 text-3xl font-black text-blue-600">{tasks.filter((task) => task.status === "in_progress").length}</p></div>
        </div>

        <section className="space-y-5">
          {briefs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">No client briefs have been submitted yet.</div>
          ) : briefs.map((brief) => {
            const briefTasks = tasksByBrief.get(String(brief._id)) || [];
            const proposalSent = briefTasks.some((task) => task.category === "proposal" && task.status === "completed");
            return (
              <article key={String(brief._id)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#ff5b37]">{brief.industry}</p>
                    <h2 className="mt-1 text-xl font-extrabold">{brief.businessName}</h2>
                    <p className="mt-1 text-sm text-slate-600">{brief.contactName} · {brief.email} · {brief.phone}</p>
                  </div>
                  {!proposalSent && brief.proposalDraft?.body && (
                    <form action={approveProposalAction}>
                      <input type="hidden" name="briefId" value={String(brief._id)} />
                      <button className="inline-flex items-center gap-2 rounded-xl bg-[#ff5b37] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[#e84a26]">
                        <Send className="h-4 w-4" /> Approve &amp; send proposal
                      </button>
                    </form>
                  )}
                </div>

                <div className="grid gap-5 pt-5 lg:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-900">AI lead analysis</p>
                    <p className="mt-2 text-slate-700">{brief.aiLeadAnalysis?.summary || "Awaiting configured AI analysis."}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#ff5b37]">{brief.aiLeadAnalysis?.qualification || "unclassified"}</p>
                    <p className="mt-1 text-xs text-slate-600">{brief.aiLeadAnalysis?.recommendedNextStep || "Review manually."}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-900">Proposal draft</p>
                    <p className="mt-2 font-medium text-slate-700">{brief.proposalDraft?.subject || "No draft available"}</p>
                    <p className="mt-2 line-clamp-5 whitespace-pre-line text-xs leading-relaxed text-slate-600">{brief.proposalDraft?.body || "Configure OpenRouter and submit a new brief to generate a proposal."}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-900">30-day launch plan</p>
                    <p className="mt-2 text-slate-700">{brief.launchPlan?.positioning || "No launch plan available"}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">{(brief.launchPlan?.firstThirtyDays || []).slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="flex items-center gap-2 text-sm font-bold"><Workflow className="h-4 w-4 text-[#ff5b37]" /> Workflow tasks</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {briefTasks.map((task) => (
                      <div key={String(task._id)} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-3">
                        <div><p className="text-sm font-bold">{task.title}</p><p className="mt-1 text-xs text-slate-600">{task.description}</p></div>
                        <div className="shrink-0 text-right"><span className={`inline-block rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[task.status]}`}>{task.status.replace("_", " ")}</span>{!['completed', 'cancelled'].includes(task.status) && <form action={updateAutomationTaskAction} className="mt-2"><input type="hidden" name="taskId" value={String(task._id)} /><input type="hidden" name="status" value={task.status === "pending_review" ? "in_progress" : "completed"} /><button className="text-xs font-bold text-[#ff5b37] hover:underline">{task.status === "pending_review" ? "Start" : "Complete"}</button></form>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
