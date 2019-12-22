import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders app heading", () => {
  const { getByText } = render(<App />);
  const headingElement = getByText(/Dictionary Management/i);
  expect(headingElement).toBeInTheDocument();
});

test("loads data from localStorage", () => {
  const dictionaryName = "New Dictionary";

  const oldLocalStorage = window.localStorage;
  const localStorageState = {
    dictionaries: JSON.stringify([{ id: "1", name: dictionaryName }]),
    structures: JSON.stringify({ "1": [] })
  };
  const localStorageMock = {
    getItem: (key: "dictionaries" | "structures"): string =>
      localStorageState[key],
    setItem: jest.fn()
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true
  });

  const { getByText } = render(<App />);

  const dictionaryElement = getByText(dictionaryName);
  expect(dictionaryElement).toBeInTheDocument();

  Object.defineProperty(window, "localStorage", {
    value: oldLocalStorage,
    writable: true
  });
});
