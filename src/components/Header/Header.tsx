import logo from 'src/assets/logo.svg';
import { Button } from 'src/components/Button';

export function Header({ addColumn }: { addColumn: () => void }) {
  return (
    <header className="flex justify-between">
      <img src={logo} className="w-48" alt="logo" />
      <div className="space-x-4">
        <Button onClick={addColumn}>+ User</Button>
        <Button>Plattform steuern</Button>
      </div>
    </header>
  );
}
