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
    <header className="flex justify-between">
      <img src={logo} className="w-48" alt="logo" />
      <div className="space-x-4">
        <Button onClick={addColumn} disabled={!canAddColumn}>
          + User
        </Button>
        <Button>Plattform steuern</Button>
      </div>
    </header>
  );
}
