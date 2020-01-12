import { ObjectPool } from '../object-pool';
import { componentPropertyName } from '../utils';
import { DummyObjectPool } from './dummy-object-pool.js';

export class ComponentManager {
  Components = {};
  componentPool = {};
  numComponents = {};

  constructor() {}

  registerComponent(Component) {
    if (this.Components[Component.name]) {
      console.warn(`Component type: '${Component.name}' already registered.`);
      return;
    }

    this.Components[Component.name] = Component;
    this.numComponents[Component.name] = 0;
  }

  componentAddedToEntity(Component) {
    if (!this.Components[Component.name]) {
      this.registerComponent(Component);
    }

    this.numComponents[Component.name]++;
  }

  componentRemovedFromEntity(Component) {
    this.numComponents[Component.name]--;
  }

  getComponentsPool(Component) {
    const componentName = componentPropertyName(Component);

    if (!this.componentPool[componentName]) {
      if (Component.prototype.reset) {
        this.componentPool[componentName] = new ObjectPool(Component);
      } else {
        console.warn(
          `Component '${Component.name}' won't benefit from pooling because 'reset' method was not implemeneted.`
        );
        this.componentPool[componentName] = new DummyObjectPool(Component);
      }
    }

    return this.componentPool[componentName];
  }
}
