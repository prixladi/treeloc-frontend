import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import MapPage from "./MapPage";
import ListPage from "./ListPage";

import "./App.css";
import { _List, _Map } from "./Routes";
import { NavBar } from "./NavBar";

import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <>
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Redirect to={_List} />
        </Route>
        <Route exact path={_Map}>
          <MapPage />
        </Route>
        <Route exact path={_List}>
          <ListPage />
        </Route>
      </Switch>
    </Router>
    </>
  );
};

export default App;
