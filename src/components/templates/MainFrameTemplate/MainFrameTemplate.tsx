import React from "react";
import styles from "./MainFrameTemplate.module.css";
import Container from "../../atoms/Container/Container";

interface MainFrameTemplateProps {
  children: React.ReactNode;
}

const MainFrameTemplate: React.FC<MainFrameTemplateProps> = ({ children }) => {
  return (
    <div data-testid="main" className={styles.mainTemplateWrapper}>
      <Container>{children}</Container>
    </div>
  );
};

export default MainFrameTemplate;
