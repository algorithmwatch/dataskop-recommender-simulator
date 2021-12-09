import { ReactNode } from 'react';
import { Rnd } from 'react-rnd';
import { faGripHorizontal } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactSlider from 'react-slider';
import {
  Column as ColumnType,
  ControlGroup,
  UserPanel as UserPanelType,
} from 'src/stores';

interface UserPanelProps extends UserPanelType {
  column: ColumnType;
  columnElement: HTMLDivElement;
  onCategoryChange: ({
    label,
    value,
    controlElement,
  }: {
    label: string;
    value: number;
    controlElement: ControlGroup['controls'];
  }) => void;
}

function Panel({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <Rnd
      className="z-50 p-5 bg-white bg-opacity-95 shadow-hard border-2 border-gray-900"
      dragHandleClassName="drag-handle"
      enableResizing={false}
      default={{
        x,
        y,
        width: 360,
        height: 'auto',
      }}
    >
      <button
        type="button"
        className="drag-handle z-50 absolute right-3 top-3 cursor-move"
      >
        <FontAwesomeIcon
          icon={faGripHorizontal}
          className="pointer-events-none select-none"
          size="lg"
        />
      </button>
      <div className="relative w-full h-full">{children}</div>
    </Rnd>
  );
}

function Slider({
  label,
  bgColor,
  minValue,
  maxValue,
  onChange,
}: ControlGroup['controls']) {
  // const elementId = kebabCase(label);
  return (
    <div>
      <div className="text-sm">{label}</div>
      <ReactSlider
        className="w-full h-5"
        thumbClassName={`w-5 h-5 ${bgColor} rounded-full text-white text-center text-sm cursor-pointer`}
        trackClassName={`top-2 h-1 ${bgColor} bg-opacity-50 cursor-pointer`}
        min={minValue}
        max={maxValue}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        onChange={onChange}
      />
    </div>
  );
}

export function UserPanel({
  id,
  column,
  columnElement,
  controlGroups,
  onCategoryChange,
}: UserPanelProps) {
  const columnRect = columnElement.getBoundingClientRect();
  const x = columnRect.x + columnRect.width / 2;
  const y = window.innerHeight / 2;

  return (
    <Panel x={x} y={y}>
      {/* User name */}
      <div className="font-bold text-xl mb-2.5">{column?.name}</div>

      {/* Control groups */}
      {controlGroups.map(({ label, controls }) => {
        const content = [
          <div key="head" className="font-bold mb-2">
            {label}
          </div>,
        ];

        const controlElements: ReactNode[] = [];

        controls.forEach((controlElement: ControlGroup['controls']) => {
          if (controlElement.type === 'slider') {
            controlElements.push(
              <Slider
                key={controlElement.label}
                onChange={(value: number) => {
                  onCategoryChange({ label, value, controlElement });
                }}
                {...controlElement}
              />
            );
          }
        });

        // wrap control elements
        content.push(
          <div
            key="control-elements"
            className="grid grid-cols-2 gap-x-4 gap-y-2"
          >
            {controlElements}
          </div>
        );

        return content;
      })}
    </Panel>
  );
}
