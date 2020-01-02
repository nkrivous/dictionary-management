import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Overwiew from "./Overview";
import Dictionary from "./Dictionary";
import { StateProvider, getFromLocalStorage } from "../state";
import "./App.scss";

const App: React.FC = () => {
  const { dictionaries, structures } = getFromLocalStorage();
  return (
    <StateProvider initialState={{ dictionaries, structures }}>
      <Router>
        <header>
          <Link className="app__header" to="/">
            Dictionary Management
          </Link>
        </header>
        <Switch>
          <Route path="/:dictionaryId">
            <Dictionary />
          </Route>
          <Route path="/">
            <Overwiew />
          </Route>
        </Switch>
      </Router>
    </StateProvider>
  );
};

export default App;
