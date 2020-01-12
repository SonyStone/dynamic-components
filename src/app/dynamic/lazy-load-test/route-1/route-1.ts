import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Compiler,
  Component,
  NgModule,
  NgModuleFactory,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeaveGuard } from '../leave-duard';
import { loadTest1 } from '../load-test-1';
import { ComponentRefMapService } from '../view-ref-map.service';


@Component({
  templateUrl: 'route-1.component.html',
  styleUrls: ['route-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Route1Component implements AfterViewInit {

  @ViewChild('vc', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  constructor(
    private compiler: Compiler,
    private componentRefMapService: ComponentRefMapService,
  ) {}

  ngAfterViewInit() {
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
    component: Route1Component,
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
    Route1Component,
  ],
})
export class Route1Module {}
