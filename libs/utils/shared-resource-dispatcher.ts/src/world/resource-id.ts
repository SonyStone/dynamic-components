import { typeId } from './type-id';


export class ResourceId {

  readonly typeId: number = typeId.of();

  constructor(
    public dynamicId: number = 0,
  ) {}
}