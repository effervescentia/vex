interface PublicKeyCredentialExtension {
  signalCurrentUserDetails(options: { rpId: string; userId: string; name: string; displayName: string }): Promise<void>;

  signalUnknownCredential(options: { credentialId: string; rpId: string }): Promise<void>;
}

export const hasPublicKeySignalAPI = (
  api: typeof PublicKeyCredential,
): api is typeof PublicKeyCredential & PublicKeyCredentialExtension =>
  'signalCurrentUserDetails' in api &&
  typeof api.signalCurrentUserDetails === 'function' &&
  'signalUnknownCredential' in api &&
  typeof api.signalUnknownCredential === 'function';
