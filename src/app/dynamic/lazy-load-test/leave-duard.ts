import { CanDeactivate } from '@angular/router';

export class LeaveGuard implements CanDeactivate<any> {

  constructor() {}

  canDeactivate(component: any) {

    console.log(`canDeactivate`, component);

    component.viewContainerRef.detach();

    return true;
  }
}
