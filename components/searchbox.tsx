import { KeyboardEventHandler, useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import cx from "classnames";
import styles from "./searchbox.module.scss";

export default function Searchbox({
  initialText = "",
  onChange,
  placeholder = "",
  isLoading = false,
}: {
  initialText?: string;
  onChange: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
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
    <div className={styles.component}>
      <Form.Control
        className={styles.searchbox}
        as="input"
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        value={searchText}
      />
      <Spinner
        className={cx(styles.searchSpinner, {
          [styles.searchSpinnerVisible]: isLoading,
        })}
        animation="grow"
      />
    </div>
  );
}
