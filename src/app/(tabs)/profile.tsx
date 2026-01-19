import { SafeAreaView, StyleSheet } from 'react-native';
import { WebViewContainer } from '@/presentation/components';
import { useWebViewController } from '@/viewmodels';
import { services } from '@/services';
import { APP_CONFIG } from '@/config/app.config';

const PROFILE_URL = APP_CONFIG.TABS.profile.url;

export default function ProfileScreen() {
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
    config: { initialUrl: PROFILE_URL, pageType: 'profile' },
    urlGuard: services.urlGuard,
    injector: services.injector,
  });

  return (
    <SafeAreaView style={styles.container}>
      <WebViewContainer
        webViewRef={webViewRef}
        url={PROFILE_URL}
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
