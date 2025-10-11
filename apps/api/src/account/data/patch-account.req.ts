import { type Static, t } from 'elysia';
import { AccountDTO } from './account.dto';

export type PatchAccount = Static<typeof PatchAccountRequest>;

export const PatchAccountRequest = t.Partial(t.Pick(AccountDTO, [
  // TODO: implement me
]));
