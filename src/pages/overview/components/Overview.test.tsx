import React from "react";
import { render } from "@testing-library/react";
import Overwiew from "./Overview";

test("renders learn react link", () => {
  const { getByText } = render(<Overwiew />);
  const linkElement = getByText(/Overwiew/i);
  expect(linkElement).toBeInTheDocument();
});
