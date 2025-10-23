import { readIdentity } from '@/lib/identity';

export function GET(req: Request) {
  const id = readIdentity(req);
  return Response.json(id, { status: 200 });
}