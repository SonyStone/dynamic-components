import { Stage } from './stage';

export type SystemId = number;

export class Dispatcher {

  constructor(
    public stages: Stage[],
    public threadLocal: ThreadLocal[],
  ) {}

  /**
   * Sets up all the systems which means they are gonna add default values
   * for the resources they need.
   */
  setup(world: World) {
    for (const stage of this.stages) {
      stage.setup(world);
    }

    for (const sys of this.threadLocal) {
        sys.setup(world);
    }
  }

  /**
   * Calls the `dispose` method of all systems and allows them to release
   * external resources. It is common this method removes components and
   * / or resources from the `World` which are associated with external
   * resources.
   */
  dispose(world: World) {
    for (const stage of this.stages) {
      stage.dispose(world);
    }

    for (const sys of this.threadLocal) {
      sys.dispose(world);
    }
  }

  /**
   * Dispatch all the systems with given resources and context
   * and then run thread local systems.
   *
   * This function automatically redirects to
   *
   * * [this.dispatchSeq]
   *
   * and runs `dispatch_thread_local` afterwards.
   *
   * Please note that this method assumes that no resource
   * is currently borrowed. If that's the case, it panics.
   */
  dispatch(world: World) {
    this.dispatchSeq(world);

    this.dispatchThreadLocal(world);
  }

  /**
   * Dispatches the systems (except thread local systems) sequentially.
   *
   * This is useful if parallel overhead is
   * too big or the platform does not support multithreading.
   *
   * Please note that this method assumes that no resource
   * is currently borrowed. If that's the case, it panics.
   */
  dispatchSeq(world: World) {
    for (const stage of this.stages) {
      stage.executeSeq(world);
    }
  }

  /**
   * Dispatch only thread local systems sequentially.
   *
   * Please note that this method assumes that no resource
   * is currently borrowed. If that's the case, it panics.
   */
  dispatchThreadLocal(world: World) {
    for (const sys of this.threadLocal) {
      sys.runNow(world);
    }
  }
}
