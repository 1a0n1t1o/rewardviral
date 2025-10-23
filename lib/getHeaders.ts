import { headers as nextHeaders } from 'next/headers';

/**
 * Normalizes Next's headers() result across runtimes where it might
 * be returned as a thenable. We avoid using the internal ReadonlyHeaders
 * type and just return a standard Headers-compatible object.
 */
export async function getHeaders() {
  const maybe = nextHeaders() as unknown;

  // If some runtime returns a thenable, await it.
  const value =
    typeof (maybe as any)?.then === 'function' ? await (maybe as any) : maybe;

  return value as Headers;
}