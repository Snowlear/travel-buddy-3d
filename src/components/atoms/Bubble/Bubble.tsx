import React from "react";
import styles from "./Bubble.module.css";
import classnames from "classnames";

interface BubbleProps {
  children: React.ReactNode;
  direction?: "up" | "right";
  isRelative?: boolean;
  className?: string;
}

const Bubble: React.FC<BubbleProps> = ({
  children,
  direction = "up",
  isRelative = false,
  className,
}) => {
  return (
    <div
      tabIndex={0}
      className={classnames(
        { [styles.relativeView]: isRelative },
        styles.bubble,
        styles[direction],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Bubble;
