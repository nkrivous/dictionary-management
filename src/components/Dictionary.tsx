import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import DictionaryModel, { Pair } from "../models/dictionary";
import DuplicatedDictionary from "../models/duplicatedDictionary";
import ForkedDictionary from "../models/forkedDictionary";
import ChainedDictionary from "../models/chainedDictionary";
import CycledDictionary from "../models/cycledDictionary";

const Dictionary: React.FC = () => {
  const { dictionaryId } = useParams();
  const { dictionaries, structures, service } = useStateValue();
  const dictionary = useMemo(() => {
    return dictionaries.find(x => x.id === dictionaryId);
  }, [dictionaryId, dictionaries]);
  const structure = useMemo(() => {
    if (!dictionaryId) return [];
    return structures[dictionaryId];
  }, [dictionaryId, structures]);
  const [newPair, setNewPair] = useState<Pair>({ key: "", value: "" });
  const updateNewPair = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = {
        ...newPair,
        [event.target.name]: event.target.value
      };
      setNewPair(newVal);
    },
    [newPair]
  );
  const addPair = useCallback(() => {
    if (dictionaryId) {
      service.addPair(dictionaryId, newPair);
      setNewPair({ key: "", value: "" });
    }
  }, [service, newPair, dictionaryId]);
  const deletePair = useCallback(
    pairId => () => {
      if (dictionaryId) {
        service.deletePair(dictionaryId, pairId);
      }
    },
    [dictionaryId, service]
  );
  const updatePair = useCallback(
    (pairId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const pair = structure.find(x => x.id === pairId);
      if (!pair || !dictionaryId) return;

      const newVal = {
        ...pair,
        [event.target.name]: event.target.value
      };
      service.updatePair(dictionaryId, newVal);
    },
    [structure, dictionaryId, service]
  );

  const checkDictionary = useCallback(() => {
    if (!dictionaryId) return;
    const pairs = structure.map(x => ({ key: x.key, value: x.value }));
    const checks: DictionaryModel[] = [
      new DuplicatedDictionary(pairs),
      new ForkedDictionary(pairs),
      new ChainedDictionary(pairs),
      new CycledDictionary(pairs)
    ];
    const warnings = checks.map(x => x.markWarnings());
    const newStructure = structure.map(x => {
      const level = warnings.reduce((curr, next) => {
        const level =
          next.get(JSON.stringify({ key: x.key, value: x.value })) || 0;
        return curr > level ? curr : level;
      }, 0);
      return { ...x, warning: level };
    });
    service.updateStructure(dictionaryId, newStructure);
  }, [dictionaryId, structure, service]);

  if (!dictionary) {
    return <div>Dictionary is not found</div>;
  }

  return (
    <section>
      <h3>Dictionary: {dictionary.name}</h3>
      <div>
        {structure.map(x => (
          <div key={x.id}>
            <input value={x.key} name="key" onChange={updatePair(x.id)} />
            <input value={x.value} name="value" onChange={updatePair(x.id)} />
            <button onClick={deletePair(x.id)}>-</button>
            <span>{x.warning}</span>
          </div>
        ))}
      </div>
      <div>
        <input
          data-testid="key"
          value={newPair.key}
          name="key"
          onChange={updateNewPair}
        />
        <input
          data-testid="value"
          value={newPair.value}
          name="value"
          onChange={updateNewPair}
        />
        <button data-testid="add" onClick={addPair}>
          + Add
        </button>
      </div>
      <button onClick={checkDictionary}>Check Dictionary</button>
    </section>
  );
};

export default Dictionary;
