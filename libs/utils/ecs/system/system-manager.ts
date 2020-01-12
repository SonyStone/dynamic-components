
// tslint:disable:no-bitwise

export class SystemManager {
  private systems = [];
  private executeSystems = []; // Systems that have `execute` method

  lastExecutedSystem = null;

  constructor(
    private world,
  ) {}

  registerSystem(System, attributes) {
    if (
      this.systems.find(s => s.constructor.name === System.name) !== undefined
    ) {
      console.warn(`System '${System.name}' already registered.`);
      return this;
    }

    const system = new System(this.world, attributes);
    if (system.init) { system.init(); }
    system.order = this.systems.length;
    this.systems.push(system);
    if (system.execute) {
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

  getSystem(System) {
    return this.systems.find(s => s instanceof System);
  }

  getSystems() {
    return this.systems;
  }

  removeSystem(System) {
    const index = this.systems.indexOf(System);

    if (!~index) { return; }

    this.systems.splice(index, 1);
  }

  executeSystem(system, delta, time) {
    if (system.initialized) {
      if (system.canExecute()) {
        const startTime = performance.now();
        system.execute(delta, time);
        system.executeTime = performance.now() - startTime;
        this.lastExecutedSystem = system;
        system.clearEvents();
      }
    }
  }

  stop() {
    this.executeSystems.forEach(system => system.stop());
  }

  execute(delta, time, forcePlay?: boolean) {
    this.executeSystems.forEach(
      system =>
        (forcePlay || system.enabled) && this.executeSystem(system, delta, time)
    );
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

      for (const name in system.ctx) {
        if (system.ctx.hasOwnProperty(name)) {
          systemStats.queries[name] = system.ctx[name].stats();
        }
      }
    }

    return stats;
  }
}
