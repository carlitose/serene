import { PageType } from './navigation.types';

export interface WebViewConfig {
  initialUrl: string;
  pageType: PageType;
}

export interface WebViewState {
  isBlocked: boolean;
  blockedUrl: string | null;
  currentUrl: string;
  isLoading: boolean;
}

export interface WebViewActions {
  goBack: () => void;
  reload: () => void;
  navigateTo: (url: string) => void;
  clearBlock: () => void;
}
