import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Dictionary from "./Dictionary";
import { MemoryRouter, Route } from "react-router-dom";
import { StateProvider } from "../state";

const DICTIONARY_ID = "dictionaryId";
const PAIR_ID = "pairId";
function renderDictionary() {
  const initialState = {
    dictionaries: [{ id: DICTIONARY_ID, name: "Dictionary" }],
    structures: {
      [DICTIONARY_ID]: [
        { id: PAIR_ID, key: "key", value: "value", warnings: [] }
      ]
    }
  };
  return render(
    <StateProvider initialState={initialState}>
      <MemoryRouter initialEntries={[`/${DICTIONARY_ID}`]}>
        <Route path="/:dictionaryId">
          <Dictionary />
        </Route>
      </MemoryRouter>
    </StateProvider>
  );
}

afterEach(() => {
  localStorage.setItem.mockClear();
});

test("renders Dictionary component", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/dictionaryId"]}>
      <Dictionary />
    </MemoryRouter>
  );
  const textElement = getByText(/Dictionary/i);
  expect(textElement).toBeInTheDocument();
});

test("adds a new pair to the dictionary", () => {
  const { getByTestId, getByDisplayValue } = renderDictionary();

  const keyInputElement = getByTestId("key");
  fireEvent.change(keyInputElement, { target: { value: "New Key" } });

  const valueInputElement = getByTestId("value");
  fireEvent.change(valueInputElement, { target: { value: "New Value" } });

  const addButtonElement = getByTestId("add");
  addButtonElement.click();
  const newKeyElement = getByDisplayValue("New Key");
  expect(newKeyElement).toBeInTheDocument();

  const newValueElement = getByDisplayValue("New Key");
  expect(newValueElement).toBeInTheDocument();

  expect(localStorage.setItem.mock.calls.length).toBe(1);
});

test("deletes a pair from the dictionary", () => {
  const {
    getByTestId,
    getByDisplayValue,
    queryByDisplayValue
  } = renderDictionary();

  const keyElement = getByDisplayValue("key");
  expect(keyElement).toBeInTheDocument();

  const deleteButtonElement = getByTestId(`delete-${PAIR_ID}`);
  deleteButtonElement.click();

  const keyRemovedElement = queryByDisplayValue("key");
  expect(keyRemovedElement).toBeNull();

  expect(localStorage.setItem.mock.calls.length).toBe(2);
});

test("updates a pair in the dictionary", () => {
  const { getByDisplayValue } = renderDictionary();

  const keyElement = getByDisplayValue("key");
  fireEvent.change(keyElement, { target: { value: "New Key" } });

  const keyUpdatedElement = getByDisplayValue("New Key");
  expect(keyUpdatedElement).toBeInTheDocument();

  expect(localStorage.setItem.mock.calls.length).toBe(2);
});
