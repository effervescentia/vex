import { AuthTransport } from '@api/lib';
import { atomWithZodStorage } from '@web/utils/state.util';
import z from 'zod';

const Credential = z.object({
  id: z.string(),
  transports: z.enum(Object.values(AuthTransport) as Array<`${AuthTransport}`>).array(),
});

export const preferredCredentialAtom = atomWithZodStorage('preferred-credential', Credential, null);
