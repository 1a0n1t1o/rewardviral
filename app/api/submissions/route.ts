import { NextResponse } from "next/server";

// DEV-ONLY in-memory store (resets on server restart)
const store: { items: { id: string; userId: string; text: string; ts: number }[] } = { items: [] };

export async function GET() {
  return NextResponse.json({ count: store.items.length });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = (body?.text ?? "").toString().trim();
  const userId = (body?.userId ?? "").toString();

  if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

  store.items.push({
    id: crypto.randomUUID(),
    userId,
    text,
    ts: Date.now(),
  });

  return NextResponse.json({ ok: true, count: store.items.length });
}
