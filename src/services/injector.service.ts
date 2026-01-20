import { IInjector } from './interfaces/IInjector';
import { PageType } from '@/types/navigation.types';
import { InjectionPayload } from '@/types/injection.types';

import { GLOBAL_CSS, MESSAGES_CSS, SEARCH_CSS, PROFILE_CSS } from '@/config/injection/css';
import { MUTATION_OBSERVER_JS, NAVIGATION_INTERCEPTOR_JS, SEARCH_NAVBAR_HIDER_JS } from '@/config/injection/js';

export class InjectorService implements IInjector {
  private cssMap: Record<PageType, string[]> = {
    messages: [GLOBAL_CSS, MESSAGES_CSS],
    search: [GLOBAL_CSS, SEARCH_CSS],
    profile: [GLOBAL_CSS, PROFILE_CSS],
    settings: [], // TEST: Nessun CSS per settings - vediamo se funziona
    unknown: [GLOBAL_CSS],
  };

  private cssNames: Record<PageType, string[]> = {
    messages: ['GLOBAL_CSS', 'MESSAGES_CSS'],
    search: ['GLOBAL_CSS', 'SEARCH_CSS'],
    profile: ['GLOBAL_CSS', 'PROFILE_CSS'],
    settings: [], // TEST: Nessun CSS
    unknown: ['GLOBAL_CSS'],
  };

  // JS base per tutte le pagine
  private baseJsModules: string[] = [MUTATION_OBSERVER_JS, NAVIGATION_INTERCEPTOR_JS];

  // JS aggiuntivi per pagine specifiche
  private jsMap: Record<PageType, string[]> = {
    messages: this.baseJsModules,
    search: [...this.baseJsModules, SEARCH_NAVBAR_HIDER_JS], // Nasconde la navbar di Instagram
    profile: this.baseJsModules,
    settings: this.baseJsModules,
    unknown: this.baseJsModules,
  };

  getPayload(pageType: PageType): InjectionPayload {
    console.log('💉 [INJECTOR] getPayload for pageType:', pageType);
    console.log('💉 [INJECTOR] CSS modules:', this.cssNames[pageType] ?? this.cssNames.unknown);
    const jsModules = this.jsMap[pageType] ?? this.baseJsModules;
    console.log('💉 [INJECTOR] JS modules count:', jsModules.length);
    return {
      css: this.cssMap[pageType] ?? this.cssMap.unknown,
      js: jsModules,
    };
  }

  buildScript(payload: InjectionPayload): string {
    const combinedCss = payload.css.join('\n');
    const combinedJs = payload.js.join('\n');

    console.log('💉 [INJECTOR] buildScript - CSS length:', combinedCss.length, 'chars');

    // Escape backticks and backslashes in CSS for template literal
    const escapedCss = combinedCss.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

    return `
      (function() {
        // Prevent double injection
        if (window.__SERENE_INJECTED__) {
          console.log('[CSS_INJECTION] ⚠️ Already injected, skipping');
          return;
        }
        window.__SERENE_INJECTED__ = true;

        console.log('[CSS_INJECTION] 💉 Starting injection...');

        // Inject CSS
        var existingStyle = document.getElementById('serene-injection');
        if (existingStyle) {
          console.log('[CSS_INJECTION] Removing existing style');
          existingStyle.remove();
        }

        var style = document.createElement('style');
        style.id = 'serene-injection';
        style.textContent = \`${escapedCss}\`;
        document.head.appendChild(style);

        console.log('[CSS_INJECTION] ✅ CSS injected, length:', style.textContent.length, 'chars');
        console.log('[CSS_INJECTION] 📝 CSS preview (first 500 chars):', style.textContent.substring(0, 500));

        // Inject JS
        console.log('[CSS_INJECTION] 💉 Running JS modules...');
        ${combinedJs}

        console.log('[CSS_INJECTION] ✅ All injection complete');
      })();
      true;
    `;
  }
}
