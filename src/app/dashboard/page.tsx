import { notFound } from "next/navigation";

// This route previously displayed every client's contact and payment information without authentication.
// Reintroduce it only behind a server-side staff authentication and authorization check.
export default function DashboardPage() {
  notFound();
}
