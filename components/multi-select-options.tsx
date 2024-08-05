import React, { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleSelect = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex flex-wrap items-center gap-1 border border-gray-300 p-2 rounded-md cursor-pointer"
        onClick={toggleSelect}
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((value) => (
            <span
              key={value}
              className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
            >
              {options.find((option) => option.value === value)?.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(value);
                }}
                className="ml-1 text-white"
              >
                &times;
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-500">Select options...</span>
        )}
        <span className="ml-auto text-gray-500">&darr;</span>
      </div>
      <div
        className={`absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul
          className={`overflow-auto transition-opacity duration-200 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedValues.includes(option.value)
                  ? "bg-blue-50 text-blue-500"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
