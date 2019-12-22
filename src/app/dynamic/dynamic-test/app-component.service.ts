
import { Injectable, ComponentRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppComponentService implements OnDestroy {
  component$ = new Subject<ComponentRef<any>>();

  constructor() {
    console.log(`AppComponentService :: constructor`);
  }

  addComponent(componentRef?: ComponentRef<any>): void {
    this.component$.next(componentRef);
  }

  ngOnDestroy(): void {
    this.component$.complete();
  }
}
