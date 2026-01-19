import { useMemo } from 'react';
import { IInjector } from '@/services/interfaces/IInjector';
import { PageType } from '@/types/navigation.types';

interface UseInjectionProps {
  injector: IInjector;
  pageType: PageType;
}

export function useInjection({ injector, pageType }: UseInjectionProps) {
  const injectedScript = useMemo(() => {
    const payload = injector.getPayload(pageType);
    return injector.buildScript(payload);
  }, [injector, pageType]);

  return { injectedScript };
}
