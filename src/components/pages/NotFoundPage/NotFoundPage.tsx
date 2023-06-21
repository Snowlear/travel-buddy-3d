import React from "react";
import styles from "./NotFoundPage.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.NotFoundPage}>
      <h3>404</h3>
      <p>The page you are looking does not exist.</p>
    </div>
  );
};

export default NotFoundPage;
