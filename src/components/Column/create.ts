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
    color: '#253169',
    icon: faCameraMovie,
  },
  {
    label: 'Gaming',
    color: '#D4161A',
    icon: faGamepadAlt,
  },
  {
    label: 'Musik, Tiere, Sport',
    color: '#4F9484',
    icon: faMusic,
  },
  {
    label: 'Menschen & Blogs',
    color: '#F6CC00',
    icon: faUserFriends,
  },
  {
    label: 'Nachrichten & Politik',
    color: '#8C8C8C',
    icon: faNewspaper,
  },
];

const createItem = () => {
  return {
    id: random(100, 1000),
    category: sample(categories),
    hasAd: random(0, 10) < 5,
    age: sample(Object.keys(ageTypes)),
    source: sample(Object.keys(sourceTypes)),
    fav: random(30, 99),
  };
};

// creates a random column
export const createColumn = () => {
  return {
    name: sample(firstNames) as string,
    items: times(20, createItem),
  };
};
