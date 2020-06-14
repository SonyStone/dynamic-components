import { iterableChangesAsString } from '../util-spec/iterable-changes-as-string';
import { iterableDifferToString } from '../util-spec/iterable-differ-to-string';
import { DefaultIterableDiffer } from './iterable-differ';

describe('iterable differ', () => {

  let differ: DefaultIterableDiffer<any>;

  describe('JS Array changes', () => {

    beforeEach(() => {
      differ = new DefaultIterableDiffer();
    });

    it('should support iterables', () => {

      differ.check([]);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: [],
        })
      );

      differ.check([1]);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:1'],
          additions: ['[null->0]:1']
        })
      );

      differ.check([2, 1]);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:2', '[0->1]:1'],
          previous: ['[0->1]:1'],
          additions: ['[null->0]:2'],
          moves: ['[0->1]:1']
        })
      );
    });

    it('should detect additions', () => {
      const l: any[] = [];
      differ.check(l);
      expect(iterableDifferToString(differ.changes)).toEqual(iterableChangesAsString({state: []}));

      l.push('a');
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:a'],
          additions: ['[null->0]:a']
        })
      );

      l.push('b');
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', '[null->1]:b'],
          previous: ['a'],
          additions: ['[null->1]:b'],
        })
      );
    });

    it('should support changing the reference', () => {
      let l = [0];
      differ.check(l);

      l = [1, 0];
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:1', '[0->1]:0'],
          previous: ['[0->1]:0'],
          additions: ['[null->0]:1'],
          moves: ['[0->1]:0'],
        })
      );

      l = [2, 1, 0];
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:2', '[0->1]:1', '[1->2]:0'],
          previous: ['[0->1]:1', '[1->2]:0'],
          additions: ['[null->0]:2'],
          moves: ['[0->1]:1', '[1->2]:0']
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
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[1->0]:2', '[0->1]:1'],
          previous: ['[0->1]:1', '[1->0]:2'],
          moves: ['[1->0]:2', '[0->1]:1']
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
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[1->0]:b', '[0->1]:a', 'c'],
          previous: ['[0->1]:a', '[1->0]:b', 'c'],
          moves: ['[1->0]:b', '[0->1]:a']
        })
      );

      l.splice(1, 1);
      l.push('a');
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['b', '[2->1]:c', '[1->2]:a'],
          previous: ['b', '[1->2]:a', '[2->1]:c'],
          moves: ['[2->1]:c', '[1->2]:a']
        })
      );
    });

    it('should detect changes in list', () => {
      const l: any[] = [];
      differ.check(l);

      l.push('a');
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:a'],
          additions: ['[null->0]:a']
        })
      );

      l.push('b');
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', '[null->1]:b'],
          previous: ['a'],
          additions: ['[null->1]:b'],
        })
      );

      l.push('c');
      l.push('d');
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', 'b', '[null->2]:c', '[null->3]:d'],
          previous: ['a', 'b'],
          additions: ['[null->2]:c', '[null->3]:d']
        })
      );

      l.splice(2, 1);
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', 'b', '[3->2]:d'],
          previous: ['a', 'b', '[2->null]:c', '[3->2]:d'],
          moves: ['[3->2]:d'],
          removals: ['[2->null]:c']
        })
      );

      l.length = 0;
      l.push('d');
      l.push('c');
      l.push('b');
      l.push('a');
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[2->0]:d', '[null->1]:c', '[1->2]:b', '[0->3]:a'],
          previous: ['[0->3]:a', '[1->2]:b', '[2->0]:d'],
          additions: ['[null->1]:c'],
          moves: ['[2->0]:d', '[1->2]:b', '[0->3]:a']
        })
      );
    });

    it('should ignore [NaN] != [NaN]', () => {
      const l = [NaN];
      differ.check(l);
      differ.check(l);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: [NaN],
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
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:foo', '[0->1]:NaN', '[1->2]:NaN'],
          previous: ['[0->1]:NaN', '[1->2]:NaN'],
          additions: ['[null->0]:foo'],
          moves: ['[0->1]:NaN', '[1->2]:NaN']
        })
      );
    });

    it('should remove and add same item', () => {
      const l = ['a', 'b', 'c'];
      differ.check(l);

      l.splice(1, 1);
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', '[2->1]:c'],
          previous: ['a', '[1->null]:b', '[2->1]:c'],
          moves: ['[2->1]:c'],
          removals: ['[1->null]:b']
        })
      );

      l.splice(1, 0, 'b');
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', '[null->1]:b', '[1->2]:c'],
          previous: ['a', '[1->2]:c'],
          additions: ['[null->1]:b'],
          moves: ['[1->2]:c']
        })
      );
    });

    it('should support duplicates', () => {
      const l = ['a', 'a', 'a', 'b', 'b'];
      differ.check(l);

      l.splice(0, 1);
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', 'a', '[3->2]:b', '[4->3]:b'],
          previous: ['a', 'a', '[2->null]:a', '[3->2]:b', '[4->3]:b'],
          moves: ['[3->2]:b', '[4->3]:b'],
          removals: ['[2->null]:a']
        })
      );
    });

    it('should support insertions/moves', () => {
      const l = ['a', 'a', 'b', 'b'];
      differ.check(l);

      l.splice(0, 0, 'b');
      differ.check(l);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[2->0]:b', '[0->1]:a', '[1->2]:a', 'b', '[null->4]:b'],
          previous: ['[0->1]:a', '[1->2]:a', '[2->0]:b', 'b'],
          additions: ['[null->4]:b'],
          moves: ['[2->0]:b', '[0->1]:a', '[1->2]:a']
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
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[1->0]:b', '[0->1]:a', 'c'],
          previous: ['[0->1]:a', '[1->0]:b', 'c'],
          moves: ['[1->0]:b', '[0->1]:a']
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
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', '[null->1]:b', '[1->2]:*', 'd', '-', '[null->5]:c', '[5->6]:-', 'e'],
          previous: ['a', '[1->2]:*', '[2->null]:*', 'd', '-', '[5->6]:-', '[6->null]:-', 'e'],
          additions: ['[null->1]:b', '[null->5]:c'],
          moves: ['[1->2]:*', '[5->6]:-'],
          removals: ['[2->null]:*', '[6->null]:-'],
        })
      );
    });

    describe('diff', () => {
      it('should return self when there is a change', () => {
        expect(differ.diff(['a', 'b'])).toBe(differ.changes);
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
            previous: ['[0->null]:a', '[1->null]:b'],
            removals: ['[0->null]:a', '[1->null]:b']
          })
        );
      });

      it('should throw when given an invalid state', () => {
        expect(() => differ.diff('invalid')).toThrowError(/Error trying to diff 'invalid'/);
      });
    });
  })

  describe('JS Set changes', () => {

    beforeEach(() => { differ = new DefaultIterableDiffer(); });

    it('should support set', () => {
      const set = new Set();

      differ.check(set);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: [],
        })
      );

      set.add('a')

      differ.check(set);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:a'],
          additions: ['[null->0]:a']
        })
      );

      set.add('b');

      differ.check(set);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['a', '[null->1]:b'],
          previous: ['a'],
          additions: ['[null->1]:b'],
        })
      );

      set.delete('a')

      differ.check(set);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[1->0]:b'],
          previous: ['[0->null]:a', '[1->0]:b'],
          removals: ['[0->null]:a'],
          moves: ['[1->0]:b'],
        })
      );
    });
  })

  describe('JS Map changes', () => {

    beforeEach(() => {
      // map return as [key, value] tuple
      const trackByFn = (key: number, value: [any, any]) => value[0];
      differ = new DefaultIterableDiffer(trackByFn);
    });

    it('should support set', () => {
      const map = new Map();

      differ.check(map);
      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: [],
        })
      );

      map.set(1, 'a');

      differ.check(map);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[null->0]:[1, a]'],
          additions: ['[null->0]:[1, a]']
        })
      );

      map.set('b', 2);

      differ.check(map);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[1, a]', '[null->1]:[b, 2]'],
          previous: ['[1, a]'],
          additions: ['[null->1]:[b, 2]'],
          identityChanges: ['[1, a]'], // differ thinks, that value in map has been changed, but it's not.
        })
      );

      map.delete(1);
      differ.check(map);

      expect(
        iterableDifferToString(differ.changes)
      ).toEqual(
        iterableChangesAsString({
          state: ['[1->0]:[b, 2]'],
          previous: ['[0->null]:[1, a]', '[1->0]:[b, 2]'],
          removals: ['[0->null]:[1, a]'],
          moves: ['[1->0]:[b, 2]'],
          identityChanges: ['[1->0]:[b, 2]'],
        })
      );
    });
  })
})