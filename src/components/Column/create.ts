import { sample, random, times, uniqueId } from 'lodash';
import firstNames from 'src/components/Column/first_names.json';
import { ageTypes, categories } from 'src/model';

export type ColumnType = ReturnType<typeof createColumn>;

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

const createItem = (id: number) => {
  return {
    id,
    category: sample(categories),
    hasAd: random(0, 10) < 5,
    hasPublicSource: random(0, 10) < 5,
    age: sample(Object.keys(ageTypes)),
    fav: random(30, 99),
  };
};

// creates a random column
export const createColumn = () => {
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

  return {
    id: uniqueId('column'),
    name: sample(firstNames) as string,
    items: times(20, () => {
      return createItem(createUniqueItemId());
    }),
  };
};
