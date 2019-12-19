import React from "react";
import { render } from "@testing-library/react";
import Dictionary from "./Dictionary";
import { MemoryRouter } from "react-router-dom";

test("renders learn react link", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/dictionaryId"]}>
      <Dictionary />
    </MemoryRouter>
  );
  const linkElement = getByText(/Dictionary/i);
  expect(linkElement).toBeInTheDocument();
});
