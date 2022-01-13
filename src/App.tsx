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

function App() {
  const columns = useColumnStore((state) => state.columns);
  const columnItems = useColumnStore((state) => state.items);
  const setColumnItems = useColumnStore((state) => state.setItems);
  const addColumn = useColumnStore((state) => state.add);
  const userPanels = useUserPanelStore((state) => state.panels);
  const platformIsVisible = usePlatformPanelStore((state) => state.isVisible);
  const columnRefs: MutableRefObject<{ [key: string]: HTMLDivElement }> =
    useRef(
      columns.reduce((acc, cur) => ({ ...acc, [cur.id]: createRef() }), {})
    );
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;
  const onControlPanelChange = (columnId: string) => {
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
    const hasAdSelection = panel?.controlGroups.hasAd.controls[0];
    const newItems = orderByDistance(
      oldItems,
      categorySelection,
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
        <div className="flex justify-end items-center h-24 px-6 bg-gray-100 space-x-4">
          <div>
            <div className="font-bold mb-2">Verifizierte Quellen</div>
            <div className="text-sm space-x-3">
              <Switch
                offColor="#666"
                height={24}
                width={48}
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#16a34a"
                onChange={() => {
                  // setControlValue(
                  //   column.id,
                  //   "hasAd",
                  //   "advertisment",
                  //   !controlGroups.hasAd.controls[0].value
                  // );
                  // onChange();
                }}
                checked={false}
              />
            </div>
          </div>
          <div>
            <div className="font-bold mb-2">Werbung bevorzugen</div>
            <div className="text-sm space-x-3">
              <Switch
                offColor="#666"
                height={24}
                width={48}
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor="#16a34a"
                onChange={() => {
                  // setControlValue(
                  //   column.id,
                  //   "hasAd",
                  //   "advertisment",
                  //   !controlGroups.hasAd.controls[0].value
                  // );
                  // onChange();
                }}
                checked={false}
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
            hasPanel={userPanels.some((panel) => panel.columnId === id)}
          ></Column>
        ))}
      </div>

      {/* Floating panels */}
      {userPanels.map(({ id, columnId, controlGroups }) => {
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
              onChange={() => onControlPanelChange(columnId)}
            />
          )
        );
      })}
    </div>
  );
}

export default App;
