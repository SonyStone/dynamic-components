import { ComponentRef, Injectable, Injector, OnDestroy } from '@angular/core';
import { Compiler } from 'dynamic';
import { ConnectableObservable, of, Subject, Subscription } from 'rxjs';
import { map, publishReplay, startWith, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { VideoComponent } from './video.component';
import { VideoModule } from './video.module';



@Injectable({
  providedIn: 'root'
})
export class VideoService implements OnDestroy {

  componentRef$ = of(VideoModule).pipe(
    this.compiler.compileModuleAsync,
    map((moduleFactory) => {
      const moduleRef = moduleFactory.create(this.injector);
      const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(VideoComponent);
      const componentRef = componentFactory.create(moduleRef.injector);

      return componentRef;
    }),
    publishReplay(1),
  ) as ConnectableObservable<ComponentRef<VideoComponent>>;

  append = new Subject();

  append$ = this.append.pipe(
    startWith(undefined),
    switchMapTo(this.componentRef$),
    publishReplay(1),
  ) as ConnectableObservable<ComponentRef<VideoComponent>>;

  private subscription = new Subscription();

  constructor(
    private compiler: Compiler<VideoModule>,
    private injector: Injector,
  ) {
    this.subscription.add(this.componentRef$.connect())
    this.subscription.add(this.append$.connect());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}