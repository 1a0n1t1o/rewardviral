// app/dashboard/page.tsx
import DashboardGate from "@/components/DashboardGate";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
      <DashboardGate />
    </main>
  );
}