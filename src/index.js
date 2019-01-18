import React from "react";
import ReactDOM from "react-dom";

import { global } from "./core/bootstrap";

import * as serviceWorker from "./serviceWorker";

const { App, store, theme } = global;

ReactDOM.render(
  React.createElement(App, { store, theme }),
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
