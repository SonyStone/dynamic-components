import { Component } from './component';
import { ComponentConstructor } from './component.interface';

/**
 * A system that manipulates entities in the world.
 */
export interface System {
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

export type SystemConstructor<T extends System> = new (...args: any) => T;

/**
 * Use the Not class to negate a component query.
 */
export type Not = <T extends Component>(component: ComponentConstructor<T>) => object;
