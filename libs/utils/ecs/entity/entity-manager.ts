import { Component } from '../component';
import { ObjectPool } from '../object-pool';
import { componentPropertyName, getName } from '../utils';
import { World } from '../world';
import { Entity } from './entity';
import { EventDispatcher } from './event-dispatcher';
import { QueryManager } from './query-manager';
import { SystemStateComponent } from './system-state-component';

// tslint:disable:no-bitwise

/**
 * EntityManager
 */
export class EntityManager {
  componentsManager = this.world.componentsManager;

  // All the entities in this instance
  private entities = [];

  private queryManager = new QueryManager(this);
  eventDispatcher = new EventDispatcher();
  private entityPool = new ObjectPool(Entity);

  // Deferred deletion
  entitiesWithComponentsToRemove = [];
  entitiesToRemove = [];
  deferredRemovalEnabled = true;

  numStateComponents = 0;

  constructor(
    private world: World,
  ) {}

  /**
   * Create a new entity
   */
  createEntity() {
    const entity = this.entityPool.aquire();
    entity.alive = true;
    entity._world = this;
    this.entities.push(entity);
    this.eventDispatcher.dispatchEvent(ENTITY_CREATED, entity);
    return entity;
  }

  // COMPONENTS

  /**
   * Add a component to an entity
   * @param entity Entity where the component will be added
   * @param component Component to be added to the entity
   * @param values Optional values to replace the default attributes
   */
  entityAddComponent(entity: Entity, component: Component | any, values: any) {
    if (~entity.ComponentTypes.indexOf(component)) { return; }

    entity.ComponentTypes.push(component);

    if (component.__proto__ === SystemStateComponent) {
      this.numStateComponents++;
    }

    const componentPool = this.world.componentsManager.getComponentsPool(
      component
    );

    const componentFromPool = componentPool.aquire();

    entity.components[component.name] = componentFromPool;

    if (values) {
      if (componentFromPool.copy) {
        componentFromPool.copy(values);
      } else {
        for (const name in values) {
          if (values.hasOwnProperty(name)) {
            componentFromPool[name] = values[name];
          }
        }
      }
    }

    this.queryManager.onEntityComponentAdded(entity, component);
    this.world.componentsManager.componentAddedToEntity(component);

    this.eventDispatcher.dispatchEvent(COMPONENT_ADDED, entity, component);
  }

  /**
   * Remove a component from an entity
   * @param entity Entity which will get removed the component
   * @param component Component to remove from the entity
   * @param immediately If you want to remove the component immediately instead of deferred (Default is false)
   */
  entityRemoveComponent(entity: Entity, component: any, immediately?: boolean) {
    const index = entity.ComponentTypes.indexOf(component);
    if (!~index) { return; }

    this.eventDispatcher.dispatchEvent(COMPONENT_REMOVE, entity, component);

    if (immediately) {
      this._entityRemoveComponentSync(entity, component, index);
    } else {
      if (entity.ComponentTypesToRemove.length === 0) {
        this.entitiesWithComponentsToRemove.push(entity);
      }

      entity.ComponentTypes.splice(index, 1);
      entity.ComponentTypesToRemove.push(component);

      const componentName = getName(component);
      entity.componentsToRemove[componentName] =
        entity.components[componentName];
      delete entity.components[componentName];
    }

    // Check each indexed query to see if we need to remove it
    this.queryManager.onEntityComponentRemoved(entity, component);

    if (component.__proto__ === SystemStateComponent) {
      this.numStateComponents--;

      // Check if the entity was a ghost waiting for the last system state component to be removed
      if (this.numStateComponents === 0 && !entity.alive) {
        entity.remove();
      }
    }
  }

  _entityRemoveComponentSync(entity, component, index) {
    // Remove T listing on entity and property ref, then free the component.
    entity._ComponentTypes.splice(index, 1);
    const propName = componentPropertyName(component);
    const componentName = getName(component);
    const componentEntity = entity._components[componentName];
    delete entity._components[componentName];
    this.componentsManager.componentPool[propName].release(componentEntity);
    this.world.componentsManager.componentRemovedFromEntity(component);
  }

