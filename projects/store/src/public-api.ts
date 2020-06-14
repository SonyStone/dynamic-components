/*
 * Public API Surface of store
 */

export { StoreService } from './lib/store.service';

export { Store } from './lib/store.interface';
export { GetDataDirective } from './lib/get-data.directive';

export { ViewContextHandler } from './lib/view-context.service';
export { StoreModule } from './lib/store.module';

export { Data, DATA_MAP, DATA_INJECTOR } from './lib/data';
export { AbstractContext, Updatetable } from './lib/abstract.context';

export { switchToObservable, AsyncLike } from './lib/utils/switch-to-observable';
