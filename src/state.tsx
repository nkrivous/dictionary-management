import React, { useContext, useState, createContext, useMemo } from "react";
import uuidv4 from "uuid/v4";
import { warning, Pair } from "./models/dictionary";

export type UpdatePair = (
  dictionaruId: string,
  { id, key, value }: Pair & { id: string }
) => void;
export type DeletePair = (dictionaruId: string, pairId: string) => void;
export type UpdateStructure = (
  dictionaryId: string,
  structures: Structure[]
) => void;

type Service = {
  addDictionary(name: string): void;
  deleteDictionary(id: string): void;
  addPair(dictionaruId: string, { key, value }: Pair): void;
  deletePair: DeletePair;
  updatePair: UpdatePair;
  updateStructure: UpdateStructure;
};

type Dictionary = { id: string; name: string };
export type Structure = {
  id: string;
  key: string;
  value: string;
  warnings: warning[];
};

export const storeInLocalStorage = (name: string, object: Object) => {
  window.localStorage.setItem(name, JSON.stringify(object));
};

export const getFromLocalStorage = (): {
  dictionaries: Dictionary[];
  structures: { [id: string]: Structure[] };
} => {
  let dictionaries: Dictionary[];
  let structures: { [id: string]: Structure[] };
  try {
    dictionaries = JSON.parse(
      window.localStorage.getItem("dictionaries") || "[]"
    );
    structures = JSON.parse(window.localStorage.getItem("structures") || "{}");
  } finally {
  }
  return { dictionaries, structures };
};

export const StateContext: React.Context<{
  dictionaries: Dictionary[];
  structures: { [key: string]: Structure[] };
  service: Service;
}> = createContext({
  dictionaries: [{ id: "", name: "" }],
  structures: {},
  service: {
    addDictionary: name => {},
    deleteDictionary: id => {},
    addPair: (id, { key, value }) => {},
    deletePair: (did, pid) => {},
    updatePair: (did, { id, key, value }) => {},
    updateStructure: (did, structures) => {}
  }
});

interface IStateProvider {
  initialState: {
    dictionaries: Dictionary[];
    structures: { [key: string]: Structure[] };
  };
}
export const StateProvider: React.FC<IStateProvider> = ({
  initialState,
  children
}) => {
  const [dictionaries, setDictionaries] = useState<
    { id: string; name: string }[]
  >(initialState.dictionaries || []);

  const [structures, setStructures] = useState<{ [key: string]: Structure[] }>(
    initialState.structures || {}
  );
  const service: Service = useMemo(() => {
    return {
      addDictionary: name => {
        const id = uuidv4();
        setDictionaries(dictionaries => {
          const newValue = [...dictionaries, { id, name }];
          storeInLocalStorage("dictionaries", newValue);
          return newValue;
        });
        setStructures(structures => {
          const newValue = { ...structures, [id]: [] };
          storeInLocalStorage("structures", newValue);
          return newValue;
        });
      },
      deleteDictionary: id => {
        setDictionaries(dictionaries => {
          const newValue = dictionaries.filter(x => x.id !== id);
          storeInLocalStorage("dictionaries", newValue);
          return newValue;
        });
        setStructures(structures => {
          const { [id]: value, ...rest } = structures;
          storeInLocalStorage("structures", rest);
          return rest;
        });
      },
      addPair: (dictionaryId, { key, value }) => {
        const id = uuidv4();
        setStructures(structures => {
          const newValue = {
            ...structures,
            [dictionaryId]: [
              ...structures[dictionaryId],
              { id, key, value, warnings: [] }
            ]
          };
          return newValue;
        });
      },
      deletePair: (dictionaryId, pairId) => {
        setStructures(structures => {
          const newValue = {
            ...structures,
            [dictionaryId]: structures[dictionaryId].filter(
              x => x.id !== pairId
            )
          };
          return newValue;
        });
      },
      updatePair: (dictionaryId, { id, key, value }) => {
        setStructures(structures => {
          const newValue = {
            ...structures,
            [dictionaryId]: structures[dictionaryId].map(x =>
              x.id !== id ? x : { id, key, value, warnings: [] }
            )
          };
          return newValue;
        });
      },
      updateStructure: (dictionaryId, newStructures) => {
        setStructures(structures => {
          const newValue = {
            ...structures,
            [dictionaryId]: newStructures
          };
          storeInLocalStorage("structures", newValue);
          return newValue;
        });
      }
    };
  }, []);

  return (
    <StateContext.Provider value={{ dictionaries, structures, service }}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
