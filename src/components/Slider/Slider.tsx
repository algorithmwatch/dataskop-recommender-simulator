import ReactSlider from "react-slider";
import { ControlElement } from "src/stores";

export function Slider({
  label,
  value,
  bgColor,
  minValue,
  maxValue,
  onChange,
}: ControlElement) {
  // const elementId = kebabCase(label);
  return (
    <div>
      <div className="text-sm">{label}</div>
      <ReactSlider
        value={value}
        className="w-full h-5"
        thumbClassName={`w-5 h-5 ${bgColor} rounded-full text-white text-center text-sm cursor-pointer`}
        trackClassName={`top-2 h-1 ${bgColor} bg-opacity-50 cursor-pointer`}
        min={minValue}
        max={maxValue}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        onChange={onChange}
      />
    </div>
  );
}
