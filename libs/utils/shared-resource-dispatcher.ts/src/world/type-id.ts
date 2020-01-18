///////////////////////////////////////////////////////////////////////////////
// TypeID and its methods
///////////////////////////////////////////////////////////////////////////////

/**
 * A `TypeId` represents a globally unique identifier for a type.
 *
 * Each `TypeId` is an opaque object which does not allow inspection of what's
 * inside but does allow basic operations such as cloning, comparison,
 * printing, and showing.
 *
 * A `TypeId` is currently only available for types which ascribe to `'static`,
 * but this limitation may be removed in the future.
 */
class TypeId {

  id = 0;

  of(): number {
    const ofId = this.id;
    this.id++;

    return  ofId;
  }
}

export const typeId = new TypeId();
