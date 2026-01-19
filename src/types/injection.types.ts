export interface InjectionPayload {
  css: string[];
  js: string[];
}

export type WebViewMessageType = 'navigation' | 'blocked_navigation' | 'error';

export interface WebViewMessage {
  type: WebViewMessageType;
  url?: string;
  error?: string;
}
