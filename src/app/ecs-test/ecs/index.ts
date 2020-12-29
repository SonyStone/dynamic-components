import { response } from 'express';
import { Brand } from './brand.interface';
import { Component } from './component.interface';
import { Type } from './type';

type TypeId<T> = Brand<number, T>;

class TypeManager {
  private typeId = 0 as TypeId<any>;
  private map = new Map<Type<any>, TypeId<any>>();

  addType<T>(type: Type<T>): TypeId<T> {
    if (this.map.has(type)) {
      return this.map.get(type);
    } else {
      this.typeId++;
      this.map.set(type, this.typeId);

      return this.typeId;
    }
  }
}

const typeManager: TypeManager = new TypeManager();

export class Entity {

  components = new Map<Type<Component>, Component>();

  constructor() {}

  add<T>(type: Type<T>, values?: T) {
    // не добавляем одинаковые компоненты
    if (this.components.has(type)) {
      return;
    }

    const component = new type();

    if (values) {
      for (const name in values) {
        if (values.hasOwnProperty(name)) {
          component[name] = values[name];
        }
      }
    }

    this.components.set(type, component);

    return this;
  }

  get<T>(type: Type<T>) {
    return this.components.get(type);
  }
}

export class Database {

  // All the entities in this instance
  entities: Entity[] = [];

  createEntity() {
    const entity = new Entity();

    this.entities.push(entity);

    return entity;
  }

  addEntity(entity: Entity) {

    this.entities.push(entity);

    return this;
  }

  get(...types: Type<any>[]): Entity[] {

    let response: Entity[] = [];

    for (const entity of this.entities) {
      let isHave = false;
      for (const type of types) {
        if (entity.components.has(type)) {
          isHave = true;
        } else {
          isHave = false;
          break;
        }
      }

      if (isHave) {
        response.push(entity);
      }
    }

    return response;
  }
}