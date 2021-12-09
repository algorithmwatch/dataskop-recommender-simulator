import { sample, random, times, uniqueId } from 'lodash';
import firstNames from 'src/components/Column/first_names.json';
import { Category, ageTypes, categories } from 'src/stores/model';
import create from 'zustand';

export type ColumnItem = {
  id: number;
  category: Category;
  hasAd: boolean;
  hasPublicSource: boolean;
  age: string;
  fav: number;
};

export type Column = {
  id: string;
  name: string;
  items: ColumnItem[];
};

type ColumnsStore = {
  columns: Column[];
  add: () => void;
  remove: (id: string) => void;
};

export const useColumnStore = create<ColumnsStore>((set) => ({
  columns: [],

  add: () =>
    set((state) => {
      const createColumnItems = () => {
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

      const newColumn = {
        id: uniqueId('column'),
        name: sample(firstNames) as string,
        items: createColumnItems(),
      };

      return {
        columns: [...state.columns, newColumn],
      };
    }),

  remove: (id) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== id),
    })),
}));
