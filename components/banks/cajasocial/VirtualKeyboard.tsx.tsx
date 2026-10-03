import React from "react";
import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  onClose?: () => void;
}

const VirtualKeyboard: React.FC<Props> = ({ value, onChange, maxLength = 8, onClose }) => {
  const [uppercase, setUppercase] = React.useState(false);
  const [layout, setLayout] = React.useState<"alpha" | "numeric">("alpha");
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Cerrar teclado si se toca fuera (en móvil)
  useEffect(() => {
    const handleClickOutside = (event: TouchEvent | MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  const alphaRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];
  const numericRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const handleKeyClick = (key: string) => {
    if (value.length >= maxLength) return;
    onChange(value + key);
  };

  const handleDelete = () => onChange(value.slice(0, -1));
  const handleClear = () => onChange("");
  const toggleShift = () => setUppercase(!uppercase);
  const toggleLayout = () => setLayout(layout === "alpha" ? "numeric" : "alpha");

  // Botones más grandes para móvil
  const btnClass = "bg-gray-200 active:bg-gray-300 touch-manipulation w-12 h-12 md:w-10 md:h-10 rounded-md text-lg font-semibold";
  const specialBtnClass = "text-white w-14 h-12 md:w-12 md:h-10 rounded-md";

  if (layout === "numeric") {
    return (
      <div ref={keyboardRef} className="bg-gray-100 p-4 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-2 justify-center">
          {numericRow.map(key => (
            <button
              key={key}
              type="button"
              onTouchStart={(e) => { e.preventDefault(); handleKeyClick(key); }}
              onClick={() => handleKeyClick(key)}
              className={btnClass}
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onTouchStart={toggleLayout}
            onClick={toggleLayout}
            className={`${specialBtnClass} bg-blue-600`}
          >
            ABC
          </button>
        </div>
      </div>
    );
  }

  const rows = alphaRows.map(row =>
    row.map(char => (uppercase ? char.toUpperCase() : char))
  );

  return (
    <div ref={keyboardRef} className="bg-gray-100 p-4 rounded-lg shadow-lg space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 md:gap-2 flex-wrap">
          {row.map(char => (
            <button
              key={char}
              type="button"
              onTouchStart={(e) => { e.preventDefault(); handleKeyClick(char); }}
              onClick={() => handleKeyClick(char)}
              className={btnClass}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2 mt-2 flex-wrap">
        <button
          type="button"
          onTouchStart={toggleShift}
          onClick={toggleShift}
          className={`${specialBtnClass} bg-gray-500`}
        >
          Shift
        </button>
        <button
          type="button"
          onTouchStart={toggleLayout}
          onClick={toggleLayout}
          className={`${specialBtnClass} bg-blue-600`}
        >
          123
        </button>
        <button
          type="button"
          onTouchStart={handleDelete}
          onClick={handleDelete}
          className={`${specialBtnClass} bg-red-600`}
        >
          ⌫
        </button>
        <button
          type="button"
          onTouchStart={handleClear}
          onClick={handleClear}
          className={`${specialBtnClass} bg-gray-700`}
        >
          C
        </button>
        <button
          type="button"
          onTouchStart={onClose}
          onClick={onClose}
          className={`${specialBtnClass} bg-gray-400`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;