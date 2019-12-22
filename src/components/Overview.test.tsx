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
  expect(localStorage.setItem.mock.calls.length).toBe(2);
});

test("removes dictionary", async () => {
  const dictionaryName = "New Dictionary";
  const { getByText, queryByText, getByTestId } = render(
    <StateProvider
      initialState={{
        dictionaries: [{ id: "1", name: dictionaryName }],
        structures: { "1": [] }
      }}
    >
      <MemoryRouter initialEntries={["/"]}>
        <Overwiew />
      </MemoryRouter>
    </StateProvider>
  );

  const dictionaryElement = getByText(dictionaryName);
  expect(dictionaryElement).toBeInTheDocument();

  const deleteButtonElement = getByTestId("delete-1");
  deleteButtonElement.click();

  const dictionaryRemovedElement = queryByText(dictionaryName);

  expect(dictionaryRemovedElement).toBeNull();
});
