import { ReactNode } from "react";
import { Rnd } from "react-rnd";
import { faGripHorizontal } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Panel({
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
        width: 380,
        height: "auto",
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
