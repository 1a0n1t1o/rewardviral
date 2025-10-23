import { headers } from 'next/headers';

/**
 * Return a Headers-like object.
 * - If a Request is supplied, use req.headers.
 * - Otherwise, fall back to next/headers() (sync at runtime).
 */
export function getHeaders(req?: Request): Headers {
  if (req?.headers) return req.headers;
  const h = (headers as unknown as () => Headers)();
  return h;
}

/** Case-insensitive single-header getter */
export function getHeader(name: string, req?: Request): string | null {
  const h = getHeaders(req);
  return h.get(name) ?? null;
}