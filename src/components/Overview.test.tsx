import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Overwiew from "./Overview";
import { MemoryRouter } from "react-router-dom";
import { StateProvider } from "../state";

test("renders Overview component", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/"]}>
      <Overwiew />
    </MemoryRouter>
  );
  const textElement = getByText(/Overview/i);
  expect(textElement).toBeInTheDocument();
});

test("adds new dictionary", () => {
  const value = "New Dictionary";
  const { getByText, getByTestId } = render(
    <StateProvider initialState={{ dictionaries: [], structures: {} }}>
      <MemoryRouter initialEntries={["/"]}>
        <Overwiew />
      </MemoryRouter>
    </StateProvider>
  );
  const inputElement = getByTestId("newValue");
  fireEvent.change(inputElement, { target: { value } });

  const addButtonElement = getByTestId("add");
  addButtonElement.click();
  const textElement = getByText(value);

  expect(textElement).toBeInTheDocument();
  expect(window.localStorage.setItem.mock.calls.length).toBe(2);
});
