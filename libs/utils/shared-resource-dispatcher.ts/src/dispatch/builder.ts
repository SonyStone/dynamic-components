import { Dispatcher, SystemId } from './dispatcher';
import { StagesBuilder } from './stage';

export class DispatcherBuilder {
  currentId: number;
  map: Map<string, SystemId>;
  stagesBuilder: StagesBuilder;
  threadLocal: ThreadLocal;

  /**
   * Creates a new `DispatcherBuilder`
   */
  constructor() {}

  /**
   * Adds a new system with a given name and a list of dependencies.
   * Please note that the dependency should be added before
   * you add the depending system.
   *
   * If you want to register systems which can not be specified as
   * dependencies, you can use `""` as their name, which will not panic
   * (using another name twice will).
   *
   * Same as `add()`, but
   * returns `this` to enable method chaining.
   *
   * # Error
   *
   * * if the specified dependency does not exist
   * * if a system with the same name was already registered.
   */
  with<T>(system: T, name: string, dep: string[]): this {
    this.add(system, name, dep);

    return this;
  }

  /**
   * Adds a new system with a given name and a list of dependencies.
   * Please note that the dependency should be added before
   * you add the depending system.
   *
   * If you want to register systems which can not be specified as
   * dependencies, you can use `""` as their name, which will not panic
   * (using another name twice will).
   *
   * # Error
   *
   * * if the specified dependency does not exist
   * * if a system with the same name was already registered.
   */
  add<T>(system: T, name: string, dep: string[]): void {
    const id = this.nextId();

    const dependencies = dep.map((x) => {
      const systemDependency = this.map.get(x);

      if (!system) {
        console.error(`No such system registered ("${x}")`);
      }

      return systemDependency;
    });

    if (name !== '') {
      if (!this.map.has(name)) {
          this.map.set(name, id);
      } else {
        console.error(`Cannot insert multiple systems with the same name ("${name}")`);
      }
    }

    this.stagesBuilder.insert(dependencies, id, system);
  }

  /**
   * In the future, this method will
   * precompute useful information in
   * order to speed up dispatching.
   */
  build(): Dispatcher {
    const d = new Dispatcher(this.stagesBuilder.build(), this.threadLocal);

    return d;
  }

  private nextId(): SystemId {
    const id = this.currentId;
    this.currentId += 1;

    return id;
  }
}
