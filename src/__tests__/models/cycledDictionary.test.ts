import CycledDictionary from "../../models/cycledDictionary";

it("marks tied loops", () => {
  const dictionary = new CycledDictionary([
    { key: "1", value: "4" },
    { key: "1", value: "2" },
    { key: "3", value: "1" },
    { key: "2", value: "3" },
    { key: "3", value: "4" },
    { key: "4", value: "2" }
  ]);

  const marks = dictionary.markWarnings();

  expect(marks.size).toBe(6);
});

it("marks two separate loops", () => {
  const dictionary = new CycledDictionary([
    { key: "1", value: "2" },
    { key: "2", value: "3" },
    { key: "3", value: "1" },
    { key: "4", value: "5" },
    { key: "5", value: "6" },
    { key: "6", value: "4" }
  ]);

  const marks = dictionary.markWarnings();

  expect(marks.size).toBe(6);
});

it("marks single loop", () => {
  const dictionary = new CycledDictionary([
    { key: "1", value: "2" },
    { key: "2", value: "1" }
  ]);
  const marks = dictionary.markWarnings();

  expect(marks.size).toBe(2);
});

it("marks single element loop", () => {
  const dictionary = new CycledDictionary([{ key: "1", value: "1" }]);
  const marks = dictionary.markWarnings();

  expect(marks.size).toBe(1);
});

it("checks no loop", () => {
  const dictionary = new CycledDictionary([
    { key: "1", value: "2" },
    { key: "2", value: "3" }
  ]);
  const marks = dictionary.markWarnings();

  expect(marks.size).toBe(0);
});

it("checks empty dictionary", () => {
  const dictionary = new CycledDictionary([]);

  const marks = dictionary.markWarnings();
  expect(marks.size).toBe(0);
});
