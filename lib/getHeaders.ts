import { headers as nextHeaders } from 'next/headers';

export async function getHeaders(): Promise<ReadonlyHeaders> {
  // Some environments historically returned a Promise-like from headers().
  // Normalize to a concrete ReadonlyHeaders instance.
  const maybe = nextHeaders() as any;
  return typeof maybe?.then === 'function' ? await maybe : maybe;
}
