import { IUrlGuard } from './interfaces/IUrlGuard';
import { IInjector } from './interfaces/IInjector';
import { IBlockList } from './interfaces/IBlockList';

import { UrlGuardService } from './urlGuard.service';
import { InjectorService } from './injector.service';
import { BlockListService } from './blockList.service';

interface ServiceContainer {
  urlGuard: IUrlGuard;
  injector: IInjector;
  blockList: IBlockList;
}

// Singleton instances
export const services: ServiceContainer = {
  urlGuard: new UrlGuardService(),
  injector: new InjectorService(),
  blockList: new BlockListService(),
};

// Factory per testing con mock
export function createMockContainer(
  overrides: Partial<ServiceContainer> = {}
): ServiceContainer {
  return {
    ...services,
    ...overrides,
  };
}
