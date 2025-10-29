import { AccountDetailsDTO } from '@api/account/data/account-details.dto';
import { type Static, t } from 'elysia';

export type Signup = Static<typeof SignupResponse>;

export const SignupResponse = t.Object({
  account: AccountDetailsDTO,
});
