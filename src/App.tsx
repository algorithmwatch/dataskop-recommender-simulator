import React, { useEffect, useRef, MutableRefObject, createRef } from "react";
import { Column } from "src/components/Column";
import { Header } from "src/components/Header";
import { UserPanel } from "src/components/UserPanel";
import {
  ColumnItem,
  ControlElement,
  useColumnStore,
  useUserPanelStore,
} from "src/stores";
import { orderByDistance, CategorySelection } from "src/stores/model";
import { usePlatformPanelStore } from "src/stores/platformPanel";
import Switch from "react-switch";
import "tippy.js/dist/tippy.css";
import { uniqueId } from "lodash";
import { Slider } from "./components/Slider/Slider";

function App() {
  const columns = useColumnStore((state) => state.columns);
  const columnItems = useColumnStore((state) => state.items);
  const setColumnItems = useColumnStore((state) => state.setItems);
  const addColumnFn = useColumnStore((state) => state.add);
  const addUserPanel = useUserPanelStore((state) => state.add);
  const addColumn = () => {
    const columnId = uniqueId("column");
    addColumnFn(columnId);
    setTimeout(() => {
      addUserPanel(columnId);
    }, 0);
  };
  const userPanels = useUserPanelStore((state) => state.panels);
  const platformIsVisible = usePlatformPanelStore((state) => state.isVisible);
  const setMonetarsation = usePlatformPanelStore(
    (state) => state.setMonetarisation
  );
  const monetarisation = usePlatformPanelStore((state) => state.monetarisation);
  const setHasPublicSource = usePlatformPanelStore(
    (state) => state.setHasPublicSource
  );
  const hasPublicSource = usePlatformPanelStore(
    (state) => state.hasPublicSource
  );
  const columnRefs: MutableRefObject<{ [key: string]: HTMLDivElement }> =
    useRef(
      columns.reduce((acc, cur) => ({ ...acc, [cur.id]: createRef() }), {})
    );
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;
  const onPlatformControlChange = (
    monetarisation: number,
    hasPublicSource: boolean
  ) => {
    const columnIds = columns.map((c) => c.id);
    columnIds.forEach((id, index) => {
      onControlPanelChange(id, monetarisation, hasPublicSource);
      // setTimeout(() => {
      // }, index * 300);
    });
  };
  const onControlPanelChange = (
    columnId: string,
    monetarisation?: number,
    hasPublicSource?: boolean
  ) => {
    const panel = userPanels.find((panel) => panel.columnId === columnId);
    const allCategories = panel?.controlGroups.categories.controls.map(
      ({
        label,
        value,
        minValue,
        maxValue,
      }: ControlElement): CategorySelection => ({
        type: "category",
        label,
        value,
        minValue,
        maxValue,
      })
    );
    if (!allCategories) {
      return;
    }

    const ageSelection = panel?.controlGroups.age.controls.find(
      ({ value }) => value === true
    );
    const oldItems = columnItems[columnId];
    const categorySelection = allCategories;
    const moni = monetarisation;
    const hasAdSelection = panel?.controlGroups.hasAd.controls[0];
    const newItems = orderByDistance(
      oldItems,
      categorySelection,
      moni,
      hasPublicSource,
      ageSelection?.key,
      hasAdSelection?.value
    );

    setColumnItems(columnId, newItems as ColumnItem[]);
  };

  // add one column at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  useEffect(() => {
    console.count("rendered");
  });

  return (
    <div>
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>

      {platformIsVisible && (
        <div className="relative flex justify-center items-center border-t-4 border-b-4 border-black h-32 px-6 bg-white space-x-6">
          <svg
            className="absolute right-24 -top-5"
            width="40"
            height="20"
            viewBox="0 0 40 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 0L39.0526 19.5H0.947441L20 0Z" fill="black" />
          </svg>

          <div>
            <div className="font-bold mb-2">Monetarisierung</div>
            <div className="h-8">
              <Slider
                label="test"
                hiddenLabel
                value={monetarisation}
                bgColor="bg-black"
                minValue={0}
                maxValue={10}
                onChange={(value: number) => {
                  setMonetarsation(value);
                  onPlatformControlChange(value, hasPublicSource);
                }}
              />
            </div>
          </div>
          <div>
            <div className="font-bold mb-2">Verifizierte Quellen</div>
            <div className="h-8">
              <Switch
                offColor="#666"
                height={24}
                width={48}
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#16a34a"
                onChange={() => {
                  setHasPublicSource(!hasPublicSource);
                  onPlatformControlChange(monetarisation, !hasPublicSource);
                }}
                checked={hasPublicSource}
              />
            </div>
          </div>
        </div>
      )}

      {/* Columns */}
      <div className="stripes flex justify-evenly mt-28">
        {columns.map(({ id, name }, index) => (
          <Column
            key={id}
            ref={(el: HTMLDivElement) => (columnRefs.current[id] = el)}
            id={id}
            name={name}
            items={columnItems[id]}
            hasPanel={userPanels.some(
              (panel) => panel.columnId === id && panel.isVisible
            )}
          ></Column>
        ))}
      </div>

      {/* Floating panels */}
      {userPanels.map(({ id, columnId, isVisible, controlGroups }) => {
        if (!isVisible) {
          return null;
        }

        const column = columns.find((col) => col.id === columnId);

        return (
          column && (
            <UserPanel
              key={id}
              id={id}
              columnId={columnId}
              column={column}
              columnElement={columnRefs.current[columnId]}
              controlGroups={controlGroups}
              onChange={() => {
                setTimeout(() => {
                  onControlPanelChange(columnId, monetarisation);
                }, 0);
              }}
            />
          )
        );
      })}
    </div>
  );
}

export default App;
