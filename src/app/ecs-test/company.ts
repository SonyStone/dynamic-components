import { response } from 'express';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Database, Entity } from './ecs';
import { getCompanies, getDict, getMyCompany } from './get-company';

/** id сущности */
class Id {
  id: number;
}

/** титул, любой */
class Title {
  title: string;
}

/** название места */
class Place {
  title: string;
}

/** сслыка на аватарку */
class Avatar {
  src: string;
}

/**
 * состояние получения данных
 * само наличие класса у entity говорит, что entity в состоянии ожидания данных.
 */
class Panding {}

/**
 * состояние верефикации
 * само наличие класса у entity говорит, что entity верефицирован
 * (чтобы это не значаило)
 */
class Verified {}

/** мой entity */
class My {}

/** entity это компания */
class Company {}

class Value {
  value: any;
}

const createCompanyEntity = ({
  id,
  title,
  place,
  avatar,
}) =>
new Entity()
  .add(Company) // компания
  .add(Id, { id }) // с id
  .add(Title, { title }) // с тайтлом
  .add(Place, { title: place.title }) // с местом
  .add(Avatar, { src: avatar }); // с аватаром.

const createDictEntity = ({
  id,
  value,
}) => new Entity()
  .add(Id, { id })
  .add(Value, { value });

export const create = () => {

  const world = new Database();

  const all = forkJoin([
    // запрос компании с бэка
    getMyCompany()
      .pipe(
        tap((response) => {
          const entity = createCompanyEntity(response);
          entity.add(My); // моя
          world.addEntity(entity);
        })
      ),
    getCompanies()
      .pipe(
        tap((response) => {
          for (const iterator of response) {
            const entity = createCompanyEntity(iterator);
            world.addEntity(entity);
          }
        })
      ),
    getDict()
      .pipe(
        tap((response) => {
          for (const iterator of response) {
            const entity = createDictEntity(iterator);
            world.addEntity(entity);
          }
        })
      )
  ])
  .subscribe(() => {

    console.log(world);

    const get = world.get(My); // должен вернуть entity компании;

    console.log('get', get);

  });


}

