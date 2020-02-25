import { DefaultIterableDiffer } from './iterable-differ';
import { iterableChangesAsString, iterableDifferToString } from './util.spec';


describe('iterable differ', () => {

  let differ: DefaultIterableDiffer<any>;

  beforeEach(() => { differ = new DefaultIterableDiffer(); });

  it('should support iterables', () => {

    differ.check([]);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: [],
      })
    );

    differ.check([1]);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['1[null->0]'],
        additions: ['1[null->0]']
      })
    );

    differ.check([2, 1]);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['2[null->0]', '1[0->1]'],
        previous: ['1[0->1]'],
        additions: ['2[null->0]'],
        moves: ['1[0->1]']
      })
    );
  });

  it('should detect additions', () => {
    const l: any[] = [];
    differ.check(l);
    expect(iterableDifferToString(differ)).toEqual(iterableChangesAsString({collection: []}));

    l.push('a');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a[null->0]'],
        additions: ['a[null->0]']
      })
    );

    l.push('b');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'b[null->1]'],
        previous: ['a'],
        additions: ['b[null->1]'],
      })
    );
  });

  it('should support changing the reference', () => {
    let l = [0];
    differ.check(l);

    l = [1, 0];
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['1[null->0]', '0[0->1]'],
        previous: ['0[0->1]'],
        additions: ['1[null->0]'],
        moves: ['0[0->1]']
      })
    );

    l = [2, 1, 0];
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['2[null->0]', '1[0->1]', '0[1->2]'],
        previous: ['1[0->1]', '0[1->2]'],
        additions: ['2[null->0]'],
        moves: ['1[0->1]', '0[1->2]']
      })
    );
  });

  it('should handle swapping element', () => {
    const l = [1, 2];
    differ.check(l);

    l.length = 0;
    l.push(2);
    l.push(1);
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['2[1->0]', '1[0->1]'],
        previous: ['1[0->1]', '2[1->0]'],
        moves: ['2[1->0]', '1[0->1]']
      })
    );
  });

  it('should handle incremental swapping element', () => {
    const l = ['a', 'b', 'c'];
    differ.check(l);

    l.splice(1, 1);
    l.splice(0, 0, 'b');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['b[1->0]', 'a[0->1]', 'c'],
        previous: ['a[0->1]', 'b[1->0]', 'c'],
        moves: ['b[1->0]', 'a[0->1]']
      })
    );

    l.splice(1, 1);
    l.push('a');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['b', 'c[2->1]', 'a[1->2]'],
        previous: ['b', 'a[1->2]', 'c[2->1]'],
        moves: ['c[2->1]', 'a[1->2]']
      })
    );
  });

  it('should detect changes in list', () => {
    const l: any[] = [];
    differ.check(l);

    l.push('a');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a[null->0]'],
        additions: ['a[null->0]']
      })
    );

    l.push('b');
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'b[null->1]'],
        previous: ['a'],
        additions: ['b[null->1]'],
      })
    );

    l.push('c');
    l.push('d');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'b', 'c[null->2]', 'd[null->3]'],
        previous: ['a', 'b'],
        additions: ['c[null->2]', 'd[null->3]']
      })
    );

    l.splice(2, 1);
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'b', 'd[3->2]'],
        previous: ['a', 'b', 'c[2->null]', 'd[3->2]'],
        moves: ['d[3->2]'],
        removals: ['c[2->null]']
      })
    );

    l.length = 0;
    l.push('d');
    l.push('c');
    l.push('b');
    l.push('a');
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['d[2->0]', 'c[null->1]', 'b[1->2]', 'a[0->3]'],
        previous: ['a[0->3]', 'b[1->2]', 'd[2->0]'],
        additions: ['c[null->1]'],
        moves: ['d[2->0]', 'b[1->2]', 'a[0->3]']
      })
    );
  });

  it('should ignore [NaN] != [NaN]', () => {
    const l = [NaN];
    differ.check(l);
    differ.check(l);

    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: [NaN],
        previous: [NaN],
      })
    );
  });

  it('should detect [NaN] moves', () => {
    const l: any[] = [NaN, NaN];
    differ.check(l);

    l.unshift('foo');
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['foo[null->0]', 'NaN[0->1]', 'NaN[1->2]'],
        previous: ['NaN[0->1]', 'NaN[1->2]'],
        additions: ['foo[null->0]'],
        moves: ['NaN[0->1]', 'NaN[1->2]']
      })
    );
  });

  it('should remove and add same item', () => {
    const l = ['a', 'b', 'c'];
    differ.check(l);

    l.splice(1, 1);
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'c[2->1]'],
        previous: ['a', 'b[1->null]', 'c[2->1]'],
        moves: ['c[2->1]'],
        removals: ['b[1->null]']
      })
    );

    l.splice(1, 0, 'b');
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'b[null->1]', 'c[1->2]'],
        previous: ['a', 'c[1->2]'],
        additions: ['b[null->1]'],
        moves: ['c[1->2]']
      })
    );
  });

  it('should support duplicates', () => {
    const l = ['a', 'a', 'a', 'b', 'b'];
    differ.check(l);

    l.splice(0, 1);
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'a', 'b[3->2]', 'b[4->3]'],
        previous: ['a', 'a', 'a[2->null]', 'b[3->2]', 'b[4->3]'],
        moves: ['b[3->2]', 'b[4->3]'],
        removals: ['a[2->null]']
      })
    );
  });

  it('should support insertions/moves', () => {
    const l = ['a', 'a', 'b', 'b'];
    differ.check(l);

    l.splice(0, 0, 'b');
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['b[2->0]', 'a[0->1]', 'a[1->2]', 'b', 'b[null->4]'],
        previous: ['a[0->1]', 'a[1->2]', 'b[2->0]', 'b'],
        additions: ['b[null->4]'],
        moves: ['b[2->0]', 'a[0->1]', 'a[1->2]']
      })
    );
  });

  it('should not report unnecessary moves', () => {
    const l = ['a', 'b', 'c'];
    differ.check(l);

    l.length = 0;
    l.push('b');
    l.push('a');
    l.push('c');
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['b[1->0]', 'a[0->1]', 'c'],
        previous: ['a[0->1]', 'b[1->0]', 'c'],
        moves: ['b[1->0]', 'a[0->1]']
      })
    );
  });

  // https://github.com/angular/angular/issues/17852
  it('support re-insertion', () => {
    const l = ['a', '*', '*', 'd', '-', '-', '-', 'e'];
    differ.check(l);
    l[1] = 'b';
    l[5] = 'c';
    differ.check(l);
    expect(
      iterableDifferToString(differ)
    ).toEqual(
      iterableChangesAsString({
        collection: ['a', 'b[null->1]', '*[1->2]', 'd', '-', 'c[null->5]', '-[5->6]', 'e'],
        previous: ['a', '*[1->2]', '*[2->null]', 'd', '-', '-[5->6]', '-[6->null]', 'e'],
        additions: ['b[null->1]', 'c[null->5]'],
        moves: ['*[1->2]', '-[5->6]'],
        removals: ['*[2->null]', '-[6->null]'],
      })
    );
  });

  describe('diff', () => {
    it('should return self when there is a change', () => {
      expect(differ.diff(['a', 'b'])).toBe(differ);
    });

    it('should return null when there is no change', () => {
      differ.diff(['a', 'b']);
      expect(differ.diff(['a', 'b'])).toEqual(null);
    });

    it('should treat null as an empty list', () => {
      differ.diff(['a', 'b']);

      expect(
        iterableDifferToString(differ.diff(null))
      ).toEqual(
        iterableChangesAsString({
          previous: ['a[0->null]', 'b[1->null]'],
          removals: ['a[0->null]', 'b[1->null]']
        })
      );
    });

    it('should throw when given an invalid collection', () => {
      expect(() => differ.diff('invalid')).toThrowError(/Error trying to diff 'invalid'/);
    });
  });
})