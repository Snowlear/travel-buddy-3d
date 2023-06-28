import React from "react";
import styles from "./Button.module.css";
import classnames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  className,
  onClick,
}) => {
  return (
    <button onClick={onClick} className={classnames(styles.button, className)} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
