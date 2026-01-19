import { UrlEvaluation, UrlRule } from '@/types/navigation.types';

export interface IUrlGuard {
  /**
   * Valuta un URL e determina se è accessibile
   * @param url - URL completo da valutare
   * @returns Risultato valutazione con tipo blocco
   */
  evaluate(url: string): UrlEvaluation;

  /**
   * Aggiunge una nuova regola (alta priorità)
   */
  addRule(rule: UrlRule): void;

  /**
   * Rimuove una regola esistente
   */
  removeRule(pattern: RegExp): void;
}
