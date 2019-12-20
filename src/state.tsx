import React, { useContext, useState, createContext } from "react";
import uuidv4 from "uuid/v4";
import { warning, Pair } from "./dictionary/dictionary";

interface IService {
  addDictionary(name: string): void;
  deleteDictionary(id: string): void;
  addPair(dictionaruId: string, { key, value }: Pair): void;
  deletePair(dictionaruId: string, pairId: string): void;
  updatePair(
    dictionaruId: string,
    { id, key, value }: Pair & { id: string }
  ): void;
}

type Dictionary = { id: string; name: string };
type Structure = { id: string; key: string; value: string; warning?: warning };

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
  service: IService;
}> = createContext({
  dictionaries: [{ id: "", name: "" }],
  structures: {},
  service: {
    addDictionary: name => {},
    deleteDictionary: id => {},
    addPair: (id, { key, value }) => {},
    deletePair: (did, pid) => {},
    updatePair: (did, { id, key, value }) => {}
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
  const service: IService = {
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
          [dictionaryId]: [...structures[dictionaryId], { id, key, value }]
        };
        storeInLocalStorage("structures", newValue);
        return newValue;
      });
    },
    deletePair: (dictionaryId, pairId) => {
      setStructures(structures => {
        const newValue = {
          ...structures,
          [dictionaryId]: structures[dictionaryId].filter(x => x.id !== pairId)
        };
        storeInLocalStorage("structures", newValue);
        return newValue;
      });
    },
    updatePair: (dictionaryId, { id, key, value }) => {
      setStructures(structures => {
        const newValue = {
          ...structures,
          [dictionaryId]: structures[dictionaryId].map(x =>
            x.id !== id ? x : { id, key, value }
          )
        };
        storeInLocalStorage("structures", newValue);
        return newValue;
      });
    }
  };
  return (
    <StateContext.Provider value={{ dictionaries, structures, service }}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
