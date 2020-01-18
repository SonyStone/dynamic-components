import { Component, ComponentConstructor } from '../component.interface';
import { Resettable } from '../resettable.interface';
import { EntityManager } from './entity-manager';
import { Query } from './query';
import { wrapImmutableComponent } from './wrap-immutable-component';

// tslint:disable:no-bitwise

// @todo Take this out from there or use ENV
const DEBUG = false;

let nextId = 0;

export class Entity implements Resettable {
  // Unique ID for this entity
  id = nextId++;

  // List of components types the entity has
  ComponentTypes: ComponentConstructor[] = [];

  // Instance of the components
  components = new Map<string, Component>();

  componentsToRemove = new Map<string, Component>();

  // Queries where the entity is added
  queries: Query[] = [];

  // Used for deferred removal
  ComponentTypesToRemove: ComponentConstructor[] = [];

  alive = false;

  constructor(
    public entityManager: EntityManager,
  ) {}

  // COMPONENTS

  getComponent(componentConstructor: ComponentConstructor, includeRemoved?: boolean): Component {
    let component = this.components.get(componentConstructor.name);

    if (!component && includeRemoved === true) {
      component = this.componentsToRemove.get(componentConstructor.name);
    }

    return DEBUG ? wrapImmutableComponent(component) : component;
  }

  getRemovedComponent(componentConstructor: ComponentConstructor): Component {
    return this.componentsToRemove.get(componentConstructor.name);
  }

  getComponents(): Map<string, Component> {
    return this.components;
  }

  getComponentsToRemove(): Map<string, Component> {
    return this.componentsToRemove;
  }

  getComponentTypes(): ComponentConstructor[] {
    return this.ComponentTypes;
  }

  getMutableComponent(componentConstructor: ComponentConstructor): Component {
    const component = this.components.get(componentConstructor.name);

    for (const query of this.queries) {

      // @todo accelerate this check. Maybe having query._Components as an object
      if (query.reactive && query.Components.indexOf(componentConstructor) !== -1) {
        query.eventDispatcher.dispatchEvent(
          Query.prototype.COMPONENT_CHANGED,
          this,
          component
        );
      }
    }

    return component;
  }

  addComponent(componentConstructor: ComponentConstructor, values?: { [key: string]: any }): this {
    this.entityManager.entityAddComponent(this, componentConstructor, values);

    return this;
  }

  removeComponent(componentConstructor: ComponentConstructor, forceRemove?: boolean): this {
    this.entityManager.entityRemoveComponent(this, componentConstructor, forceRemove);

    return this;
  }

  hasComponent(componentConstructor: ComponentConstructor, includeRemoved?: boolean): boolean {
    return (
      !!~this.ComponentTypes.indexOf(componentConstructor) ||
      (includeRemoved === true && this.hasRemovedComponent(componentConstructor))
    );
  }

  hasRemovedComponent(componentConstructor: ComponentConstructor): boolean {
    return !!~this.ComponentTypesToRemove.indexOf(componentConstructor);
  }

  hasAllComponents(componentConstructors: ComponentConstructor[]): boolean {
    for (const component of componentConstructors) {
      if (!this.hasComponent(component)) { return false; }
    }

    return true;
  }

  hasAnyComponents(componentConstructors: ComponentConstructor[]): boolean {
    for (const component of componentConstructors) {
      if (this.hasComponent(component)) { return true; }
    }

    return false;
  }

  removeAllComponents(forceRemove?: boolean) {
    return this.entityManager.entityRemoveAllComponents(this, forceRemove);
  }

  // EXTRAS

  // Initialize the entity. To be used when returning an entity to the pool
  reset() {
    this.id = nextId++;
    this.entityManager = null;
    this.ComponentTypes.length = 0;
    this.queries.length = 0;
    this.components.clear();
  }

  remove(forceRemove?: boolean) {
    return this.entityManager.removeEntity(this, forceRemove);
  }
}
