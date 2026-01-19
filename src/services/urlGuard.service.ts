import { IUrlGuard } from './interfaces/IUrlGuard';
import { UrlRule, UrlEvaluation, PageType } from '@/types/navigation.types';
import { URL_RULES } from '@/config/urls/rules';
import { parseUrl } from '@/utils/urlParser';

export class UrlGuardService implements IUrlGuard {
  private rules: UrlRule[];

  constructor(initialRules: UrlRule[] = URL_RULES) {
    this.rules = [...initialRules];
  }

  evaluate(url: string): UrlEvaluation {
    const { path } = parseUrl(url);

    for (const rule of this.rules) {
      if (rule.pattern.test(path)) {
        return {
          url,
          path,
          result: rule.result,
          blockMode: rule.blockMode,
          pageType: rule.pageType ?? 'unknown',
          shouldBlock: rule.result === 'blocked' && rule.blockMode === 'hard',
        };
      }
    }

    // Default: blocco conservativo per URL non riconosciuti
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
    // Aggiunge in cima per alta priorità
    this.rules.unshift(rule);
  }

  removeRule(pattern: RegExp): void {
    this.rules = this.rules.filter((r) => r.pattern.source !== pattern.source);
  }
}
