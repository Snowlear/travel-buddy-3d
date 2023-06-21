import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../../../components/atoms/Button/Button";

describe("Button", () => {
  test("renders its children", () => {
    render(<Button>Test Content</Button>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("calls the onClick function when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Test Content</Button>);
    fireEvent.click(screen.getByText("Test Content"));
    expect(onClick).toHaveBeenCalled();
  });

  test("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Test Content</Button>);
    expect(screen.getByText("Test Content")).toBeDisabled();
  });
});
