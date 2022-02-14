import { ControlElement, useUserPanelStore } from "src/stores";
import { Panel } from "src/components/Panel/Panel";
import { Slider } from "src/components/Slider/Slider";
import { Column as ColumnType, UserPanel as UserPanelType } from "src/stores";
import Switch from "react-switch";
import classNames from "classnames";

// Uncomment the next lines to add Tooltips
// import Tippy from "@tippyjs/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faQuestionCircle } from "@fortawesome/pro-regular-svg-icons";

export interface UserPanelProps extends UserPanelType {
  column: ColumnType;
  columnElement: HTMLDivElement;
  onChange: () => void;
}

function AgeButton({
  label,
  isSelected,
  setAge,
}: {
  label: string;
  isSelected: boolean;
  setAge: () => void;
}) {
  return (
    <button
      className={classNames({ underline: isSelected })}
      onClick={() => setAge()}
    >
      {label}
    </button>
  );
}

export function UserPanel({
  id,
  zIndex,
  column,
  columnElement,
  controlGroups,
  onChange,
}: UserPanelProps) {
  const columnRect = columnElement.getBoundingClientRect();
  const x = columnRect.x + columnRect.width / 2 - 380 / 2 + 50;
  const y = window.innerHeight / 2;
  const setControlValue = useUserPanelStore((state) => state.setControlValue);
  const bringToFront = useUserPanelStore((state) => state.bringToFront);

  return (
    <Panel x={x} y={y} zIndex={zIndex} onMouseDown={() => bringToFront(id)}>
      {/* User name */}
      <div className="font-bold text-xl mb-2.5">{column?.name}</div>

      {/* Control groups */}
      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div className="font-bold mb-2">
            <span>{controlGroups.categories.label}</span>

            {/* Uncomment the next lines to add Tooltip for "Kategorien" */}
            {/* <Tippy content="Hier stehen weitere Infos">
              <span className="cursor-help">
                <FontAwesomeIcon icon={faQuestionCircle} className="ml-1" />
              </span>
            </Tippy> */}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {controlGroups.categories.controls.map(
              (controlElement: ControlElement) => (
                <Slider
                  key={controlElement.label}
                  value={controlElement.value}
                  onChange={(value: number) => {
                    setControlValue(
                      column.id,
                      "categories",
                      controlElement.label,
                      value
                    );
                    onChange();
                  }}
                  {...controlElement}
                />
              )
            )}
          </div>
        </div>

        {/* Age */}
        <div>
          <div className="font-bold mb-2">
            <span>{controlGroups.age.label}</span>

            {/* Uncomment the next lines to add Tooltip for "Aktualität" */}
            {/* <Tippy content="Hier stehen weitere Infos">
              <span className="cursor-help">
                <FontAwesomeIcon icon={faQuestionCircle} className="ml-1" />
              </span>
            </Tippy> */}
          </div>
          <div className="text-sm space-x-3">
            {controlGroups.age.controls.map(({ key, label, value }) => (
              <AgeButton
                key={key}
                label={label}
                isSelected={value === true}
                setAge={() => {
                  if (value === true) {
                    return;
                  }

                  // first, set other values to false
                  controlGroups.age.controls.forEach(({ key: _key }) => {
                    setControlValue(column.id, "age", _key, false);
                  });
                  // change single value
                  setControlValue(column.id, "age", key, !value);
                  onChange();
                }}
              />
            ))}
          </div>
        </div>

        {/* Ads */}
        <div>
          <div className="font-bold mb-2">
            <span>{controlGroups.hasAd.label}</span>

            {/* Uncomment the next lines to add Tooltip for "Werbung vermeiden" */}
            {/* <Tippy content="Hier stehen weitere Infos">
              <span className="cursor-help">
                <FontAwesomeIcon icon={faQuestionCircle} className="ml-1" />
              </span>
            </Tippy> */}
          </div>
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
                setControlValue(
                  column.id,
                  "hasAd",
                  "advertisment",
                  !controlGroups.hasAd.controls[0].value
                );
                onChange();
              }}
              checked={controlGroups.hasAd.controls[0].value === true}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
