import firstNames from "src/components/Column/first_names.json";
import { sample, omit } from "lodash";
import { Category, createColumnItems } from "src/stores/model";
import create from "zustand";

export type ColumnItem = {
  id: number;
  category: Category;
  baseRank: number;
  hasAd: boolean;
  hasPublicSource: boolean;
  age: number;
  isVisible: boolean;
};

export type Column = {
  id: string;
  name: string;
};

type ColumnsStore = {
  columns: Column[];
  items: { [key: Column["id"]]: ColumnItem[] };
  add: (id: string) => void;
  remove: (id: string) => void;
  setItems: (id: string, items: ColumnItem[]) => void;
};

export const useColumnStore = create<ColumnsStore>((set) => ({
  columns: [],
  items: {},

  add: (id) =>
    set((state) => {
      const newColumn = {
        id,
        name: sample(firstNames) as string,
      };

      return {
        columns: [...state.columns, newColumn],
        items: { ...state.items, [newColumn.id]: createColumnItems() },
      };
    }),

  remove: (id) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== id),
      items: omit(state.items, [id]),
    })),

  setItems: (id, items) =>
    set((state) => ({
      items: { ...state.items, [id]: items },
    })),
}));
