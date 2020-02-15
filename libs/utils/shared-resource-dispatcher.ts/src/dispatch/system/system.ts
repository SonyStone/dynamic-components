export abstract class RunNow {

  constructor(
    private T: System,
  ) {}

  runNow(world: World) {
    const data = (this.T.constructor as typeof System).systemData.fetch(this.T.accessor(), world);
    this.T.run(data);
  }

  setup(world: World) {
    this.T.setup(world);
  }

  dispose(world: World) {
    this.T.dispose(world);
  }
}


enum RunningTime {
  VeryShort,
  Short,
  Average,
  Long,
  VeryLong,
}

type AccessorCow<T> = any;
type World = any;

/**
 * A `System`, executed with a set of required [`Resource`]s.
 */
export abstract class System {
  /**
   * The resource bundle required to execute this system.
   * You will mostly use a tuple of system data (which also implements
   * `SystemData`). You can also create such a resource bundle by simply
   * deriving `SystemData` for a struct.
   * Every `SystemData` is also a `DynamicSystemData`.
   */
  static systemData: any;

  /**
   * Executes the system with the required system
   * data.
   */
  run(data: any) {}

  /**
   * Returns a hint how long the system needs for running.
   * This is used to optimize the way they're executed (might
   * allow more parallelization).
   *
   * Defaults to `RunningTime::Average`.
   */
  running_time(): RunningTime {
    return RunningTime.Average;
  }

  /**
   * Return the accessor from the [`SystemData`].
   */
  accessor(): AccessorCow<System> {
    // return AccessorCow.Owned(
    //     AccessorTy::<'a, Self>::try_new().expect("Missing implementation for `accessor`"),
    //   )
  }

  /**
   * Sets up the `World` using `Self::SystemData::setup`.
   */
  setup(world: World) {
    System.systemData.setup(this.accessor, world);
  }

  /**
   * Performs clean up that requires resources from the `World`.
   * This commonly removes components from `world` which depend on external
   * resources.
   */
  dispose(world: World) {}
}
