import { SafeAreaView, StyleSheet } from 'react-native';
import { WebViewContainer } from '@/presentation/components';
import { useWebViewController } from '@/viewmodels';
import { services } from '@/services';
import { APP_CONFIG } from '@/config/app.config';

const MESSAGES_URL = APP_CONFIG.TABS.messages.url;

export default function MessagesScreen() {
  const {
    webViewRef,
    state,
    actions,
    injectedScript,
    handleNavigationChange,
    handleShouldStartLoad,
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
  } = useWebViewController({
    config: { initialUrl: MESSAGES_URL, pageType: 'messages' },
    urlGuard: services.urlGuard,
    injector: services.injector,
  });

  return (
    <SafeAreaView style={styles.container}>
      <WebViewContainer
        webViewRef={webViewRef}
        url={MESSAGES_URL}
        injectedScript={injectedScript}
        isBlocked={state.isBlocked}
        blockedUrl={state.blockedUrl}
        isLoading={state.isLoading}
        onNavigationChange={handleNavigationChange}
        onShouldStartLoad={handleShouldStartLoad}
        onMessage={handleMessage}
        onClearBlock={actions.clearBlock}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.COLORS.background,
  },
});
