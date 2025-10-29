import { Thumbmark } from '@thumbmarkjs/thumbmarkjs';
import { useEffect, useState } from 'react';

interface BrowserFingerprint {
  thumbmark: string;
  components: Record<string, unknown>;
}

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);

  useEffect(() => {
    new Thumbmark().get().then((result: BrowserFingerprint) => setFingerprint(result));
  }, []);

  return fingerprint;
};
