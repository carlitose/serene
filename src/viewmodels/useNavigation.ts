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

      if (evaluation.shouldBlock) {
        onBlocked(navState.url);
        // Go back to prevent blocked content from loading
        webViewRef.current?.goBack();
      }
    },
    [urlGuard, onBlocked]
  );

  const handleShouldStartLoad = useCallback(
    (request: { url: string }): boolean => {
      const evaluation = urlGuard.evaluate(request.url);

      if (evaluation.shouldBlock) {
        onBlocked(request.url);
        return false; // Block the navigation
      }

      return true; // Allow the navigation
    },
    [urlGuard, onBlocked]
  );

  const goBack = useCallback(() => {
    webViewRef.current?.goBack();
  }, []);

  const reload = useCallback(() => {
    webViewRef.current?.reload();
  }, []);

  const navigateTo = useCallback((url: string) => {
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
