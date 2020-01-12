import { Query } from './query';
import { wrapImmutableComponent } from './wrap-immutable-component';

// tslint:disable:no-bitwise

// @todo Take this out from there or use ENV
const DEBUG = false;

let nextId = 0;

export class Entity {
  // Unique ID for this entity
  id = nextId++;

  // List of components types the entity has
  ComponentTypes = [];

  // Instance of the components
  components = {};

  componentsToRemove = {};

  // Queries where the entity is added
  queries = [];

  // Used for deferred removal
  ComponentTypesToRemove = [];

  alive = false;

  constructor(
    private world?: any,
  ) {}

  // COMPONENTS

  getComponent(Component, includeRemoved) {
    let component = this.components[Component.name];

    if (!component && includeRemoved === true) {
      component = this.componentsToRemove[Component.name];
    }

    return DEBUG ? wrapImmutableComponent(Component, component) : component;
  }

  getRemovedComponent(Component) {
    return this.componentsToRemove[Component.name];
  }

  getComponents() {
    return this.components;
  }

  getComponentsToRemove() {
    return this.componentsToRemove;
  }

  getComponentTypes() {
    return this.ComponentTypes;
  }

  getMutableComponent(Component) {
    const component = this.components[Component.name];

    for (const query of this.queries) {
      // @todo accelerate this check. Maybe having query._Components as an object
      if (query.reactive && query.Components.indexOf(Component) !== -1) {
        query.eventDispatcher.dispatchEvent(
          Query.prototype.COMPONENT_CHANGED,
          this,
          component
        );
      }
    }

    return component;
  }

  addComponent(Component, values) {
    this.world.entityAddComponent(this, Component, values);
    return this;
  }

  removeComponent(Component, forceRemove) {
    this.world.entityRemoveComponent(this, Component, forceRemove);
    return this;
  }

  hasComponent(Component, includeRemoved?: boolean) {
    return (
      !!~this.ComponentTypes.indexOf(Component) ||
      (includeRemoved === true && this.hasRemovedComponent(Component))
    );
  }

  hasRemovedComponent(Component) {
    return !!~this.ComponentTypesToRemove.indexOf(Component);
  }

  hasAllComponents(Components) {
    for (const component of Components) {
      if (!this.hasComponent(component)) { return false; }
    }

    return true;
  }

  hasAnyComponents(Components) {
    for (const component of Components) {
      if (this.hasComponent(component)) { return true; }
    }

    return false;
  }

  removeAllComponents(forceRemove) {
    return this.world.entityRemoveAllComponents(this, forceRemove);
  }

  // EXTRAS

  // Initialize the entity. To be used when returning an entity to the pool
  reset() {
    this.id = nextId++;
    this.world = null;
    this.ComponentTypes.length = 0;
    this.queries.length = 0;
    this.components = {};
  }

  remove(forceRemove?: boolean) {
    return this.world.removeEntity(this, forceRemove);
  }
}
