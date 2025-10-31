import { client as webauthn } from '@passwordless-id/webauthn';
import { DOMAIN } from '@web/app/app.const';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { accountAtom } from '@web/data/account.atom';
import { preferredCredentialAtom } from '@web/data/preferred-credential.atom';
import { hasPublicKeySignalAPI } from '@web/utils/capability.util';
import { useAtom, useSetAtom } from 'jotai';

export const Login: React.FC = () => {
  const setAccount = useSetAtom(accountAtom);
  const [preferredCredential, setPreferredCredential] = useAtom(preferredCredentialAtom);

  const login = async () => {
    const { challenge } = await client()
      .auth.login.negotiate.post({})
      .then((result) => {
        if (result.error) throw result.error;
        return result.data;
      });

    const authentication = await webauthn.authenticate({
      hints: ['client-device'],
      userVerification: 'required',
      allowCredentials: preferredCredential ? [preferredCredential] : undefined,
      challenge,
      domain: DOMAIN,
      timeout: 90_000,
    });

    const { account } = await client()
      .auth.login.verify.post({ authentication })
      .then((result) => {
        if (result.error) throw result.error;
        return result.data;
      })
      .catch(async (err) => {
        setPreferredCredential(null);

        if (hasPublicKeySignalAPI(PublicKeyCredential)) {
          await PublicKeyCredential.signalUnknownCredential({
            credentialId: authentication.id,
            rpId: DOMAIN,
          });
        }

        throw err;
      });

    const [alias] = account.aliases;
    if (!alias) return;

    if (hasPublicKeySignalAPI(PublicKeyCredential)) {
      await PublicKeyCredential.signalCurrentUserDetails({
        userId: authentication.response.userHandle!,
        rpId: DOMAIN,
        name: alias.name,
        displayName: alias.name,
      });
    }

    setAccount({
      id: account.id,
      aliases: account.aliases.map(({ name }) => name),
    });

    routes.home().replace();
  };

  return (
    <div>
      <button type="button" onClick={login}>
        login
      </button>
      <a {...routes.signup().link}>signup</a>
    </div>
  );
};
