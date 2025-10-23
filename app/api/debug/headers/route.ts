// Keep this route minimal and 100% standard Web API to avoid typing issues.
export async function GET(req: Request) {
  const out: Record<string, string> = {};
  // Web standard: Request.headers is a Headers object that supports forEach
  req.headers.forEach((value, key) => {
    out[String(key)] = String(value);
  });
  return new Response(JSON.stringify(out, null, 2), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}