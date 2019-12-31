import { renderHook } from "@testing-library/react-hooks";
import useValidation from "./useValidation";
import { warning } from "../models/dictionary";
import { Structure } from "../state";

const updateStructure = jest.fn();

beforeEach(() => {
  updateStructure.mockClear();
});

test("validates on adding", () => {
  let structure: Structure[] = [
    { id: "1", key: "key", value: "value", warnings: [] }
  ];
  const { rerender } = renderHook(() =>
    useValidation("dictionaryId", structure, updateStructure)
  );

  structure = [
    ...structure,
    { id: "2", key: "key2", value: "value2", warnings: [] }
  ];
  rerender();

  expect(updateStructure.mock.calls.length).toBe(2);
  const newStructure = updateStructure.mock.calls[1][1];
  expect(newStructure.length).toBe(2);
  expect(newStructure[0].warnings).toStrictEqual([warning.none]);
  expect(newStructure[1].warnings).toStrictEqual([warning.none]);
});

test("validates on deletion", () => {
  let structure: Structure[] = [
    { id: "1", key: "key", value: "value", warnings: [] },
    { id: "2", key: "key", value: "value", warnings: [] }
  ];
  const { rerender } = renderHook(() =>
    useValidation("dictionaryId", structure, updateStructure)
  );

  structure = structure.slice(1);
  rerender();

  expect(updateStructure.mock.calls.length).toBe(2);
  const newStructure = updateStructure.mock.calls[1][1];
  expect(newStructure.length).toBe(1);
  expect(newStructure[0].warnings).toStrictEqual([warning.none]);
});

test("validates on change", () => {
  let structure: Structure[] = [
    { id: "1", key: "key", value: "value", warnings: [] },
    { id: "2", key: "key2", value: "value2", warnings: [] }
  ];
  const { rerender } = renderHook(() =>
    useValidation("dictionaryId", structure, updateStructure)
  );

  structure = structure.map(x => (x.id !== "2" ? x : { ...x, key: "value" }));
  rerender();

  expect(updateStructure.mock.calls.length).toBe(2);
  const newStructure = updateStructure.mock.calls[1][1];
  expect(newStructure.length).toBe(2);
  expect(newStructure[0].warnings).toStrictEqual([warning.chain]);
  expect(newStructure[1].warnings).toStrictEqual([warning.chain]);
});
