import React, { useCallback, useState } from "react";
import { useStateValue } from "../state";
import { Link } from "react-router-dom";

const Overwiew: React.FC = () => {
  const { dictionaries, service } = useStateValue();
  const [name, setName] = useState<string>("");

  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    []
  );

  const addDictionary = useCallback(() => {
    service.addDictionary(name);
    setName("");
  }, [name, service]);

  const deleteDictionary = useCallback(
    (id: string) => () => {
      service.deleteDictionary(id);
    },
    [service]
  );
  return (
    <>
      Overview
      <ul>
        {dictionaries.map(x => (
          <li key={x.id}>
            <Link to={`/${x.id}`}>{x.name}</Link>
            <button onClick={deleteDictionary(x.id)}>-</button>
          </li>
        ))}
      </ul>
      <input data-testid="newValue" value={name} onChange={updateName} />
      <button data-testid="add" onClick={addDictionary}>
        + Add
      </button>
    </>
  );
};

export default Overwiew;
