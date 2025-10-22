export type MinimalWhopUser = {
  id: string;
  username?: string | null;
  name?: string | null;
};

export function getWhopDisplayName(u: MinimalWhopUser | null | undefined): string {
  if (!u) return "Unknown user";
  return (u.name || u.username || u.id || "Unknown user").toString();
}
