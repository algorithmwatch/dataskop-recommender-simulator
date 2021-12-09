import { sample, random, times } from 'lodash';
import {
  faCameraMovie,
  faGamepadAlt,
  faMusic,
  faUserFriends,
  faNewspaper,
  IconDefinition,
} from '@fortawesome/pro-solid-svg-icons';

export const ageTypes = {
  today: 'Heute',
  week: 'Diese Woche',
  month: 'Diesen Monat',
  year: 'Dieses Jahr',
};
// export const sourceTypes = {
//   public: 'öffentlich rechtlich',
//   private: 'privat',
//   other: 'unbestimmt',
// };

export type Category = {
  label: string;
  bgColor: string;
  icon: IconDefinition;
};

export const categories: Category[] = [
  {
    label: 'Film & Animation',
    bgColor: 'bg-blue-800',
    icon: faCameraMovie,
  },
  {
    label: 'Gaming',
    bgColor: 'bg-red-800',
    icon: faGamepadAlt,
  },
  {
    label: 'Musik, Tiere, Sport',
    bgColor: 'bg-green-900',
    icon: faMusic,
  },
  {
    label: 'Menschen & Blogs',
    bgColor: 'bg-yellow-800',
    icon: faUserFriends,
  },
  {
    label: 'Nachrichten & Politik',
    bgColor: 'bg-gray-600',
    icon: faNewspaper,
  },
];

export const createColumnItems = () => {
  const createItem = (id: number) => {
    return {
      id,
      category: sample(categories) as Category,
      hasAd: random(0, 10) < 5,
      hasPublicSource: random(0, 10) < 5,
      age: sample(Object.keys(ageTypes)) as string,
      fav: random(30, 99),
    };
  };
  const usedIds: number[] = [];
  const createUniqueItemId = () => {
    while (true) {
      let id = random(100, 1000);
      if (usedIds.includes(id)) {
        continue;
      }
      usedIds.push(id);
      return id;
    }
  };

  return times(20, () => createItem(createUniqueItemId()));
};
