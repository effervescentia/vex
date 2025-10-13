import { DataService } from '@api/global/data.service';
import { server } from '@passwordless-id/webauthn';
import type { NegotiateSignup } from './data/negotiate-signup.req';

export class AuthService extends DataService {
  async negotiateSignup(data: NegotiateSignup): Promise<NegotiateSignup> {
    const challenge = server.randomChallenge();

    return { challenge };
  }

  async completeSignup() {}
}
