import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

interface Company {
  id: number;
  title: string;
  place: {
    title: string;
  };
  avatar: string;
}

const company: Company = {
  id: 1000003,
  title: 'Компания 1000003',
  place: {
    title: 'Unnamed Road, Айхал, Респ. Саха (Якутия), Россия, 678190',
  },
  avatar: 'logo.png',
};

export const getMyCompany = (): Observable<Company> => {
  return of(company).pipe(
    delay(1000),
    take(1),
  );
};

const companies: Company[] = [
  {
    id: 1000001,
    title: 'Компания 1000001',
    place: {
      title: 'Unnamed Road',
    },
    avatar: 'logo.png',
  },
  {
    id: 1000002,
    title: 'Компания 1000001',
    place: {
      title: 'Unnamed Road',
    },
    avatar: 'logo.png',
  },
  {
    id: 1000003,
    title: 'Компания 1000003',
    place: {
      title: 'Unnamed Road, Айхал, Респ. Саха (Якутия), Россия, 678190',
    },
    avatar: 'logo.png',
  },
  {
    id: 1000004,
    title: 'Компания 1000004',
    place: {
      title: 'Unnamed Road',
    },
    avatar: 'logo.png',
  },
];

export const getCompanies = (): Observable<Company[]> => {
  return of(companies).pipe(
    delay(1000),
    take(1),
  );
};

export const getDict = () => {
  return of([
    {
      id: 1,
      value: 13,
    },
    {
      id: 2,
      value: 543,
    },
    {
      id: 3,
      value: 630,
    },
  ]).pipe(
    delay(500),
    take(1)
  );
};
