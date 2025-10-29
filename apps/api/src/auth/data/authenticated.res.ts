import { AccountDetailsDTO } from '@api/account/data/account-details.dto';
import { type Static, t } from 'elysia';

export type Authenticated = Static<typeof AuthenticatedResponse>;

export const AuthenticatedResponse = t.Object({
  account: AccountDetailsDTO,
});
