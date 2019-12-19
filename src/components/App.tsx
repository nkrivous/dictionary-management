import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Overwiew from "../pages/overview/components/Overview";
import Dictionary from "../pages/dictionary/conponents/Dictionary";

const App: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default App;
