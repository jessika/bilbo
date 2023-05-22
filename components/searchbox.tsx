import { KeyboardEventHandler, useState } from "react";

export default function Searchbox({
  initialText = "",
  onChange,
}: {
  initialText?: string;
  onChange: (text: string) => void;
}) {
  const [searchText, setSearchText] = useState(initialText);
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      const normalizedSearchText = searchText.trim();
      if (normalizedSearchText) {
        onChange(normalizedSearchText);
      }
    }
  };

  return (
    <input
      value={searchText}
      onKeyDown={onKeyDown}
      onChange={(e) => {
        setSearchText(e.target.value);
      }}
    />
  );
}
