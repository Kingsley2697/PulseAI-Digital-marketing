"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createStaffSession, createStaffUser, destroyStaffSession, getStaffSession, verifyStaffCredentials } from "@/lib/auth/staff";
import type { StaffRole } from "@/models/StaffUser";
import { AuditLog } from "@/models/AuditLog";
import { approveProposalForBrief } from "@/lib/automation/proposal-approval";
import { connectToDatabase } from "@/lib/db/mongodb";
import { AutomationTask } from "@/models/AutomationTask";

function redirectWithError(message: string): never {
  redirect(`/staff?error=${encodeURIComponent(message)}`);
}

export async function loginStaffAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const staff = await verifyStaffCredentials(email, password);
  if (!staff) {
    redirect("/staff/login?error=invalid");
  }
  await createStaffSession({ id: staff.id, email: staff.email, role: staff.role });
  redirect("/staff");
}

export async function logoutStaffAction() {
  await destroyStaffSession();
  redirect("/staff/login");
}

export async function approveProposalAction(formData: FormData) {
  const session = await getStaffSession();
  if (!session || !["admin", "strategist"].includes(session.role)) redirect("/staff/login");
  const briefId = String(formData.get("briefId") || "");
  if (!/^[a-f\d]{24}$/i.test(briefId)) redirectWithError("Invalid brief reference.");

  try {
    await approveProposalForBrief(briefId);
    await AuditLog.create({ actorId: session.id, actorEmail: session.email, action: "brief.proposal.approved", entityType: "brief", entityId: briefId });
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "Proposal could not be sent.");
  }

  revalidatePath("/staff");
  redirect("/staff?message=proposal-sent");
}

export async function updateAutomationTaskAction(formData: FormData) {
  const session = await getStaffSession();
  if (!session) redirect("/staff/login");
  const taskId = String(formData.get("taskId") || "");
  const status = String(formData.get("status") || "");
  const allowedStatuses = ["in_progress", "completed", "cancelled"];
  if (!/^[a-f\d]{24}$/i.test(taskId) || !allowedStatuses.includes(status)) {
    redirectWithError("Invalid task update.");
  }

  await connectToDatabase();
  await AutomationTask.findByIdAndUpdate(taskId, { status });
  await AuditLog.create({ actorId: session.id, actorEmail: session.email, action: "automation.task.updated", entityType: "automation", entityId: taskId, metadata: { status } });
  revalidatePath("/staff");
  redirect("/staff?message=task-updated");
}

export async function createStaffMemberAction(formData: FormData) {
  const session = await getStaffSession();
  if (!session || session.role !== "admin") redirect("/staff/login");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "reviewer") as StaffRole;
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12 || !["admin", "strategist", "reviewer"].includes(role)) {
    redirect("/staff?error=Invalid%20staff%20account%20details.");
  }
  try {
    const staff = await createStaffUser({ name, email, password, role });
    await AuditLog.create({ actorId: session.id, actorEmail: session.email, action: "staff.created", entityType: "staff", entityId: String(staff._id), metadata: { role } });
  } catch {
    redirect("/staff?error=That%20staff%20email%20already%20exists.");
  }
  revalidatePath("/staff");
  redirect("/staff?message=staff-created");
}
