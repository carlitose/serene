import { IBlockList } from './interfaces/IBlockList';

const DEFAULT_BLOCKED = ['/', '/explore/', '/reels/', '/stories/', '/shop/', '/activity/'];

export class BlockListService implements IBlockList {
  private blockedPaths: Set<string>;

  constructor(initialPaths: string[] = DEFAULT_BLOCKED) {
    this.blockedPaths = new Set(initialPaths);
  }

  isBlocked(path: string): boolean {
    // Exact match
    if (this.blockedPaths.has(path)) return true;

    // Prefix match (except root)
    for (const blocked of this.blockedPaths) {
      if (blocked !== '/' && path.startsWith(blocked)) {
        return true;
      }
    }

    return false;
  }

  getBlockedPaths(): string[] {
    return Array.from(this.blockedPaths);
  }

  addPath(path: string): void {
    this.blockedPaths.add(path);
  }

  removePath(path: string): void {
    this.blockedPaths.delete(path);
  }
}
