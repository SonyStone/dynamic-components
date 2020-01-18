import { ResourceId } from '../world/resource-id';
import { SystemId } from './dispatcher';

export class Stage {
  groups: SystemExecSend[];

  constructor() {}


  setup(world: World) {
    for (const group of this.groups) {
      for (const sys of group) {
        sys.setup(world);
      }
    }
  }

  dispose(world: World) {
    for (const group of this.groups) {
      for (const sys of group) {
        sys.dispose(world);
      }
    }
  }

  executeSeq(world: World) {
    for (const group of this.groups) {
      for (const system of group) {
          system.runNow(world);
      }
    }
  }
}

export class StagesBuilder {
  barrier: number;
  ids: SystemId[];
  reads: ResourceId[];
  runningTime: number[];
  stages: Stage[];
  writes: ResourceId[];

  insert<T>(dep: SystemId[], id: SystemId, system: T) {

      let reads = system.accessor().reads();
      let writes = system.accessor().writes();

      reads.sort();
      reads.dedup();

      let newTime = system.runningTime();

      let target = this.insertionTarget(&reads, &writes, &mut dep, new_time);

      let (stage, group) = match target {
          InsertionTarget::Stage(stage) => {
              let group = self.ids[stage].len();
              self.add_group(stage);

              (stage, group)
          }
          InsertionTarget::Group(stage, group) => (stage, group),
          InsertionTarget::NewStage => {
              let stage = self.stages.len();

              self.add_stage();
              self.add_group(stage);

              (stage, 0)
          }
      };

      this.ids[stage][group].push(id);
      this.reads[stage][group].extend(reads);
      this.runningTime[stage][group] += new_time as u8;
      this.stages[stage].groups[group].push(Box::new(system));
      this.writes[stage][group].extend(writes);
  }

  pub fn build(self) -> Vec<Stage<'a>> {
      self.stages
  }
}
