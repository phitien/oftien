import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

require("./bootstrap");

const { App, store, theme, dispatch, location } = global;
dispatch({ type: "ApplicationLocation", payload: location });
const context = {};
ReactDOM.hydrate(
  <Router location={location} context={context}>
    <App store={store} theme={theme} />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
// serviceWorker.register();
