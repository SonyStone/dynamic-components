import { ChangeDetectionStrategy, Compiler, Component, Injector, NgModuleFactory } from '@angular/core';
import { LayoutConfigLoader } from 'libs/utils/dynamic/more/config-loader';

export const loadTest1 = {
  qwerty: () => import('./test-1.module').then(m => m.Test1Module),
};


@Component({
  templateUrl: 'lazy-load-test.component.html',
  styleUrls: ['lazy-load-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadTestComponent {

  loader = new LayoutConfigLoader(this.compiler);

  constructor(
    private compiler: Compiler,
    private injector: Injector,
  ) {}


  async load() {

    const tempModule = await loadTest1.qwerty()
      .then((m) => (m instanceof NgModuleFactory)
        ? m
        : this.compiler.compileModuleAsync(m)
      );

    console.log(`tempModule`, tempModule, tempModule instanceof NgModuleFactory);

    const module = tempModule.create(this.injector);

    console.log(`module`, module);

  }
}
