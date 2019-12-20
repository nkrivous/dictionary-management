import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { Pair } from "../dictionary/dictionary";

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
    </section>
  );
};

export default Dictionary;
