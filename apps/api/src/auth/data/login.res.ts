import { AccountDetailsDTO } from '@api/account/data/account-details.dto';
import { type Static, t } from 'elysia';

export type Login = Static<typeof LoginResponse>;

export const LoginResponse = t.Object({
  account: AccountDetailsDTO,
});
