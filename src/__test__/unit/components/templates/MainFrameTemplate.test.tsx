import React from "react";
import { render, screen } from "@testing-library/react";
import MainFrameTemplate from "../../../../components/templates/MainFrameTemplate/MainFrameTemplate";

describe("MainFrameTemplate", () => {
  test("renders its children within a Container component", () => {
    render(
      <MainFrameTemplate>
        <div>Test Content</div>
      </MainFrameTemplate>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByTestId("main")).toHaveClass("mainTemplateWrapper");
  });
});
