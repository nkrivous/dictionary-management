import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Overwiew from "./Overview";
import Dictionary from "./Dictionary";
import { StateProvider, getFromLocalStorage } from "../state";

const App: React.FC = () => {
  const { dictionaries, structures } = getFromLocalStorage();
  return (
    <StateProvider initialState={{ dictionaries, structures }}>
      <Router>
        <header>
          <Link to="/">Dictionary Management</Link>
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
