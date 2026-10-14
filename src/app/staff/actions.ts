"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createStaffSession, destroyStaffSession, getStaffSession, verifyStaffCredentials } from "@/lib/auth/staff";
import { approveProposalForBrief } from "@/lib/automation/proposal-approval";
import { connectToDatabase } from "@/lib/db/mongodb";
import { AutomationTask } from "@/models/AutomationTask";

function redirectWithError(message: string): never {
  redirect(`/staff?error=${encodeURIComponent(message)}`);
}

export async function loginStaffAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!(await verifyStaffCredentials(email, password))) {
    redirect("/staff/login?error=invalid");
  }
  await createStaffSession(email);
  redirect("/staff");
}

export async function logoutStaffAction() {
  await destroyStaffSession();
  redirect("/staff/login");
}

export async function approveProposalAction(formData: FormData) {
  if (!(await getStaffSession())) redirect("/staff/login");
  const briefId = String(formData.get("briefId") || "");
  if (!/^[a-f\d]{24}$/i.test(briefId)) redirectWithError("Invalid brief reference.");

  try {
    await approveProposalForBrief(briefId);
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "Proposal could not be sent.");
  }

  revalidatePath("/staff");
  redirect("/staff?message=proposal-sent");
}

export async function updateAutomationTaskAction(formData: FormData) {
  if (!(await getStaffSession())) redirect("/staff/login");
  const taskId = String(formData.get("taskId") || "");
  const status = String(formData.get("status") || "");
  const allowedStatuses = ["in_progress", "completed", "cancelled"];
  if (!/^[a-f\d]{24}$/i.test(taskId) || !allowedStatuses.includes(status)) {
    redirectWithError("Invalid task update.");
  }

  await connectToDatabase();
  await AutomationTask.findByIdAndUpdate(taskId, { status });
  revalidatePath("/staff");
  redirect("/staff?message=task-updated");
}
