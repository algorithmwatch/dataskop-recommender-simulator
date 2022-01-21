import logo from "src/assets/logo.svg";
import { Button } from "src/components/Button";
import { usePlatformPanelStore } from "src/stores/platformPanel";

export function Header({
  addColumn,
  canAddColumn,
}: {
  addColumn: () => void;
  canAddColumn: boolean;
}) {
  const platformIsVisible = usePlatformPanelStore((state) => state.isVisible);
  const setPlatformIsVisible = usePlatformPanelStore(
    (state) => state.setIsVisible
  );
  return (
    <header className="flex justify-between h-24 px-6 bg-white">
      <img src={logo} className="w-48" alt="logo" />
      <div className="space-x-4 flex items-center">
        <Button onClick={addColumn} disabled={!canAddColumn}>
          + User
        </Button>
        <Button
          theme={platformIsVisible ? "outlineActive" : "outline"}
          onClick={() => setPlatformIsVisible(!platformIsVisible)}
        >
          Plattform steuern
        </Button>
      </div>
    </header>
  );
}
