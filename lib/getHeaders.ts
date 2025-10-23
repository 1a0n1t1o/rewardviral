import { headers } from 'next/headers';

/**
 * Return a Headers-like object.
 * - If a Request is supplied, use req.headers (always available).
 * - Otherwise, fall back to next/headers(), which is sync at runtime.
 */
export function getHeaders(req?: Request): Headers {
  if (req?.headers) return req.headers;

  // next/headers() is sync at runtime; cast to Headers to avoid TS drift
  const h = (headers as unknown as () => Headers)();
  return h;
}

/** Convenience getter with case-insensitive header name */
export function getHeader(name: string, req?: Request): string | null {
  const h = getHeaders(req);
  return h.get(name) ?? null;
}