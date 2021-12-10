import { sample, random, times, orderBy, pick, fill } from 'lodash';
import {
  faCameraMovie,
  faGamepadAlt,
  faMusic,
  faUserFriends,
  faNewspaper,
  IconDefinition,
} from '@fortawesome/pro-solid-svg-icons';
import { distance } from 'mathjs';
import { ColumnItem } from 'src/stores';

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
      baseRank: random(1, true),
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

  return orderByDistance(
    times(20, () => createItem(createUniqueItemId())),
    []
  );
};

export type Selection = {
  type: 'category';
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
};

export const orderByDistance = (
  items: ColumnItem[],
  selection: Selection[]
) => {
  // const selectionKeys = Object.keys(_.pickBy(selection, (v) => v !== '0'));

  // const dataKeys = Object.keys(items[0]);
  // const keys = _.intersection(selectionKeys, dataKeys);

  // if (!keys.length) return items;

  // const selectionValues = keys.map((x) => selection[x]);
  // console.log(selection);
  // console.log(selectionKeys);

  const catSelection = selection.filter((x) => x.type === 'category');

  const catSelectionKeys = catSelection.map(
    ({ label }: { label: any }) => label
  );
  const catSelectionValues = catSelection.map(
    ({ value, maxValue }: { value: number; maxValue: number }) =>
      value / maxValue
  );

  const selectionValues = catSelectionValues.concat([0]);
  // weightVector(catSelectionKeys, keys, catSelectionValues, selection);

  const orderedData = items.map((item) => {
    // const subset = keys.map((x) => item[x]);

    const itemCat = item.category.label;
    const catIndex = catSelectionKeys.indexOf(itemCat);
    const catValues = fill(Array(catSelection.length), 0);
    catValues[catIndex] = 1;

    const itemValues = catValues.concat([item.baseRank]);
    // weightVector(selectionKeys, keys, subset, selection);
    // console.log(catSelectionValues, itemValues);
    const dist = distance(selectionValues, itemValues);
    return { ...item, dist };
  });

  return orderBy(orderedData, ['dist']).map((item) =>
    pick(item, Object.keys(items[0]))
  ) as ColumnItem[];
};
