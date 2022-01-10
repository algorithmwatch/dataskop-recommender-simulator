import { ControlElement, useUserPanelStore } from "src/stores";
import { Panel } from "src/components/Panel/Panel";
import { Slider } from "src/components/Slider/Slider";
import { Column as ColumnType, UserPanel as UserPanelType } from "src/stores";
import { ageTypes } from "src/stores/model";
import Switch from "react-switch";
import { useState } from "react";
import classNames from "classnames";

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
  column,
  columnElement,
  controlGroups,
  onChange,
}: UserPanelProps) {
  const columnRect = columnElement.getBoundingClientRect();
  const x = columnRect.x + columnRect.width / 2;
  const y = window.innerHeight / 2;
  const setControlValue = useUserPanelStore((state) => state.setControlValue);
  const [age, setAge] = useState<string>("month");

  return (
    <Panel x={x} y={y}>
      {/* User name */}
      <div className="font-bold text-xl mb-2.5">{column?.name}</div>

      {/* Control groups */}
      <div className="space-y-4">
        {/* Categories */}
        <div>
          <div className="font-bold mb-2">{controlGroups.categories.label}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {controlGroups.categories.controls.map(
              (controlElement: ControlElement) => (
                <Slider
                  key={controlElement.label}
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
          <div className="font-bold mb-2">{controlGroups.age.label}</div>
          <div className="text-sm space-x-3">
            {controlGroups.age.controls.map(({ key, label, value }) => (
              <AgeButton
                key={key}
                label={label}
                isSelected={value === true}
                setAge={() => {
                  // first, set other values to false
                  controlGroups.age.controls.forEach(({ label }) => {
                    setControlValue(column.id, "age", label, false);
                  });
                  // change single value
                  setControlValue(column.id, "age", label, !value);
                  onChange();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
