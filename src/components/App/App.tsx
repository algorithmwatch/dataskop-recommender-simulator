import React from 'react';
import Button from '../Button/Button';
import logo from './logo.svg';

function App() {
  return (
    <div className="m-4">
      <header className="">
        <img src={logo} className="w-48" alt="logo" />
        <Button>+ User</Button>
        <Button>Plattform steuern</Button>
      </header>
    </div>
  );
}

export default App;
