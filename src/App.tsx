import React, { useState } from 'react';
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

  return (
    <div className="m-4">
      <Header addColumn={addColumn} canAddColumn={canAddColumn}></Header>
      {columns.map(({ name, items }, index) => (
        <Column key={index + name} name={name} items={items}></Column>
      ))}
    </div>
  );
}

export default App;
