import { Layouts } from '../layout.interface';
import { NgModuleRef } from '@angular/core';

export class LoadedLayoutConfig {
  constructor(
    public layouts: Layouts,
    public module: NgModuleRef<any>
  ) {}
}
