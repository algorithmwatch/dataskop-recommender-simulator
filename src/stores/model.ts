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
