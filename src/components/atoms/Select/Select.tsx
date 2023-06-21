import React, { ChangeEventHandler } from "react";
import styles from "./Select.module.css";
import classNames from "classnames";

interface SelectProps {
  className?: string;
  disabled?: boolean;
  value: string;
  onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  options: string[];
}

const Select: React.FC<SelectProps> = ({
  disabled = false,
  className,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={styles.selectContainer}>
      <select
        className={classNames(className, styles.select)}
        disabled={disabled}
        value={value}
        onChange={onChange}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
