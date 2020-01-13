import { Component } from './component';
import { ComponentConstructor } from './component.interface';
import { Query } from './entity/query';
import { System } from './system.interface';
import { World } from './world';

export class SystemBase implements System {

  enabled = true;

  // @todo Better naming :)
  queriesOther = {};
  queries: any = {};

  priority = 0;

  // Used for stats
  executeTime = 0;

  mandatoryQueries = [];

  initialized = true;

  order = 0;

  canExecute() {
    if (this.mandatoryQueries.length === 0) { return true; }

    for (const query of this.mandatoryQueries) {
      if (query.entities.length === 0) {
        return false;
      }
    }

    return true;
  }

  constructor(
    private world: World,
    private attributes?: any,
  ) {


    if (attributes && attributes.priority) {
      this.priority = attributes.priority;
    }

    if ((this.constructor as any).queries) {

      for (const queryName in (this.constructor as any).queries) {
        if ((this.constructor as any).queries.hasOwnProperty(queryName)) {

          const queryConfig = (this.constructor as any).queries[queryName];

          const components = queryConfig.components;

          if (!components || components.length === 0) {
            throw new Error('\'components\' attribute can\'t be empty in a query');
          }

          const query = this.world.entityManager.queryComponents(components);

          this.queriesOther[queryName] = query;

          if (queryConfig.mandatory === true) {
            this.mandatoryQueries.push(query);
          }

          this.queries[queryName] = {
            results: query.entities
          };

          // Reactive configuration added/removed/changed
          const validEvents = ['added', 'removed', 'changed'];

          const eventMapping = {
            added: Query.prototype.ENTITY_ADDED,
            removed: Query.prototype.ENTITY_REMOVED,
            changed: Query.prototype.COMPONENT_CHANGED // Query.prototype.ENTITY_CHANGED
          };

          if (queryConfig.listen) {
            validEvents.forEach(eventName => {
              // Is the event enabled on this system's query?
              if (queryConfig.listen[eventName]) {
                const event = queryConfig.listen[eventName];

                if (eventName === 'changed') {
                  query.reactive = true;
                  if (event === true) {
                    // Any change on the entity from the components in the query
                    const eventList = (this.queries[queryName][eventName] = []);
                    query.eventDispatcher.addEventListener(
                      Query.prototype.COMPONENT_CHANGED,
                      (entity) => {
                        // Avoid duplicates
                        if (eventList.indexOf(entity) === -1) {
                          eventList.push(entity);
                        }
                      }
                    );
                  } else if (Array.isArray(event)) {
                    const eventList = (this.queries[queryName][eventName] = []);
                    query.eventDispatcher.addEventListener(
                      Query.prototype.COMPONENT_CHANGED,
                      (entity, changedComponent) => {
                        // Avoid duplicates
                        if (
                          event.indexOf(changedComponent.constructor) !== -1 &&
                          eventList.indexOf(entity) === -1
                        ) {
                          eventList.push(entity);
                        }
                      }
                    );
                  } else {
                    /*
                    // Checking just specific components
                    let changedList = (this.queries[queryName][eventName] = {});
                    event.forEach(component => {
                      let eventList = (changedList[
                        componentPropertyName(component)
                      ] = []);
                      query.eventDispatcher.addEventListener(
                        Query.prototype.COMPONENT_CHANGED,
                        (entity, changedComponent) => {
                          if (
                            changedComponent.constructor === component &&
                            eventList.indexOf(entity) === -1
                          ) {
                            eventList.push(entity);
                          }
                        }
                      );
                    });
                    */
                  }
                } else {
                  const eventList = (this.queries[queryName][eventName] = []);

                  query.eventDispatcher.addEventListener(eventMapping[eventName],
                    entity => {
                      // @fixme overhead?
                      if (eventList.indexOf(entity) === -1) {

                        eventList.push(entity);
                      }
                    }
                  );
                }
              }
            });
          }
        }
      }
    }
  }

  stop() {
    this.executeTime = 0;
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  }

  run(): void {}

  // @question rename to clear queues?
  clearEvents() {

    for (const queryName in this.queries) {
      if (this.queries.hasOwnProperty(queryName)) {

        const query = this.queries[queryName];
        if (query.added) {
          query.added.length = 0;
        }
        if (query.removed) {
          query.removed.length = 0;
        }
        if (query.changed) {
          if (Array.isArray(query.changed)) {
            query.changed.length = 0;
          } else {
            for (const name in query.changed) {
              if (query.changed.hasOwnProperty(name)) {
                query.changed[name].length = 0;
              }
            }
          }
        }
      }
    }
  }

  toJSON() {
    const json = {
      name: this.constructor.name,
      enabled: this.enabled,
      executeTime: this.executeTime,
      priority: this.priority,
      queries: {}
    };

    if ((this.constructor as any).queries) {
      const queries = (this.constructor as any).queries;

      for (const queryName in queries) {
        if (queries.hasOwnProperty(queryName)) {

          const query = this.queries[queryName];
          const queryDefinition = queries[queryName];
          const jsonQuery = (json.queries[queryName] = {
            key: this.queriesOther[queryName].key,
            mandatory: undefined,
            reactive: undefined,
            listen: undefined,
          });

          jsonQuery.mandatory = queryDefinition.mandatory === true;
          jsonQuery.reactive =
            queryDefinition.listen &&
            (queryDefinition.listen.added === true ||
              queryDefinition.listen.removed === true ||
              queryDefinition.listen.changed === true ||
              Array.isArray(queryDefinition.listen.changed));

          if (jsonQuery.reactive) {
            jsonQuery.listen = {};

            const methods = ['added', 'removed', 'changed'];
            methods.forEach(method => {
              if (query[method]) {
                jsonQuery.listen[method] = {
                  entities: query[method].length
                };
              }
            });
          }
        }
      }
    }

    return json;
  }
}

/**
 * Use the Not class to negate a component query.
 */
export const Not = <T extends Component>(component: ComponentConstructor<T>) => ({
  operator: 'not',
  component,
});
