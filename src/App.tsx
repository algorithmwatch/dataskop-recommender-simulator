import React, { MouseEvent, useEffect, useState } from 'react';
import { Column } from 'src/components/Column';
import { createColumn } from 'src/components/Column/create';
import { Header } from 'src/components/Header';

function App() {
  const [columns, setColumns] = useState<ReturnType<typeof createColumn>[]>([]);
  const maxColumns = 3;
  const canAddColumn = columns.length < maxColumns;

  const addColumn = () => {
    if (canAddColumn) {
      setColumns([...columns, createColumn()]);
    }
  };
  const removeColumn = (event: MouseEvent, index: number) => {
    setColumns(columns.filter((column, columnIndex) => columnIndex !== index));
  };
  const toggleColumnPanel = (event: MouseEvent, index: number) => {
    console.warn('toggleColumnPanel', index);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addColumn, []);

  // todo: add dragging panels
  // drag library: https://github.com/bokuweb/react-rnd

  return (
    <div>
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>
      <div className="flex justify-evenly m-6">
        {columns.map(({ name, items }, index) => (
          <Column
            key={index + name}
            name={name}
            items={items}
            onRemove={(e) => removeColumn(e, index)}
            onTogglePanel={(e) => toggleColumnPanel(e, index)}
          ></Column>
        ))}
      </div>
    </div>
  );
}

export default App;
