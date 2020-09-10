import { Injectable } from '@angular/core';

import { DynamicConfig } from './dynamic-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: DynamicConfig;

  constructor() { }


  addConfig(config: DynamicConfig) {
    // console.log(`config`, config);
    this.config = config;
  }
}