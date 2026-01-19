export interface IBlockList {
  /**
   * Verifica se un path è nella blocklist
   */
  isBlocked(path: string): boolean;

  /**
   * Ritorna tutti i path bloccati
   */
  getBlockedPaths(): string[];

  /**
   * Aggiunge un path alla blocklist
   */
  addPath(path: string): void;

  /**
   * Rimuove un path dalla blocklist
   */
  removePath(path: string): void;
}
