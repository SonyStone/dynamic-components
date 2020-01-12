import { Entity } from './entity';
import { Query } from './query';
import { queryKey } from '../utils';
import { Component } from '../component';

// tslint:disable:no-bitwise

/**
 * QueryManager
 */
export class QueryManager {
  // Queries indexed by a unique identifier for the components it has
  queries = {};

  constructor(
    private world: any,
  ) {}

  onEntityRemoved(entity) {
    for (const queryName in this.queries) {
      if (this.queries.hasOwnProperty(queryName)) {

        const query = this.queries[queryName];
        if (entity.queries.indexOf(query) !== -1) {
          query.removeEntity(entity);
        }

      }
    }
  }

  /**
   * Callback when a component is added to an entity
   * @param entity Entity that just got the new component
   * @param component Component added to the entity
   */
  onEntityComponentAdded(entity: Entity, component: Component) {
    // @todo Use bitmask for checking components?

    // Check each indexed query to see if we need to add this entity to the list
    for (const queryName in this.queries) {
      if (this.queries.hasOwnProperty(queryName)) {

        const query = this.queries[queryName];

        if (
          !!~query.NotComponents.indexOf(component) &&
          ~query.entities.indexOf(entity)
        ) {
          query.removeEntity(entity);
          continue;
        }

        // Add the entity only if:
        // Component is in the query
        // and Entity has ALL the components of the query
        // and Entity is not already in the query
        if (
          !~query.Components.indexOf(component) ||
          !query.match(entity) ||
          ~query.entities.indexOf(entity)
        ) {
          continue;
        }

        query.addEntity(entity);
      }

    }
  }

  /**
   * Callback when a component is removed from an entity
   * @param entity Entity to remove the component from
   * @param component Component to remove from the entity
   */
  onEntityComponentRemoved(entity: Entity, component: Component) {
    for (const queryName in this.queries) {
      if (this.queries.hasOwnProperty(queryName)) {

        const query = this.queries[queryName];

        if (
          !!~query.NotComponents.indexOf(component) &&
          !~query.entities.indexOf(entity) &&
          query.match(entity)
        ) {
          query.addEntity(entity);
          continue;
        }

        if (
          !!~query.Components.indexOf(component) &&
          !!~query.entities.indexOf(entity) &&
          !query.match(entity)
        ) {
          query.removeEntity(entity);
          continue;
        }

      }
    }
  }

  /**
   * Get a query for the specified components
   * @param components Components that the query should have
   */
  getQuery(components: Component[]) {
    const key = queryKey(components);
    let query = this.queries[key];
    if (!query) {
      this.queries[key] = query = new Query(components, this.world);
    }
    return query;
  }

  /**
   * Return some stats from this class
   */
  stats() {
    const stats = {};
    for (const queryName in this.queries) {
      if (this.queries.hasOwnProperty(queryName)) {

        stats[queryName] = this.queries[queryName].stats();

      }
    }
    return stats;
  }
}
