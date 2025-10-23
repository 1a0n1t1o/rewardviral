import { readIdentity } from '@/lib/identity';

export default function DashboardPage() {
  const access = readIdentity();

  if (!access.hasAccess || access.accessLevel === 'no_access') {
    return (
      <main className="p-4">
        <h1 className="text-xl font-semibold">Welcome to Dashboard</h1>
        <div className="mt-4 border p-3">
          You don't have access yet. If a "Get Access" button is available below, use it to purchase. Otherwise contact support.
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-2">Hello {access.userId ?? 'member'} — role: {access.role ?? 'member'}</p>
    </main>
  );
}