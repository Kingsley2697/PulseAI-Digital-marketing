import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff";
import { loginStaffAction } from "@/app/staff/actions";

export const instant = false;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getStaffSession()) redirect("/staff");
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#fbfaf8] px-4 py-16 text-slate-900">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[#ff5b37]">PulseAI Digital</p>
        <h1 className="mt-2 text-3xl font-extrabold">Staff approval desk</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Sign in to review AI-prepared briefs and approve client proposals.
        </p>
        {error && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">Invalid staff credentials.</p>}
        <form action={loginStaffAction} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-slate-700">
            Staff email
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-normal outline-none focus:border-[#ff5b37]"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-normal outline-none focus:border-[#ff5b37]"
            />
          </label>
          <button className="w-full rounded-xl bg-[#ff5b37] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-[#e84a26]">
            Sign in securely
          </button>
        </form>
      </section>
    </main>
  );
}
