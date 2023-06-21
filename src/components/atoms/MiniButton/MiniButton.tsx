import React from "react";
import styles from "./MiniButton.module.css";
import classnames from "classnames";

interface MiniButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
}

const MiniButton: React.FC<MiniButtonProps> = ({
  className,
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={classnames(className, styles.miniButton)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default MiniButton;