  /**
   * Remove all the components from an entity
   * @param entity Entity from which the components will be removed
   */
  entityRemoveAllComponents(entity: Entity, immediately?: boolean) {
    const Components = entity.ComponentTypes;

    for (let j = Components.length - 1; j >= 0; j--) {
      if (Components[j].__proto__ !== SystemStateComponent) {
        this.entityRemoveComponent(entity, Components[j], immediately);
      }
    }
  }

  /**
   * Remove the entity from this manager. It will clear also its components
   * @param entity Entity to remove from the manager
   * @param immediately If you want to remove the component immediately instead of deferred (Default is false)
   */
  removeEntity(entity: Entity, immediately?: boolean) {
    const index = this.entities.indexOf(entity);

    if (!~index) { throw new Error('Tried to remove entity not in list'); }

    entity.alive = false;

    if (this.numStateComponents === 0) {
      // Remove from entity list
      this.eventDispatcher.dispatchEvent(ENTITY_REMOVED, entity);
      this.queryManager.onEntityRemoved(entity);
      if (immediately === true) {
        this._releaseEntity(entity, index);
      } else {
        this.entitiesToRemove.push(entity);
      }
    }

    this.entityRemoveAllComponents(entity, immediately);
  }

  _releaseEntity(entity, index) {
    this.entities.splice(index, 1);

    // Prevent any access and free
    entity._world = null;
    this.entityPool.release(entity);
  }

  /**
   * Remove all entities from this manager
   */
  removeAllEntities() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.removeEntity(this.entities[i]);
    }
  }

  processDeferredRemoval() {
    if (!this.deferredRemovalEnabled) {
      return;
    }

    for (const entity of this.entitiesToRemove) {
      const index = this.entities.indexOf(entity);
      this._releaseEntity(entity, index);
    }

    this.entitiesToRemove.length = 0;

    for (const entity of this.entitiesWithComponentsToRemove) {
      while (entity._ComponentTypesToRemove.length > 0) {
        const componentToREmove = entity._ComponentTypesToRemove.pop();

        const propName = componentPropertyName(componentToREmove);
        const componentName = getName(componentToREmove);

        const component = entity._componentsToRemove[componentName];
        delete entity._componentsToRemove[componentName];
        this.componentsManager.componentPool[propName].release(component);
        this.world.componentsManager.componentRemovedFromEntity(componentToREmove);

        // this._entityRemoveComponentSync(entity, Component, index);
      }
    }

    this.entitiesWithComponentsToRemove.length = 0;
  }

  /**
   * Get a query based on a list of components
   * @param Components List of components that will form the query
   */
  queryComponents(Components: Component[]) {
    return this.queryManager.getQuery(Components);
  }

  // EXTRAS

  /**
   * Return number of entities
   */
  count() {
    return this.entities.length;
  }

  /**
   * Return some stats
   */
  stats() {
    const stats = {
      numEntities: this.entities.length,
      numQueries: Object.keys(this.queryManager.queries).length,
      queries: this.queryManager.stats(),
      numComponentPool: Object.keys(this.componentsManager.componentPool)
        .length,
      componentPool: {},
      eventDispatcher: this.eventDispatcher.stats
    };

    for (const cname in this.componentsManager.componentPool) {
      if (this.componentsManager.componentPool.hasOwnProperty(cname)) {

        const pool = this.componentsManager.componentPool[cname];
        stats.componentPool[cname] = {
          used: pool.totalUsed(),
          size: pool.count
        };

      }
    }

    return stats;
  }
}

const ENTITY_CREATED = 'EntityManager#ENTITY_CREATE';
const ENTITY_REMOVED = 'EntityManager#ENTITY_REMOVED';
const COMPONENT_ADDED = 'EntityManager#COMPONENT_ADDED';
const COMPONENT_REMOVE = 'EntityManager#COMPONENT_REMOVE';
