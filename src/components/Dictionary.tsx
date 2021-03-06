import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { useStateValue, Structure, UpdatePair, DeletePair } from "../state";
import { Pair } from "../models/dictionary";
import useValidation from "../hooks/useValidation";
import "./Dictionary.scss";

const NewPairForm: React.FC = () => {
  const { service } = useStateValue();
  const { dictionaryId } = useParams();
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
  const addPair = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (dictionaryId) {
        service.addPair(dictionaryId, newPair);
        setNewPair({ key: "", value: "" });
      }
    },
    [service, newPair, dictionaryId]
  );
  return (
    <form className="dictionary__form" onSubmit={addPair}>
      <input
        className="dictionary__input"
        data-testid="key"
        value={newPair.key}
        name="key"
        onChange={updateNewPair}
      />
      <input
        className="dictionary__input"
        data-testid="value"
        value={newPair.value}
        name="value"
        onChange={updateNewPair}
      />
      <button className="dictionary__button--add" data-testid="add">
        + Add
      </button>
    </form>
  );
};

interface IDictionaryItemProps {
  item: Structure;
  updateItem: UpdatePair;
  deleteItem: DeletePair;
}
const DictionaryItem: React.FC<IDictionaryItemProps> = React.memo(
  ({ item, updateItem, deleteItem }) => {
    const { dictionaryId } = useParams();

    const onUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = {
        ...item,
        [event.target.name]: event.target.value
      };
      if (dictionaryId) {
        updateItem(dictionaryId, newVal);
      }
    };
    const onDelete = () => {
      if (dictionaryId) {
        deleteItem(dictionaryId, item.id);
      }
    };
    return (
      <div className="dictionary__item" data-testid={`item-${item.id}`}>
        <input
          className="dictionary__item-input"
          value={item.key}
          name="key"
          onChange={onUpdate}
        />
        <input
          className="dictionary__item-input"
          value={item.value}
          name="value"
          onChange={onUpdate}
        />
        <button
          className="dictionary__button--delete"
          data-testid={`delete-${item.id}`}
          onClick={onDelete}
        >
          x
        </button>
        <div className="dictionary__warning-wrapper">
          {(item.warnings || []).map(x => (
            <span
              key={x}
              className={classNames(
                "dictionary__warning",
                `dictionary__warning--${x}`
              )}
            ></span>
          ))}
        </div>
      </div>
    );
  }
);

const DictionaryWarnings: React.FC = () => (
  <>
    <h6>Instructions</h6>
    <div className="instruction__item dictionary__warning-wrapper">
      <span className="dictionary__warning dictionary__warning--0"></span> No
      warnings
    </div>
    <div className="instruction__item dictionary__warning-wrapper">
      <span className="dictionary__warning dictionary__warning--1"></span>{" "}
      Duplicate
    </div>
    <div className="instruction__item dictionary__warning-wrapper">
      <span className="dictionary__warning dictionary__warning--2"></span> Fork
    </div>
    <div className="instruction__item dictionary__warning-wrapper">
      <span className="dictionary__warning dictionary__warning--3"></span> Chain
    </div>
    <div className="instruction__item dictionary__warning-wrapper">
      <span className="dictionary__warning dictionary__warning--4"></span> Cycle
    </div>
  </>
);

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
  const { isValidating } = useValidation(
    dictionaryId,
    structure,
    service.updateStructure
  );

  if (!dictionary) {
    return <div>Dictionary is not found</div>;
  }

  return (
    <section className="dictionary">
      <header>Dictionary: {dictionary.name}</header>
      <div className="dictionary__list">
        {structure.map(x => (
          <DictionaryItem
            key={x.id}
            item={x}
            updateItem={service.updatePair}
            deleteItem={service.deletePair}
          />
        ))}
      </div>
      <NewPairForm />
      {isValidating && <span>Validation...</span>}
      <footer>
        <DictionaryWarnings />
      </footer>
    </section>
  );
};

export default Dictionary;
