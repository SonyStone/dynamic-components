import { ObjectPool } from './object-pool';
import { Pool } from './pool.interface';
import { Resettable } from './resettable.interface';

describe('object-pool', () => {
  describe('ObjectPool', () => {

    interface Data {
      id: number;
      x: number;
    }

    let pool: Pool<Data & Resettable>;

    beforeEach(() => {

      let id = 0;

      class DataObject implements Data, Resettable {
        id = id++;
        x = 0;
        reset() {
          this.id = id++;
          this.x = 0;
        }
      }

      pool = new ObjectPool(DataObject);
    });

    it('should create object pool', () => {
      expect(pool.count).toBe(0);
      expect(pool.totalFree()).toBe(0);
      expect(pool.totalUsed()).toBe(0);
    })

    it('should create 10 objects', () => {
      const objs = [];
      for (let i = 0; i < 10; i++) {
        objs.push(pool.aquire());
      }

      expect(pool.count).toBe(12);
      expect(pool.totalFree()).toBe(2);
      expect(pool.totalUsed()).toBe(10);
    })

    it('should return all unique objects', () => {

      const objs = [];
      for (let i = 0; i < 10; i++) {
        objs.push(pool.aquire());
      }

      // Object Pool doesn't guarantee the order of the retrieved components
      // But each attribute should be different, so we check all against all
      for (let i = 0; i < 10; i++) {
        for (let j = i + 1; j < 10; j++) {
          expect(objs[i].id).not.toBe(objs[j].id);
        }
      }
    })

    it('should return objects to pool', () => {

      const objs = [];
      for (let i = 0; i < 10; i++) {
        objs.push(pool.aquire());
      }

      while (objs.length > 0) {
        pool.release(objs.shift());
      }

      expect(pool.count).toBe(12);
      expect(pool.totalFree()).toBe(12);
      expect(pool.totalUsed()).toBe(0);
    })

    it('should reuse objects from the pool', () => {
      const objs = [];
      for (let i = 0; i < 10; i++) {
        objs.push(pool.aquire());
      }

      const removeElement = (pos) => {
        pool.release(objs[pos]);
        objs.splice(pos, 1);
      }

      removeElement(0);
      removeElement(1);
      removeElement(2);

      expect(pool.totalSize()).toBe(12);
      expect(pool.totalFree()).toBe(5);
      expect(pool.totalUsed()).toBe(7);

      // Create new components
      for (let i = 0; i < 3; i++) {
        objs.push(pool.aquire());
      }

      for (let i = 0; i < objs.length; i++) {
        for (let j = i + 1; j < objs.length; j++) {
          expect(objs[i].id).not.toBe(objs[j].id);
        }
      }

      expect(pool.totalSize()).toBe(12);
      expect(pool.totalFree()).toBe(2);
      expect(pool.totalUsed()).toBe(10);
    })
  })
});

