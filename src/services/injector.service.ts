import { IInjector } from './interfaces/IInjector';
import { PageType } from '@/types/navigation.types';
import { InjectionPayload } from '@/types/injection.types';

import { GLOBAL_CSS, MESSAGES_CSS, SEARCH_CSS, PROFILE_CSS } from '@/config/injection/css';
import { MUTATION_OBSERVER_JS, NAVIGATION_INTERCEPTOR_JS } from '@/config/injection/js';

export class InjectorService implements IInjector {
  private cssMap: Record<PageType, string[]> = {
    messages: [GLOBAL_CSS, MESSAGES_CSS],
    search: [GLOBAL_CSS, SEARCH_CSS],
    profile: [GLOBAL_CSS, PROFILE_CSS],
    unknown: [GLOBAL_CSS],
  };

  private jsModules: string[] = [MUTATION_OBSERVER_JS, NAVIGATION_INTERCEPTOR_JS];

  getPayload(pageType: PageType): InjectionPayload {
    return {
      css: this.cssMap[pageType] ?? this.cssMap.unknown,
      js: this.jsModules,
    };
  }

  buildScript(payload: InjectionPayload): string {
    const combinedCss = payload.css.join('\n');
    const combinedJs = payload.js.join('\n');

    // Escape backticks and backslashes in CSS for template literal
    const escapedCss = combinedCss.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

    return `
      (function() {
        // Prevent double injection
        if (window.__SERENE_INJECTED__) return;
        window.__SERENE_INJECTED__ = true;

        // Inject CSS
        var existingStyle = document.getElementById('serene-injection');
        if (existingStyle) existingStyle.remove();

        var style = document.createElement('style');
        style.id = 'serene-injection';
        style.textContent = \`${escapedCss}\`;
        document.head.appendChild(style);

        // Inject JS
        ${combinedJs}
      })();
      true;
    `;
  }
}
