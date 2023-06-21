import React from "react";
import styles from "./ArrowBubble.module.css";
import classnames from "classnames";

interface ArrowBubbleProps {
  children: React.ReactNode;
  disabled?: boolean;
  direction?: "right";
  isRelative?: boolean;
}

const ArrowBubble: React.FC<ArrowBubbleProps> = ({
  children,
  direction = "right",
  isRelative = true,
}) => {
  return (
    <div
      tabIndex={0}
      className={classnames(styles.arrowBubble, styles[direction], {
        [styles.relativeView]: isRelative,
      })}
    >
      {children}
    </div>
  );
};

export default ArrowBubble;
