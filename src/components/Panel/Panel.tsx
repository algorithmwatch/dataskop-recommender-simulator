import { ReactNode } from "react";
import { Rnd } from "react-rnd";

export function Panel({
  x,
  y,
  zIndex,
  onMouseDown,
  children,
}: {
  x: number;
  y: number;
  zIndex?: number;
  onMouseDown?: () => void;
  children: ReactNode;
}) {
  return (
    <Rnd
      onMouseDown={onMouseDown}
      className="p-5 bg-white bg-opacity-95 shadow-hard border-2 border-gray-900"
      // dragHandleClassName="drag-handle"
      enableResizing={false}
      bounds="window"
      style={{ zIndex: zIndex ? zIndex : 9999 }}
      default={{
        x,
        y,
        width: 380,
        height: "auto",
      }}
    >
      {/* <button
        type="button"
        className="drag-handle z-50 absolute right-3 top-3 cursor-move"
      >
        <FontAwesomeIcon
          icon={faGripHorizontal}
          className="pointer-events-none select-none"
          size="lg"
        />
      </button> */}
      <div className="relative w-full h-full">{children}</div>
    </Rnd>
  );
}
