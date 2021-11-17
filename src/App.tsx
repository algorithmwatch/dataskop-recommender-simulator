import React, { useState } from 'react';
import { createColumn } from 'src/components/Column/create';
import { Header } from 'src/components/Header';

function App() {
  const [columns, setColumns] = useState<ReturnType<typeof createColumn>[]>([]);

  const addColumn = () => {
    const column = createColumn();
    console.warn({ column });
    setColumns([...columns, column]);
  };

  return (
    <div className="m-4">
      <Header addColumn={addColumn}></Header>
    </div>
  );
}

export default App;
