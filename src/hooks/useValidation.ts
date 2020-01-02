import { useState, useEffect } from "react";
import { warning } from "../models/dictionary";
import { Structure, UpdateStructure } from "../state";
import DictionaryModel from "../models/dictionary";
import DuplicatedDictionary from "../models/duplicatedDictionary";
import ForkedDictionary from "../models/forkedDictionary";
import ChainedDictionary from "../models/chainedDictionary";
import CycledDictionary from "../models/cycledDictionary";

const useValidation = (
  dictionaryId: string | undefined,
  dictionary: Structure[],
  updateStructure: UpdateStructure
) => {
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (dictionaryId === undefined || dictionary === undefined) return;
    setIsValidating(true);
    const pairs = dictionary.map(x => ({ key: x.key, value: x.value }));
    const checks: DictionaryModel[] = [
      new DuplicatedDictionary(pairs),
      new ForkedDictionary(pairs),
      new ChainedDictionary(pairs),
      new CycledDictionary(pairs)
    ];
    const warnings = checks.map(x => x.markWarnings());
    let hasChanges = false;
    const newStructure = dictionary.map(x => {
      let levels = warnings.reduce<warning[]>((curr, next) => {
        const level = next.get(JSON.stringify({ key: x.key, value: x.value }));
        if (level) {
          curr.push(level);
        }

        return curr;
      }, []);
      levels = levels.length ? levels : [0];
      if (JSON.stringify(levels) === JSON.stringify(x.warnings)) {
        return x;
      }
      hasChanges = true;
      return { ...x, warnings: levels };
    });
    if (hasChanges) {
      updateStructure(dictionaryId, newStructure);
    }

    setIsValidating(false);
  }, [dictionaryId, dictionary, updateStructure]);

  return { isValidating };
};

export default useValidation;
