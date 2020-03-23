import { DefaultKeyValueDiffer } from './keyvalue-differ';
import { keyvalueDifferToString, keyvalueChangesAsString } from '../util-spec';

describe('keyvalue differ', () => {
  describe('DefaultKeyValueDiffer', () => {
    let differ: DefaultKeyValueDiffer<any, any>;

    describe('JS Map changes', () => {

      let m: Map<any, any>;

      beforeEach(() => {
        differ = new DefaultKeyValueDiffer<string, any>();
        m = new Map();
      });

      it('should handle changing key/values correctly', () => {

        differ.check({
          1: 10,
          2: 20
        });

        differ.check({
          1: 20,
          2: 10,
        });

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[1]:10->20', '[2]:20->10'],
            previous: ['[1]:10->20', '[2]:20->10'],
            changes: ['[1]:10->20', '[2]:20->10']
          }),
        );
      });

      it('should handle changing key/values correctly', () => {
        m.set(1, 10);
        m.set(2, 20);
        differ.check(m);

        m.set(2, 10);
        m.set(1, 20);
        differ.check(m);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[1]:10->20', '[2]:20->10'],
            previous: ['[1]:10->20', '[2]:20->10'],
            changes: ['[1]:10->20', '[2]:20->10']
          })
        );
      });

      it('should expose previous and current value', () => {
        m.set(1, 10);
        differ.check(m);

        m.set(1, 20);
        differ.check(m);

        differ.changes.forEachChangedItem((record: any) => {
          expect(record.previousValue).toEqual(10);
          expect(record.currentValue).toEqual(20);
        });

      });

      it('should do basic map watching', () => {
        differ.check(m);

        m.set('a', 'A');
        differ.check(m);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[a]:null->A'],
            additions: ['[a]:null->A']
          })
        );

        m.set('b', 'B');
        differ.check(m);

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['a', '[b]:null->B'],
            previous: ['a'],
            additions: ['[b]:null->B']
          })
        );

        m.set('b', 'BB');
        m.set('d', 'D');
        differ.check(m);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['a', '[b]:B->BB', '[d]:null->D'],
            previous: ['a', '[b]:B->BB'],
            additions: ['[d]:null->D'],
            changes: ['[b]:B->BB']
          })
        );

        m.delete('b');
        differ.check(m);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['a', 'd'],
            previous: ['a', '[b]:BB->null', 'd'],
            removals: ['[b]:BB->null']
          })
        );

        m.clear();
        differ.check(m);

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            previous: ['[a]:A->null', '[d]:D->null'],
            removals: ['[a]:A->null', '[d]:D->null']
          })
        );
      });

      it('should not see a NaN value as a change', () => {
        m.set('foo', Number.NaN);
        differ.check(m);

        differ.check(m);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['foo'],
            previous: ['foo']
          })
        );
      });

      it('should work regardless key order', () => {
        m.set('a', 0);
        m.set('b', 0);
        differ.check(m);

        m = new Map();
        m.set('b', 1);
        m.set('a', 1);
        differ.check(m);

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[b]:0->1', '[a]:0->1'],
            previous: ['[a]:0->1', '[b]:0->1'],
            changes: ['[b]:0->1', '[a]:0->1']
          })
        );
      });

      describe('diff', () => {
        it('should return self when there is a change', () => {
          m.set('a', 'A');
          expect(differ.diff(m)).toBe(differ);
        });

        it('should return null when there is no change', () => {
          m.set('a', 'A');
          differ.diff(m);
          expect(differ.diff(m)).toEqual(null);
        });

        it('should treat null as an empty list', () => {
          m.set('a', 'A');
          differ.diff(m);
          differ.diff(null)
          expect(keyvalueDifferToString(differ.changes))
              .toEqual(keyvalueChangesAsString({previous: ['[a]:A->null'], removals: ['[a]:A->null']}));
        });

        it('should throw when given an invalid collection', () => {
          expect(() => differ.diff('invalid' as any)).toThrowError(/Error trying to diff 'invalid'/);
        });
      });
    })

    describe('JS Object changes', () => {

      let o: { [k: string]: string; }

      beforeEach(() => {
        differ = new DefaultKeyValueDiffer<string, any>();
        o = {};
      });

      it('should do basic object watching', () => {

        differ.check(o);

        o.a = 'A';
        differ.check(o);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[a]:null->A'],
            additions: ['[a]:null->A']
          })
        );

        o.b = 'B';
        differ.check(o);

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['a', '[b]:null->B'],
            previous: ['a'],
            additions: ['[b]:null->B']
          })
        );

        o.b = 'BB';
        o.d = 'D';
        differ.check(o);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['a', '[b]:B->BB', '[d]:null->D'],
            previous: ['a', '[b]:B->BB'],
            additions: ['[d]:null->D'],
            changes: ['[b]:B->BB']
          })
        );

        o = {};
        o.a = 'A';
        o.d = 'D';
        differ.check(o);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['a', 'd'],
            previous: ['a', '[b]:BB->null', 'd'],
            removals: ['[b]:BB->null']
          })
        );

        o = {};
        differ.check(o);
        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            previous: ['[a]:A->null', '[d]:D->null'],
            removals: ['[a]:A->null', '[d]:D->null']
          })
        );

      });

      it('should work regardless key order', () => {
        differ.check({a: 0, b: 0});
        differ.check({b: 1, a: 1});

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[b]:0->1', '[a]:0->1'],
            previous: ['[a]:0->1', '[b]:0->1'],
            changes: ['[b]:0->1', '[a]:0->1']
          })
        );
      });

      // https://github.com/angular/angular/issues/14997
      it('should work regardless key order', () => {
        differ.check({a: 1, b: 2});
        differ.check({b: 3, a: 2});
        differ.check({a: 1, b: 2});

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[a]:2->1', '[b]:3->2'],
            previous: ['[b]:3->2', '[a]:2->1'],
            changes: ['[a]:2->1', '[b]:3->2']
          })
        );
      });

      it('should when the first item is moved', () => {
        differ.check({a: 'a', b: 'b'});
        differ.check({c: 'c', a: 'a'});

        expect(
          keyvalueDifferToString(differ.changes)
        ).toEqual(
          keyvalueChangesAsString({
            state: ['[c]:null->c', 'a'],
            previous: ['a', '[b]:b->null'],
            additions: ['[c]:null->c'],
            removals: ['[b]:b->null']
          })
        );
      });

    });
  });
})