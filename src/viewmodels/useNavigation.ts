import { useRef, useCallback } from 'react';
import { WebView } from 'react-native-webview';
import { IUrlGuard } from '@/services/interfaces/IUrlGuard';

interface UseNavigationProps {
  urlGuard: IUrlGuard;
  onBlocked: (url: string) => void;
  initialUrl: string;
}

interface WebViewNavigationState {
  url: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export function useNavigation({ urlGuard, onBlocked, initialUrl }: UseNavigationProps) {
  const webViewRef = useRef<WebView>(null);

  const handleNavigationChange = useCallback(
    (navState: WebViewNavigationState) => {
      const evaluation = urlGuard.evaluate(navState.url);

      console.log('🔵 [NAVIGATION_STATE_CHANGE]', {
        url: navState.url,
        loading: navState.loading,
        evaluation: {
          result: evaluation.result,
          blockMode: evaluation.blockMode,
          shouldBlock: evaluation.shouldBlock,
          pageType: evaluation.pageType,
        },
      });

      if (evaluation.shouldBlock) {
        console.log('🔴 [NAVIGATION_STATE_CHANGE] BLOCKED → calling goBack()', navState.url);
        onBlocked(navState.url);
        webViewRef.current?.goBack();
      }
    },
    [urlGuard, onBlocked]
  );

  const handleShouldStartLoad = useCallback(
    (request: { url: string }): boolean => {
      const evaluation = urlGuard.evaluate(request.url);

      console.log('🟡 [SHOULD_START_LOAD]', {
        url: request.url,
        evaluation: {
          result: evaluation.result,
          blockMode: evaluation.blockMode,
          shouldBlock: evaluation.shouldBlock,
          pageType: evaluation.pageType,
        },
      });

      if (evaluation.shouldBlock) {
        console.log('🔴 [SHOULD_START_LOAD] BLOCKED → returning false', request.url);
        onBlocked(request.url);
        return false;
      }

      console.log('🟢 [SHOULD_START_LOAD] ALLOWED → returning true', request.url);
      return true;
    },
    [urlGuard, onBlocked]
  );

  const goBack = useCallback(() => {
    console.log('⬅️ [GO_BACK] called');
    webViewRef.current?.goBack();
  }, []);

  const reload = useCallback(() => {
    console.log('🔄 [RELOAD] called');
    webViewRef.current?.reload();
  }, []);

  const navigateTo = useCallback((url: string) => {
    console.log('➡️ [NAVIGATE_TO]', url);
    webViewRef.current?.injectJavaScript(`
      window.location.href = '${url}';
      true;
    `);
  }, []);

  return {
    webViewRef,
    handleNavigationChange,
    handleShouldStartLoad,
    goBack,
    reload,
    navigateTo,
  };
}
