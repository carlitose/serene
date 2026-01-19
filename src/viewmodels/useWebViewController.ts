import { useCallback, useState } from 'react';
import { WebViewConfig, WebViewState, WebViewActions } from '@/types/webview.types';
import { WebViewMessage } from '@/types/injection.types';
import { IUrlGuard } from '@/services/interfaces/IUrlGuard';
import { IInjector } from '@/services/interfaces/IInjector';

import { useBlockState } from './useBlockState';
import { useNavigation } from './useNavigation';
import { useInjection } from './useInjection';

interface UseWebViewControllerProps {
  config: WebViewConfig;
  urlGuard: IUrlGuard;
  injector: IInjector;
}

export function useWebViewController({
  config,
  urlGuard,
  injector,
}: UseWebViewControllerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(config.initialUrl);

  // Compose hooks (SRP)
  const { state: blockState, setBlocked, clearBlocked } = useBlockState();

  const {
    webViewRef,
    handleNavigationChange: baseHandleNavigationChange,
    handleShouldStartLoad,
    goBack,
    reload,
    navigateTo,
  } = useNavigation({
    urlGuard,
    onBlocked: setBlocked,
    initialUrl: config.initialUrl,
  });

  const { injectedScript } = useInjection({
    injector,
    pageType: config.pageType,
  });

  // Extended navigation handler that tracks current URL
  const handleNavigationChange = useCallback(
    (navState: { url: string; loading?: boolean }) => {
      setCurrentUrl(navState.url);
      if (navState.loading !== undefined) {
        setIsLoading(navState.loading);
      }
      baseHandleNavigationChange(navState);
    },
    [baseHandleNavigationChange]
  );

  // Handle messages from WebView (JS injection)
  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

        if (message.type === 'blocked_navigation' && message.url) {
          setBlocked(message.url);
          navigateTo(config.initialUrl);
        }
      } catch {
        // Invalid message format, ignore
      }
    },
    [setBlocked, navigateTo, config.initialUrl]
  );

  // Handle load start/end for loading state
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Compose state
  const state: WebViewState = {
    isBlocked: blockState.isBlocked,
    blockedUrl: blockState.blockedUrl,
    currentUrl,
    isLoading,
  };

  // Compose actions
  const actions: WebViewActions = {
    goBack,
    reload,
    navigateTo,
    clearBlock: () => {
      clearBlocked();
      navigateTo(config.initialUrl);
    },
  };

  return {
    webViewRef,
    state,
    actions,
    injectedScript,
    handleNavigationChange,
    handleShouldStartLoad,
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
  };
}
