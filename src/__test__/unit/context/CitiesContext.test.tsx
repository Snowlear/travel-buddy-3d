import React from "react";
import { render, screen } from "@testing-library/react";
import {
  CitiesProvider,
  useCitiesContext,
} from "../../../context/CitiesContext";

const TestComponent = () => {
  const context = useCitiesContext();
  return <div>{JSON.stringify(context)}</div>;
};

describe("CitiesContext", () => {
  test("provides access to the CitiesContext values", () => {
    render(
      <CitiesProvider>
        <TestComponent />
      </CitiesProvider>
    );
    const context = JSON.parse(screen.getByText('{"cities":[]}').textContent!);
    expect(context.cities).toEqual([]);
  });
});
