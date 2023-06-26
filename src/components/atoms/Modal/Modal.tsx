import React from "react";
import styles from "./Modal.module.css";
import classnames from "classnames";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className
}) => {
  return (
    <div className={classnames(className,styles.modalWrapper)}>{children}</div>
  );
};

export default Modal;
