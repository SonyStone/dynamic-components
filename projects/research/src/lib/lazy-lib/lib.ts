import { Inject, Injectable } from '@angular/core';
import { CONSOLE } from 'doc-viewer';

let int = 0;

@Injectable()
export class Lib {

  constructor(
    @Inject(CONSOLE) private console: Console,
  ) {
    int++;
  }

  log(): void {
    this.console.log('lazy lib', int);
  }
}
