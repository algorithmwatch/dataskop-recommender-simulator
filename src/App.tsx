import React, {
  MouseEvent,
  useEffect,
  useRef,
  MutableRefObject,
  createRef,
} from 'react';
import { Column } from 'src/components/Column';
import { Header } from 'src/components/Header';
import { UserPanel } from 'src/components/Panel';
import { useColumnStore, useUserPanelStore } from 'src/stores';

function App() {
  const columns = useColumnStore((state) => state.columns);
  const addColumn = useColumnStore((state) => state.add);
  const removeColumn = useColumnStore((state) => state.remove);
  const userPanels = useUserPanelStore((state) => state.panels);
  const addUserPanel = useUserPanelStore((state) => state.add);
  const removeUserPanelByColumnId = useUserPanelStore(
    (state) => state.removeByColumnId
  );
  const columnRefs: MutableRefObject<{ [key: string]: HTMLDivElement }> =
    useRef(
      columns.reduce((acc, cur) => ({ ...acc, [cur.id]: createRef() }), {})
    );
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;
  const toggleUserPanel = (event: MouseEvent, columnId: string) => {
    console.warn('toggleUserPanel', columnId);
    const hasUserPanel = userPanels.some(
      (panel) => panel.columnId === columnId
    );

    if (hasUserPanel) {
      removeUserPanelByColumnId(columnId);
    } else {
      // add userPanel
      addUserPanel(columnId);
    }
  };

  // add one column at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  return (
    <div>
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>
      {/* Columns */}
      <div className="stripes flex justify-evenly mt-28">
        {columns.map(({ id, name, items }, index) => (
          <Column
            key={id}
            ref={(el: HTMLDivElement) => (columnRefs.current[id] = el)}
            id={id}
            name={name}
            items={items}
            onRemove={(e) => removeColumn(id)}
            onTogglePanel={(e) => toggleUserPanel(e, id)}
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
            />
          )
        );
      })}
    </div>
  );
}

export default App;
