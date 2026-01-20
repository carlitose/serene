import { useMemo } from 'react';
import { IInjector } from '@/services/interfaces/IInjector';
import { PageType } from '@/types/navigation.types';

interface UseInjectionProps {
  injector: IInjector;
  pageType: PageType;
}

export function useInjection({ injector, pageType }: UseInjectionProps) {
  const injectedScript = useMemo(() => {
    console.log('🎨 [USE_INJECTION] Creating injection script for pageType:', pageType);
    const payload = injector.getPayload(pageType);
    const script = injector.buildScript(payload);
    console.log('🎨 [USE_INJECTION] Script created, length:', script.length, 'chars');
    return script;
  }, [injector, pageType]);

  return { injectedScript };
}
