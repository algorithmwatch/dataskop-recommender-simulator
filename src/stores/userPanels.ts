import { uniqueId } from 'lodash';
import create from 'zustand';
import { categories } from 'src/stores/model';

export type ControlGroup = {
  label: string;
  controls: {
    [key: string]: any;
  };
};

export type UserPanel = {
  id: string;
  columnId: string;
  controlGroups: ControlGroup[];
};

type UserPanelsStore = {
  panels: UserPanel[];
  add: (columnId: string) => void;
  remove: (id: string) => void;
  removeByColumnId: (columnId: string) => void;
};

export const useUserPanelStore = create<UserPanelsStore>((set) => ({
  panels: [],

  add: (columnId) =>
    set((state) => {
      const newPanel = {
        id: uniqueId('panel'),
        columnId,
        controlGroups: [
          {
            label: 'Kategorien',
            controls: categories.map(({ label, bgColor }) => ({
              type: 'slider',
              label,
              bgColor,
              minValue: 0,
              maxValue: 10,
            })),
          },
        ],
      };

      return {
        panels: [...state.panels, newPanel],
      };
    }),

  remove: (id) =>
    set((state) => ({
      panels: state.panels.filter((panel) => panel.id !== id),
    })),

  removeByColumnId: (columnId) =>
    set((state) => ({
      panels: state.panels.filter((panel) => panel.columnId !== columnId),
    })),
}));
