import React, { MouseEvent, useEffect, useState } from 'react';
import { Column } from 'src/components/Column';
import { ColumnType, createColumn } from 'src/components/Column/create';
import { Header } from 'src/components/Header';
import { UserPanel } from 'src/components/Panel';
import { createUserPanel, UserPanelType } from 'src/components/Panel/create';

function App() {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [userPanels, setUserPanels] = useState<UserPanelType[]>([]);
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;

  const addColumn = () => {
    if (canAddColumn) {
      const newColumn = createColumn();
      setColumns([...columns, newColumn]);
      setUserPanels([...userPanels, createUserPanel(newColumn)]);
    }
  };
  const removeColumn = (event: MouseEvent, columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId));
    setUserPanels(
      userPanels.filter((userPanel) => userPanel.columnId !== columnId)
    );
  };
  const toggleColumnPanel = (event: MouseEvent, id: string) => {
    console.warn('toggleColumnPanel', id);
  };

  // add one column at start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  return (
    <div>
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>
      {/* Floating panels */}
      {userPanels.map(({ id, columnId, controlGroups }) => (
        <UserPanel
          key={id}
          id={id}
          columnId={columnId}
          column={columns.find((col) => col.id === columnId)}
          controlGroups={controlGroups}
        />
      ))}
      {/* Columns */}
      <div className="stripes flex justify-evenly mt-28">
        {columns.map(({ id, name, items }) => (
          <Column
            key={id}
            id={id}
            name={name}
            items={items}
            onRemove={(e) => removeColumn(e, id)}
            onTogglePanel={(e) => toggleColumnPanel(e, id)}
          ></Column>
        ))}
      </div>
    </div>
  );
}

export default App;
