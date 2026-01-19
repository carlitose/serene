import { useState, useCallback } from 'react';

interface BlockState {
  isBlocked: boolean;
  blockedUrl: string | null;
}

interface UseBlockStateReturn {
  state: BlockState;
  setBlocked: (url: string) => void;
  clearBlocked: () => void;
}

export function useBlockState(): UseBlockStateReturn {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null);

  const setBlocked = useCallback((url: string) => {
    setIsBlocked(true);
    setBlockedUrl(url);
  }, []);

  const clearBlocked = useCallback(() => {
    setIsBlocked(false);
    setBlockedUrl(null);
  }, []);

  return {
    state: { isBlocked, blockedUrl },
    setBlocked,
    clearBlocked,
  };
}
