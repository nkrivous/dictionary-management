import DuplicatedDictionary from "./duplicatedDictionary";

it("marks duplicate", () => {
  const dictionary = new DuplicatedDictionary([
    { key: "1", value: "2" },
    { key: "1", value: "2" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(1);
});

it("checks fork", () => {
  const dictionary = new DuplicatedDictionary([
    { key: "1", value: "2" },
    { key: "1", value: "3" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});

it("checks no duplicates", () => {
  const dictionary = new DuplicatedDictionary([
    { key: "1", value: "2" },
    { key: "2", value: "3" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});

it("checks empty dictionary", () => {
  const dictionary = new DuplicatedDictionary([]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});
