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

  console.log('📱 [WEBVIEW_CONTROLLER] init with initialUrl:', config.initialUrl);

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
      console.log('📍 [CURRENT_URL_CHANGE]', {
        from: currentUrl,
        to: navState.url,
        loading: navState.loading,
      });

      setCurrentUrl(navState.url);
      if (navState.loading !== undefined) {
        setIsLoading(navState.loading);
      }
      baseHandleNavigationChange(navState);
    },
    [baseHandleNavigationChange, currentUrl]
  );

  // Handle messages from WebView (JS injection)
  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

        console.log('💬 [JS_MESSAGE_RECEIVED]', message);

        if (message.type === 'blocked_navigation' && message.url) {
          console.log('🔴 [JS_INTERCEPTOR_BLOCKED]', {
            blockedUrl: message.url,
            willNavigateTo: config.initialUrl,
          });
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
    console.log('⏳ [LOAD_START]');
    setIsLoading(true);
  }, []);

  const handleLoadEnd = useCallback(() => {
    console.log('✅ [LOAD_END]');
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
      console.log('🧹 [CLEAR_BLOCK] → navigating to', config.initialUrl);
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
