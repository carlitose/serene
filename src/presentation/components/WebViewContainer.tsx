import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import BlockedScreen from './BlockedScreen';
import { APP_CONFIG } from '@/config/app.config';

// User-Agent Safari per evitare blocchi Instagram
const SAFARI_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

interface Props {
  webViewRef: React.RefObject<WebView | null>;
  url: string;
  injectedScript: string;
  isBlocked: boolean;
  blockedUrl: string | null;
  isLoading: boolean;
  onNavigationChange: (navState: WebViewNavigation) => void;
  onShouldStartLoad: (request: { url: string }) => boolean;
  onMessage: (event: { nativeEvent: { data: string } }) => void;
  onClearBlock: () => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
}

export default function WebViewContainer({
  webViewRef,
  url,
  injectedScript,
  isBlocked,
  blockedUrl,
  isLoading,
  onNavigationChange,
  onShouldStartLoad,
  onMessage,
  onClearBlock,
  onLoadStart,
  onLoadEnd,
}: Props) {
  if (isBlocked) {
    return <BlockedScreen attemptedUrl={blockedUrl} onGoBack={onClearBlock} />;
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        injectedJavaScript={injectedScript}
        onNavigationStateChange={onNavigationChange}
        onShouldStartLoadWithRequest={(request) => {
          return onShouldStartLoad(request);
        }}
        onMessage={onMessage}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        // Cookie settings for session persistence
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        // User experience settings
        pullToRefreshEnabled={true}
        allowsBackForwardNavigationGestures={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={true}
        // Security & performance
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        // User-Agent per evitare blocchi Instagram
        userAgent={SAFARI_USER_AGENT}
        // Appearance
        contentMode="mobile"
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={APP_CONFIG.COLORS.primary} />
          </View>
        )}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={APP_CONFIG.COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.COLORS.background,
  },
  webview: {
    flex: 1,
    backgroundColor: APP_CONFIG.COLORS.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: APP_CONFIG.COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
