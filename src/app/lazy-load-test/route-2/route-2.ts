import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, ViewContainerRef, Compiler, NgModuleFactory } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeaveGuard } from '../leave-duard';
import { ComponentRefMapService } from '../view-ref-map.service';
import { loadTest1 } from '../load-test-1';


@Component({
  templateUrl: 'route-2.component.html',
  styleUrls: ['route-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Route2Component {
  constructor(
    private compiler: Compiler,
    private viewContainerRef: ViewContainerRef,
    private componentRefMapService: ComponentRefMapService,
  ) {
    loadTest1.qwerty()
      .then((m) => (m instanceof NgModuleFactory)
        ? m
        : this.compiler.compileModuleAsync(m)
      ).then((tempModule) => {
        const componentRef = this.componentRefMapService.get(tempModule);

        this.viewContainerRef.insert(componentRef.hostView);
      });
  }
}

const routes: Routes = [
  {
    path: '',
    component: Route2Component,
    canDeactivate: [LeaveGuard],
  },
];

@NgModule({
  imports: [
    [
      CommonModule,
      RouterModule.forChild(routes),
    ],
  ],
  providers: [
    LeaveGuard,
  ],
  declarations: [
    Route2Component,
  ],
})
export class Route2Module {}
