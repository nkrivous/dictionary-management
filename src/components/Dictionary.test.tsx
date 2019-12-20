import React from "react";
import { render } from "@testing-library/react";
import Dictionary from "./Dictionary";
import { MemoryRouter } from "react-router-dom";

test("renders Dictionary component", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/dictionaryId"]}>
      <Dictionary />
    </MemoryRouter>
  );
  const textElement = getByText(/Dictionary/i);
  expect(textElement).toBeInTheDocument();
});
