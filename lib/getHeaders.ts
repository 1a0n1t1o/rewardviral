import { headers as nextHeaders } from 'next/headers';

export async function getHeaders(): Promise<ReadonlyHeaders> {
  // Normalize in case some env returns a thenable.
  const maybe = nextHeaders() as any;
  return typeof maybe?.then === 'function' ? await maybe : maybe;
}