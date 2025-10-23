import { readIdentity } from '@/lib/identity';

export default function DashboardPage() {
  const access = readIdentity();

  if (access.accessLevel === 'no_access') {
    return (
      <main className="p-4">
        <h1>Welcome to Dashboard</h1>
        <div className="border p-3 mt-3">
          You don't have access yet. If a "Get Access" button is available below, use it to purchase. Otherwise contact support.
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <h1>Welcome to Dashboard</h1>
      <p className="mt-3">Hello {access.userId ?? 'member'} — you have {access.accessLevel} access.</p>
      {/* member UI here */}
    </main>
  );
}