import { KeyboardEventHandler, useState } from "react";
import Form from "react-bootstrap/Form";

export default function Searchbox({
  initialText = "",
  onChange,
  placeholder = "",
}: {
  initialText?: string;
  onChange: (text: string) => void;
  placeholder?: string;
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
    <Form.Control
      as="input"
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      value={searchText}
    />
  );
}
