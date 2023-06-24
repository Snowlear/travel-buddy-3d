import React from "react";
import styles from "./NotFoundPage.module.css";
import MainFrameTemplate from "../../templates/MainFrameTemplate/MainFrameTemplate";

const NotFoundPage: React.FC = () => {
  return (
    <MainFrameTemplate>
    <div className={styles.NotFoundPage}>
      <h3>404</h3>
      <p>The page you are looking does not exist.</p>
    </div>
    </MainFrameTemplate>
  );
};

export default NotFoundPage;
