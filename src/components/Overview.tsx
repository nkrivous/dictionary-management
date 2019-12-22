import React, { useCallback, useState } from "react";
import { useStateValue } from "../state";
import { Link } from "react-router-dom";
import "./Overview.scss";

const NewDictionaryForm: React.FC = () => {
  const { service } = useStateValue();
  const [name, setName] = useState<string>("");

  const updateName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    []
  );

  const addDictionary = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      service.addDictionary(name);
      setName("");
    },
    [name, service]
  );

  return (
    <form className="overview__form" onSubmit={addDictionary}>
      <input
        className="overview__input"
        data-testid="newValue"
        value={name}
        onChange={updateName}
      />
      <button className="overview__button--add" data-testid="add">
        + Add
      </button>
    </form>
  );
};

const Overwiew: React.FC = () => {
  const { dictionaries, service } = useStateValue();

  const deleteDictionary = useCallback(
    (id: string) => () => {
      service.deleteDictionary(id);
    },
    [service]
  );
  return (
    <section className="overview">
      <header>Overview</header>
      <ul className="overview__list">
        {dictionaries.map(x => (
          <li className="overview__item" key={x.id}>
            <Link className="overview__item-link" to={`/${x.id}`}>
              {x.name}
            </Link>
            <button
              className="overview__button--delete"
              data-testid={`delete-${x.id}`}
              title="Delete dictionary"
              onClick={deleteDictionary(x.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <NewDictionaryForm />
    </section>
  );
};

export default Overwiew;
