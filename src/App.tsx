import React, {
  MouseEvent,
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  createRef,
} from 'react';
import { Column } from 'src/components/Column';
import { ColumnType, createColumn } from 'src/components/Column/create';
import { Header } from 'src/components/Header';
import { UserPanel } from 'src/components/Panel';
import { createUserPanel, UserPanelType } from 'src/components/Panel/create';

function App() {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [userPanels, setUserPanels] = useState<UserPanelType[]>([]);
  const columnRefs: MutableRefObject<{ [key: string]: HTMLDivElement }> =
    useRef(
      columns.reduce((acc, cur) => ({ ...acc, [cur.id]: createRef() }), {})
    );
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;

  const addColumn = () => {
    if (canAddColumn) {
      const newColumn = createColumn();
      setColumns([...columns, newColumn]);
    }
  };
  const removeColumn = (event: MouseEvent, columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
    removeUserPanelByColumnId(columnId);
  };
  const removeUserPanelByColumnId = (columnId: string) => {
    setUserPanels(
      userPanels.filter((userPanel) => userPanel.columnId !== columnId)
    );
  };
  const toggleUserPanel = (event: MouseEvent, columnId: string) => {
    console.warn('toggleUserPanel', columnId);
    const hasUserPanel = userPanels.some(
      (panel) => panel.columnId === columnId
    );

    if (hasUserPanel) {
      removeUserPanelByColumnId(columnId);
    } else {
      const wantedColumn = columns.find((col) => col.id === columnId);
      if (wantedColumn) {
        setUserPanels([...userPanels, createUserPanel(wantedColumn)]);
      }
    }
  };

  // add one column at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  // useEffect({

  // }, [columns]);

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
            onRemove={(e) => removeColumn(e, id)}
            onTogglePanel={(e) => toggleUserPanel(e, id)}
          ></Column>
        ))}
      </div>

      {/* Floating panels */}
      {userPanels.map(({ id, columnId, controlGroups }, index) => (
        <UserPanel
          key={id}
          id={id}
          columnId={columnId}
          column={columns.find((col) => col.id === columnId)}
          columnElement={columnRefs.current[columnId]}
          controlGroups={controlGroups}
        />
      ))}
    </div>
  );
}

export default App;
