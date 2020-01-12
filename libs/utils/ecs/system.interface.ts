/**
 * A system that manipulates entities in the world.
 */
export interface System {

  priority?: number;
  order?: number;

  /**
   * Whether the system will execute during the world tick.
   */
  enabled: boolean;
  /**
   * Resume execution of this system.
   */
  play(): void;

  /**
   * Stop execution of this system.
   */
  stop(): void;
}

export interface SystemConstructor<T extends System> {
  new (...args: any): T;
  queries: any;
}

