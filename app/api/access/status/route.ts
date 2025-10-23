import { identityFromRequest } from "@/lib/identity";

export async function GET(req: Request) {
  const ident = identityFromRequest(req);
  return Response.json(ident, {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}