
type World = any;

/**
 * Trait for fetching data and running systems. Automatically implemented for
 * systems.
 */
export interface RunNow {

  /**
   * Runs the system now.
   *
   * # Panics
   *
   * Panics if the system tries to fetch resources
   * which are borrowed in an incompatible way already
   * (tries to read from a resource which is already written to or
   * tries to write to a resource which is read from).
   */
  run_now(world: World): void;

  /**
   * Sets up `World` for a later call to `run_now`.
   */
  setup(world: World): void;

  /**
   * Performs clean up that requires resources from the `World`.
   * This commonly removes components from `world` which depend on external
   * resources.
   */
  dispose(world: World): void;
}


