import ForkedDictionary from "../../models/forkedDictionary";

it("marks simple fork", () => {
  const dictionary = new ForkedDictionary([
    { key: "1", value: "2" },
    { key: "1", value: "3" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(2);
});

it("checks duplicate", () => {
  const dictionary = new ForkedDictionary([
    { key: "1", value: "2" },
    { key: "1", value: "2" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});

it("checks single element", () => {
  const dictionary = new ForkedDictionary([{ key: "1", value: "2" }]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});

it("checks empty dictionary", () => {
  const dictionary = new ForkedDictionary([]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});
