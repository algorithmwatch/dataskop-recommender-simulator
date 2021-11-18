import {
  faCameraMovie,
  faGamepadAlt,
  faMusic,
  faUserFriends,
  faNewspaper,
} from '@fortawesome/pro-solid-svg-icons';
import { sample, random, times } from 'lodash';
import firstNames from 'src/components/Column/first_names.json';

// export interface ColumnItem {
//   id: number;
//   category: {
//       label: string;
//       color: string;
//       icon: IconDefinition;
//   } | undefined;
//   hasAd: boolean;
//   age: string | undefined;
//   source: string | undefined;
//   fav: number;
// }

const ageTypes = {
  today: 'Heute',
  week: 'Diese Woche',
  month: 'Diesen Monat',
  year: 'Dieses Jahr',
};
const sourceTypes = {
  public: 'öffentlich rechtlich',
  private: 'privat',
  other: 'unbestimmt',
};

const categories = [
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

const createItem = (id: number) => {
  return {
    id,
    category: sample(categories),
    hasAd: random(0, 10) < 5,
    age: sample(Object.keys(ageTypes)),
    source: sample(Object.keys(sourceTypes)),
    fav: random(30, 99),
  };
};

// creates a random column
export const createColumn = () => {
  const usedIds: number[] = [];
  const createUniqueId = () => {
    while (true) {
      let id = random(100, 1000);
      if (usedIds.includes(id)) {
        continue;
      }
      usedIds.push(id);
      return id;
    }
  };

  return {
    name: sample(firstNames) as string,
    items: times(20, () => {
      return createItem(createUniqueId());
    }),
  };
};
