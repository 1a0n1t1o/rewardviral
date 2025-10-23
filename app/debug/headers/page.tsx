import { headers } from "next/headers";

export default function DebugHeadersPage() {
  const h = headers(); // not a Promise
  const obj: Record<string, string> = {};
  // ReadonlyHeaders supports forEach
  h.forEach((value, key) => {
    obj[key] = value;
  });
  return (
    <pre className="whitespace-pre-wrap break-words">
      {JSON.stringify(obj, null, 2)}
    </pre>
  );
}