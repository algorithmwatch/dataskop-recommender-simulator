import React, { useEffect, useRef, MutableRefObject, createRef } from 'react';
import { Column } from 'src/components/Column';
import { Header } from 'src/components/Header';
import { OnCategoryChangeCallback, UserPanel } from 'src/components/Panel';
import { useColumnStore, useUserPanelStore } from 'src/stores';

function App() {
  const columns = useColumnStore((state) => state.columns);
  const columnItems = useColumnStore((state) => state.items);
  const addColumn = useColumnStore((state) => state.add);
  const removeColumn = useColumnStore((state) => state.remove);
  const userPanels = useUserPanelStore((state) => state.panels);
  const addUserPanel = useUserPanelStore((state) => state.add);
  const removeUserPanelByColumnId = useUserPanelStore(
    (state) => state.removeByColumnId
  );
  const onCategoryChange = ({
    label,
    value,
    controlElement,
  }: OnCategoryChangeCallback) => {
    console.warn('categoryChange', value);
  };
  const columnRefs: MutableRefObject<{ [key: string]: HTMLDivElement }> =
    useRef(
      columns.reduce((acc, cur) => ({ ...acc, [cur.id]: createRef() }), {})
    );
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;

  // add one column at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  return (
    <div>
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>
      {/* Columns */}
      <div className="stripes flex justify-evenly mt-28">
        {columns.map(({ id, name }, index) => (
          <Column
            key={id}
            ref={(el: HTMLDivElement) => (columnRefs.current[id] = el)}
            id={id}
            name={name}
            items={columnItems[id]}
            onRemove={() => removeColumn(id)}
            hasPanel={userPanels.some((panel) => panel.columnId === id)}
            onShowPanel={() => addUserPanel(id)}
            onHidePanel={() => removeUserPanelByColumnId(id)}
          ></Column>
        ))}
      </div>

      {/* Floating panels */}
      {userPanels.map(({ id, columnId, controlGroups }, index) => {
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
              onCategoryChange={onCategoryChange}
            />
          )
        );
      })}
    </div>
  );
}

export default App;
