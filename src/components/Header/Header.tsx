import logo from 'src/assets/logo.svg';
import { Button } from 'src/components/Button';

export function Header({
  addColumn,
  canAddColumn,
}: {
  addColumn: () => void;
  canAddColumn: boolean;
}) {
  return (
    <header className="flex justify-between h-24 px-6 bg-white">
      <img src={logo} className="w-48" alt="logo" />
      <div className="space-x-4 flex items-center">
        <Button onClick={addColumn} disabled={!canAddColumn}>
          + User
        </Button>
        <Button>Plattform steuern</Button>
      </div>
    </header>
  );
}
