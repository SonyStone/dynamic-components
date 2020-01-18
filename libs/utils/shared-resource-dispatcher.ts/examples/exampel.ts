// #[derive(Debug, Default)]
class ResA {}

// #[derive(Debug, Default)]
class ResB {}

// #[derive(SystemData)] // Provided with `shred-derive` feature
class Data {
    a: ResA;
    b: ResB;
}

type SystemData = Data;

class EmptySystem {
  run(bundle: Data) {
    console.log(bundle.a);
    console.log(bundle.b);
  }
}

export function main() {
  const world = World.empty();
  const dispatcher = new DispatcherBuilder()
      .with(EmptySystem, 'empty', [])
      .build();

  world.insert(ResA);
  world.insert(ResB);

  dispatcher.dispatch(world);
};
