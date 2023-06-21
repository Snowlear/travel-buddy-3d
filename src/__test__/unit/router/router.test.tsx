import React from "react";
import { render, screen } from "@testing-library/react";
import AppRouter from "../../../router/router";

describe("AppRouter", () => {
  test("renders the SearchPage component for the root path", () => {
    window.history.pushState({}, "Search Page", "/");
    render(<AppRouter />);
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test("renders the ResultsPage component for the /results path", () => {
    window.history.pushState({}, "Results Page", "/results");
    render(<AppRouter />);
    expect(screen.getByText(/Your search is invalid./i)).toBeInTheDocument();
  });

  test("renders the NotFoundPage component for an unknown path", () => {
    window.history.pushState({}, "Not Found Page", "/unknown");
    render(<AppRouter />);
    expect(
      screen.getByText(/The page you are looking does not exist./i)
    ).toBeInTheDocument();
  });
});
