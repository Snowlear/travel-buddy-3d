import React from "react";
import styles from "./Link.module.css";

interface LinkProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Link: React.FC<LinkProps> = ({ label, onClick }) => {
  return (
    <button className={styles.link} onClick={onClick}>
      {label}
    </button>
  );
};

export default Link;
