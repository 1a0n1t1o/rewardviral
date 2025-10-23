import { getHeader } from './getHeaders';

export type Identity = {
  userId: string | null;
  userToken: string | null;
};

/** New canonical helper */
export function getIdentity(req?: Request): Identity {
  const userId = getHeader('x-whop-user-id', req);
  const userToken = getHeader('x-whop-user-token', req);
  return { userId, userToken };
}

/** Back-compat alias for older imports */
export const readIdentity = getIdentity;