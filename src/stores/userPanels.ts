import { uniqueId } from "lodash";
import create from "zustand";
import { ageTypes, categories, defaultAge } from "src/stores/model";

export type ControlElement = {
  [key: string]: any;
};

export type ControlGroup = {
  label: string;
  controls: ControlElement[];
};

export type UserPanel = {
  id: string;
  columnId: string;
  controlGroups: {
    categories: ControlGroup;
    age: ControlGroup;
  };
};

type UserPanelsStore = {
  panels: UserPanel[];
  add: (columnId: string) => void;
  setControlValue: (
    columnId: string,
    groupSlug: "categories" | "age",
    controlLabel: string,
    value: number | boolean
  ) => void;
  remove: (id: string) => void;
  removeByColumnId: (columnId: string) => void;
};

export const useUserPanelStore = create<UserPanelsStore>((set) => ({
  panels: [],

  add: (columnId) =>
    set((state) => {
      const newPanel = {
        id: uniqueId("panel"),
        columnId,
        controlGroups: {
          categories: {
            label: "Kategorien",
            controls: categories.map(({ label, bgColor }) => ({
              type: "slider",
              bgColor,
              label,
              value: 0,
              minValue: 0,
              maxValue: 10,
            })),
          },
          age: {
            label: "Aktualität",
            controls: Object.keys(ageTypes).map((key) => ({
              key: key,
              label: ageTypes[key],
              value: key === defaultAge ? true : false,
            })),
          },
        },
      };

      return {
        panels: [...state.panels, newPanel],
      };
    }),

  setControlValue: (columnId, groupSlug, controlLabel, value) =>
    set((state) => ({
      panels: state.panels.map((panel) => {
        if (panel.columnId !== columnId) {
          return panel;
        }

        const nextPanel = { ...panel };
        const wantedControlElement = nextPanel.controlGroups[
          groupSlug
        ].controls.find((controlEl) => controlEl.label === controlLabel);
        if (!wantedControlElement) {
          return panel;
        }

        wantedControlElement.value = value;

        return nextPanel;
      }),
    })),

  remove: (id) =>
    set((state) => ({
      panels: state.panels.filter((panel) => panel.id !== id),
    })),

  removeByColumnId: (columnId) =>
    set((state) => ({
      panels: state.panels.filter((panel) => panel.columnId !== columnId),
    })),
}));
