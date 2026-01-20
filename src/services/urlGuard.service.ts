import { IUrlGuard } from './interfaces/IUrlGuard';
import { UrlRule, UrlEvaluation } from '@/types/navigation.types';
import { URL_RULES } from '@/config/urls/rules';
import { parseUrl } from '@/utils/urlParser';

export class UrlGuardService implements IUrlGuard {
  private rules: UrlRule[];

  constructor(initialRules: UrlRule[] = URL_RULES) {
    this.rules = [...initialRules];
    console.log('🛡️ [URL_GUARD] Initialized with', this.rules.length, 'rules');
  }

  evaluate(url: string): UrlEvaluation {
    // Permettere about:blank e altri URL speciali
    if (url === 'about:blank' || url.startsWith('about:')) {
      console.log('🛡️ [URL_GUARD] evaluate:', url, '→ ALLOWED (about: URL)');
      return {
        url,
        path: url,
        result: 'allowed',
        blockMode: 'soft',
        pageType: 'unknown',
        shouldBlock: false,
      };
    }

    const { path, host } = parseUrl(url);

    // Permettere Facebook Instagram login sync (necessario per OAuth)
    if (host.includes('facebook.com') && path.startsWith('/instagram')) {
      console.log('🛡️ [URL_GUARD] evaluate:', path, '→ ALLOWED (Facebook OAuth)');
      return {
        url,
        path,
        result: 'allowed',
        blockMode: 'soft',
        pageType: 'login',
        shouldBlock: false,
      };
    }

    // Permettere URL di sessione/login flow Instagram (popup "Salva informazioni", etc.)
    if (
      host.includes('instagram.com') &&
      (path.startsWith('/session') ||
        path.startsWith('/nux') ||
        path.includes('login') ||
        path.includes('checkpoint') ||
        path.includes('challenge'))
    ) {
      console.log('🛡️ [URL_GUARD] evaluate:', path, '→ ALLOWED (login flow)');
      return {
        url,
        path,
        result: 'allowed',
        blockMode: 'soft',
        pageType: 'login',
        shouldBlock: false,
      };
    }

    for (const rule of this.rules) {
      if (rule.pattern.test(path)) {
        const evaluation: UrlEvaluation = {
          url,
          path,
          result: rule.result,
          blockMode: rule.blockMode,
          pageType: rule.pageType ?? 'unknown',
          shouldBlock: rule.result === 'blocked' && rule.blockMode === 'hard',
        };
        console.log(
          '🛡️ [URL_GUARD] evaluate:',
          path,
          '→',
          evaluation.result.toUpperCase(),
          '(pattern:',
          rule.pattern.toString(),
          ', shouldBlock:',
          evaluation.shouldBlock,
          ')'
        );
        return evaluation;
      }
    }

    // Default: blocco conservativo per URL non riconosciuti
    console.log('🛡️ [URL_GUARD] evaluate:', path, '→ BLOCKED (no matching rule - default)');
    return {
      url,
      path,
      result: 'blocked',
      blockMode: 'hard',
      pageType: 'unknown',
      shouldBlock: true,
    };
  }

  addRule(rule: UrlRule): void {
    this.rules.unshift(rule);
  }

  removeRule(pattern: RegExp): void {
    this.rules = this.rules.filter((r) => r.pattern.source !== pattern.source);
  }
}
