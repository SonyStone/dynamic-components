import { Pipe, PipeTransform } from '@angular/core';

import { OuteltConfig, Outlet } from '../component-outlet';
import { DynamicConfig } from './dynamic.config';

@Pipe({
  name: 'component'
})
export class ComponentPipe implements PipeTransform {

  constructor(
    private configService: DynamicConfig,
    // @Optional() @SkipSelf() private parent: DynamicComponent,
  ) {}

  transform(configs: OuteltConfig[], context: any[]): Outlet[] {

    if (!configs ||  configs.length === 0) { return; }

    return configs.map((config) =>
      ({
        component: this.configService.getType(config.type).component,
        context: {
          ...config,
          // ...(this.parent && this.parent.context),
          ...context,
        },
        injector: config.injector,
        content: config.content,
        dontTrackBy: config.dontTrackBy,
      })
    );
  }
}
