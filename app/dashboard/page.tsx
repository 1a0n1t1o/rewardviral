// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
      <div className="rounded border p-4">
        <p className="text-sm opacity-80">
          Open from Whop: You must open this app from Whop so we can identify you.
        </p>
      </div>
    </main>
  );
}