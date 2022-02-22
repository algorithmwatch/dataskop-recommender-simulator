import logo from "src/assets/logo.svg";
import { Button } from "src/components/Button";
import { usePlatformPanelStore } from "src/stores/platformPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/pro-regular-svg-icons";

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
      <div className="flex items-center">
        <img src={logo} className="w-48" alt="logo" />
        <a
          href="https://dataskop.net/"
          rel="nofollow noopener"
          target="blank"
          className="mt-6 text-gray-400 hover:text-gray-600 text-base"
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="ml-1" />
        </a>
      </div>
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
