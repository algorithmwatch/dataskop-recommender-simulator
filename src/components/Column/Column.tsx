import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faTrashAlt,
  IconDefinition,
  faSlidersV,
} from '@fortawesome/pro-regular-svg-icons';
// import { faSlidersV } from '@fortawesome/pro-solid-svg-icons';
import { MouseEventHandler, ReactNode } from 'react';
import { createColumn } from 'src/components/Column/create';

function Badge({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`flex items-center text-sm font-medium h-5 px-1 ${className}`}
    >
      {children}
    </span>
  );
}

function HeaderButton({
  icon,
  onClick,
}: {
  icon: IconDefinition;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-gray-300 text-gray-900 text-xl rounded-full w-10 h-10 hover:bg-gray-900 hover:text-white"
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

interface ColumnProps extends ReturnType<typeof createColumn> {
  onRemove: MouseEventHandler;
  onTogglePanel: MouseEventHandler;
}

export function Column({ name, items, onRemove, onTogglePanel }: ColumnProps) {
  return (
    <div className="w-full max-w-sm mx-2 -mt-20">
      {/* head */}
      <div className="relative h-20 flex items-center justify-center">
        <h2 className="text-3xl font-bold">{name}</h2>
        <div className="flex items-center space-x-2 absolute right-0">
          <HeaderButton icon={faTrashAlt} onClick={onRemove} />
          <HeaderButton icon={faSlidersV} onClick={onTogglePanel} />
        </div>
      </div>
      {/* items */}
      {items.map(({ id, category, hasAd, age, source, fav }) => (
        <div
          key={id}
          className={`${category?.bgColor} flex items-center justify-between h-7 mb-0.5 px-1.5 text-white hover:bg-opacity-80`}
        >
          <div className="flex items-center">
            <div className="w-14">#{id}</div>
            <div className="w-9">
              {category && <FontAwesomeIcon icon={category.icon} />}
            </div>
            <div className="flex items-center">
              {age === 'today' && <Badge className="bg-blue-500">NEU</Badge>}
              {hasAd && <Badge className="bg-red-500">AD</Badge>}
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faHeart} />
            <span className="ml-0.5 text-sm">{fav}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
