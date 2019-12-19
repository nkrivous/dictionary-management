import ChainedDictionary from "./chainedDictionary";

it("marks simple chain", () => {
  const dictionary = new ChainedDictionary([
    { key: "1", value: "2" },
    { key: "2", value: "3" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(2);
});

it("marks cycled chain", () => {
  const dictionary = new ChainedDictionary([
    { key: "1", value: "2" },
    { key: "2", value: "1" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(2);
});

it("checks single element", () => {
  const dictionary = new ChainedDictionary([{ key: "1", value: "2" }]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});

it("checks no chains", () => {
  const dictionary = new ChainedDictionary([
    { key: "1", value: "2" },
    { key: "3", value: "2" }
  ]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});

it("checks empty dictionary", () => {
  const dictionary = new ChainedDictionary([]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});
