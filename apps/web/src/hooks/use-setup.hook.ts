import { useEffect, useRef } from 'react';

export const useSetup = (callback: () => unknown) => {
  const usedRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this hook intentionally ignores further updates
  useEffect(() => {
    if (usedRef.current) return;
    usedRef.current = true;

    callback();
  }, []);
};
