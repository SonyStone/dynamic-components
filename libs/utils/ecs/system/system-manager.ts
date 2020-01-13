import { SystemBase } from '../system-base';
import { System, SystemConstructor } from '../system.interface';
import { World } from '../world';

// tslint:disable:no-bitwise

export class SystemManager {
  private systems: System[] = [];
  private executeSystems: SystemBase[] = []; // Systems that have `execute` method

  lastExecutedSystem = null;

  constructor(
    private world: World,
  ) {}

  registerSystem(systemConstructor: SystemConstructor<SystemBase>, attributes) {
    if (
      this.systems.find(s => s.constructor.name === systemConstructor.name) !== undefined
    ) {
      console.warn(`System '${systemConstructor.name}' already registered.`);
      return this;
    }

    const system = new systemConstructor(this.world, attributes);

    if ((system as any).init) {
      (system as any).init();
    }

    system.order = this.systems.length;
    this.systems.push(system);

    if (system.run) {
      this.executeSystems.push(system);
      this.sortSystems();
    }

    return this;
  }

  sortSystems() {
    this.executeSystems.sort((a, b) => {
      return a.priority - b.priority || a.order - b.order;
    });
  }

  getSystem(systemConstructor: SystemConstructor<any>): System {
    return this.systems.find(s => s instanceof systemConstructor);
  }

  getSystems(): System[] {
    return this.systems;
  }

  removeSystem(system: System): void {
    const index = this.systems.indexOf(system);

    if (!~index) { return; }

    this.systems.splice(index, 1);
  }

  runSystem(system: SystemBase): void {

    if (system.initialized) {
      if (system.canExecute()) {
        const startTime = performance.now();

        // main run;
        system.run();

        system.executeTime = performance.now() - startTime;
        this.lastExecutedSystem = system;

        system.clearEvents();
      }
    }
  }

  stop(): void {
    for (const system of this.executeSystems) {
      system.stop();
    }
  }

  run(forcePlay?: boolean): void {
    for (const system of this.executeSystems) {
      if (forcePlay || system.enabled) {
        this.runSystem(system);
      }
    }
  }

  stats() {
    const stats = {
      numSystems: this.systems.length,
      systems: {}
    };

    for (const system of this.systems) {
      const systemStats = (stats.systems[system.constructor.name] = {
        queries: {}
      });

      for (const name in (system as any).ctx) {
        if ((system as any).ctx.hasOwnProperty(name)) {
          systemStats.queries[name] = (system as any).ctx[name].stats();
        }
      }
    }

    return stats;
  }
}
