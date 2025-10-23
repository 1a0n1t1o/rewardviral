export function GET(req: Request) {
  const obj: Record<string, string> = {};
  // Request.headers always supports forEach with strong types
  req.headers.forEach((value, key) => {
    obj[key] = value;
  });
  return Response.json(obj, { status: 200 });
}