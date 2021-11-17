import React, { useState } from 'react';
import { Column } from 'src/components/Column';
import { createColumn } from 'src/components/Column/create';
import { Header } from 'src/components/Header';

function App() {
  const [columns, setColumns] = useState<ReturnType<typeof createColumn>[]>([]);
  const maxColumns = 3;
  const columnCount = columns.length;
  const addColumnIsDisabled = columnCount >= maxColumns;

  const addColumn = () => {
    if (!addColumnIsDisabled) {
      setColumns([...columns, createColumn()]);
    }
  };

  return (
    <div className="m-4">
      <Header
        addColumn={addColumn}
        addColumnIsDisabled={addColumnIsDisabled}
      ></Header>
      {columns.map(({ name, items }, index) => (
        <Column key={index + name} name={name} items={items}></Column>
      ))}
    </div>
  );
}

export default App;
