import create from "zustand";

export type PlatformControlElement = {
  [key: string]: any;
};

export type PlatformControlGroup = {
  label: string;
  controls: PlatformControlElement[];
};

export type PlatformPanel = {
  id: string;
  columnId: string;
  controlGroups: {
    categories: PlatformControlGroup;
    age: PlatformControlGroup;
    hasAd: PlatformControlGroup;
  };
};

type PlatformPanelStore = {
  isVisible: boolean;
  monetarisation: number;
  hasPublicSource: boolean;
  setHasPublicSource: (value: boolean) => void;
  setMonetarisation: (value: number) => void;
  setIsVisible: (value: boolean) => void;
  // setControlValue: (
  //   columnId: string,
  //   groupSlug: "categories" | "age" | "hasAd",
  //   controlkey: string,
  //   value: number | boolean
  // ) => void;
  // remove: (id: string) => void;
};

export const usePlatformPanelStore = create<PlatformPanelStore>((set) => ({
  isVisible: false,
  monetarisation: 0,
  hasPublicSource: false,

  setHasPublicSource: (value: boolean) =>
    set((state) => ({ hasPublicSource: value })),

  setMonetarisation: (value: number) =>
    set((state) => ({ monetarisation: value })),

  setIsVisible: (value) => set((state) => ({ isVisible: value })),
  // panel: {}

  // setControlValue: (columnId, groupSlug, controlkey, value) =>
  //   set((state) => ({
  //     panels: state.panels.map((panel) => {
  //       if (panel.columnId !== columnId) {
  //         return panel;
  //       }

  //       const nextPanel = { ...panel };
  //       const wantedControlElement = nextPanel.controlGroups[
  //         groupSlug
  //       ].controls.find((controlEl) => controlEl.key === controlkey);
  //       if (!wantedControlElement) {
  //         return panel;
  //       }

  //       wantedControlElement.value = value;

  //       return nextPanel;
  //     }),
  //   })),
}));
