import { PageType } from '@/types/navigation.types';
import { InjectionPayload } from '@/types/injection.types';

export interface IInjector {
  /**
   * Ottiene il payload di injection per un tipo di pagina
   * @param pageType - Tipo pagina (messages, search, profile)
   * @returns Array di CSS e JS da iniettare
   */
  getPayload(pageType: PageType): InjectionPayload;

  /**
   * Costruisce lo script finale da iniettare
   * @param payload - Payload con CSS e JS
   * @returns Stringa JavaScript eseguibile
   */
  buildScript(payload: InjectionPayload): string;
}
