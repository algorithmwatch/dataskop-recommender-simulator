import React, {
  useEffect,
  useRef,
  MutableRefObject,
  createRef,
  useState,
} from "react";
import { Column } from "src/components/Column";
import { Header } from "src/components/Header";
import { UserPanel } from "src/components/UserPanel";
import {
  ColumnItem,
  ColumnItemExported,
  ControlElement,
  useColumnStore,
  useUserPanelStore,
} from "src/stores";
import {
  orderByDistance,
  CategorySelection,
  categories,
} from "src/stores/model";
import { usePlatformPanelStore } from "src/stores/platformPanel";
import Switch from "react-switch";
import "tippy.js/dist/tippy.css";
import { random, uniqueId } from "lodash";
import { Slider } from "./components/Slider/Slider";
import itemList from "./items-list.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-regular-svg-icons";
import dataskopLogo from "src/assets/dataskop-logo.svg";

type Mode = "static" | "procedural";
const staticItemsList = itemList as ColumnItemExported[];
const showExportButtons = /[?&]export/.test(window.location.search);

function App() {
  const columns = useColumnStore((state) => state.columns);
  const columnItems = useColumnStore((state) => state.items);
  const setColumnItems = useColumnStore((state) => state.setItems);
  const addColumnFn = useColumnStore((state) => state.add);
  const addUserPanel = useUserPanelStore((state) => state.add);
  const bringToFront = useUserPanelStore((state) => state.bringToFront);
  const userPanels = useUserPanelStore((state) => state.panels);
  const [mode] = useState<Mode>(
    (localStorage.getItem("mode") as Mode | null) || "static"
  );
  const addColumn = () => {
    const columnId = uniqueId("column");
    const categorySelection = categories.map(
      ({ label }): CategorySelection => ({
        type: "category",
        label,
        value: random(0, 7),
        minValue: 0,
        maxValue: 10,
      })
    );
    addColumnFn(
      columnId,
      mode === "static" ? staticItemsList : undefined,
      categorySelection
    );
    setTimeout(() => {
      const panelId = uniqueId("panel");
      addUserPanel(panelId, columnId, categorySelection);
      bringToFront(panelId);
    }, 0);
  };
  const switchMode = (value: typeof mode) => {
    localStorage.setItem("mode", value);
    window.location.reload();
  };
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
      onUserPanelControlChange(id, monetarisation, hasPublicSource);
    });
  };
  const onUserPanelControlChange = (
    columnId: string,
    monetarisation: number,
    hasPublicSource: boolean
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

      {/* Horizontal platform panel */}
      {platformIsVisible && (
        <div
          className="sticky top-0 inset-x-0 flex justify-center items-center border-t-4 border-b-4 border-black h-32 px-6 bg-white space-x-6"
          style={{ zIndex: 9000 }}
        >
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

      {/* Floating user panels */}
      <div
        className="fixed -inset-0 pointer-events-none"
        style={{ zIndex: 9000 }}
      >
        {userPanels.map(
          ({ id, columnId, isVisible, zIndex, controlGroups }) => {
            if (!isVisible) {
              return null;
            }

            const column = columns.find((col) => col.id === columnId);

            return (
              column && (
                <UserPanel
                  key={id}
                  id={id}
                  zIndex={zIndex}
                  columnId={columnId}
                  column={column}
                  columnElement={columnRefs.current[columnId]}
                  controlGroups={controlGroups}
                  onChange={() => {
                    setTimeout(() => {
                      onUserPanelControlChange(
                        columnId,
                        monetarisation,
                        hasPublicSource
                      );
                    }, 0);
                  }}
                />
              )
            );
          }
        )}
      </div>

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
            showExportButton={showExportButtons}
          ></Column>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-center py-6 px-6">
        <div className="flex items-center justify-center py-6 px-6 space-x-2 text-xs text-gray-500">
          <div>Modus:</div>
          <div className="flex space-x-2">
            <button
              type="button"
              className={
                mode === "static"
                  ? "text-gray-400 cursor-auto"
                  : "hover:underline"
              }
              disabled={mode === "static"}
              onClick={() => switchMode("static")}
              title="Verwende in jeder Spalte ein und dieselbe Liste"
            >
              Statisch
              {mode === "static" && (
                <FontAwesomeIcon className="ml-0.5" icon={faCheck} />
              )}
            </button>
            <div>/</div>
            <button
              type="button"
              className={
                mode === "procedural"
                  ? "text-gray-400 cursor-auto"
                  : "hover:underline"
              }
              disabled={mode === "procedural"}
              onClick={() => switchMode("procedural")}
              title="Verwende in jeder Spalte zufällig generierte Listen"
            >
              Prozedural
              {mode === "procedural" && (
                <FontAwesomeIcon className="ml-0.5" icon={faCheck} />
              )}
            </button>
          </div>
        </div>

        <a href="https://dataskop.net" rel="nofollow noopener" target="blank">
          <img src={dataskopLogo} alt="" className="h-8" />
        </a>
      </div>
    </div>
  );
}

export default App;
