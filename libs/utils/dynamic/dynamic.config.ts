import { Injectable, InjectionToken } from '@angular/core';

export const DYNAMIC_CONFIG = new InjectionToken<DynamicConfig>('FORMLY_CONFIG');

@Injectable({ providedIn: 'root' })
export class DynamicConfig {
  types: {[name: string]: TypeOption} = {};

  addConfig(config: DynamicOption) {
    if (config.types) {
      config.types.forEach(type => this.setType(type));
    }
  }

  setType(options: TypeOption | TypeOption[]) {
    if (Array.isArray(options)) {
      options.forEach((option) => this.setType(option));
    } else {
      if (!this.types[options.name]) {
        this.types[options.name] = { name: options.name } as TypeOption;
      } else {
        throw new Error(`[Dynamic Error] Type by the name of "${name}" already exists`);
      }

      ['component', 'extends', 'defaultOptions'].forEach(prop => {
        if (options.hasOwnProperty(prop)) {
          this.types[options.name][prop] = options[prop];
        }
      });

      // todo wrappers?
      // if (options.wrappers) {
      //   options.wrappers.forEach((wrapper) => this.setTypeWrapper(options.name, wrapper));
      // }
    }
  }

  getType(name: string): TypeOption {
    if (!this.types[name]) {
      throw new Error(`[Dynamic Error] There is no type by the name of "${name}"`);
    }

    this.mergeExtendedType(name);

    return this.types[name];
  }

  private mergeExtendedType(name: string) {
    if (!this.types[name].extends) {
      return;
    }

    const extendedType = this.getType(this.types[name].extends);
    if (!this.types[name].component) {
      this.types[name].component = extendedType.component;
    }

    // if (!this.types[name].wrappers) {
    //   this.types[name].wrappers = extendedType.wrappers;
    // }
  }
}

export interface DynamicOption {
  types?: TypeOption[];
}

export interface TypeOption {
  name: string;
  component?: any;
  wrappers?: string[];
  extends?: string;
}
