import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { Route, Redirect } from "react-router-dom";

import { connect, createStore } from "./redux";
const jQuery = require("jquery");
const datepickerFactory = require("jquery-datepicker");
const datepickerJAFactory = require("jquery-datepicker/i18n/jquery.ui.datepicker-ja");

datepickerFactory(jQuery);
datepickerJAFactory(jQuery);
global.$ = global.jQuery = jQuery;

global.themes = require("./themes");

//constants
const { constants } = global;
const { app } = constants;
if (!app) throw new Error("Pleace indicate APP value in enviroment file");

const { theme, logging } = constants;

//import styles
require("./scss/index.scss");
try {
  require(`../apps/${app}/scss/index.scss`);
} catch (e) {}
try {
  require(`../apps/${app}/scss/${theme}.scss`);
} catch (e) {}

//theme
global.theme = createMuiTheme(global.themes[theme]);
//models, reducers, actions, apis, store
global.models = {};
global.reducers = {};
global.actions = {};
global.apis = {};
global.dispatchLog = (...args) => {
  if (logging) console.log("dispatchLog", ...args);
  return global.store.dispatch(...args);
};
global.dispatchAll = async (payload, ...acts) => {
  acts = [].merge(...acts);
  return Promise.all(acts.map(type => global.dispatchLog({ type, payload })));
};
const models = require(`../apps/${app}/models`);
Object.keys(models).map(name => {
  if (models[name]) {
    const { defaultState, reducer, actions, apis } = models[name];
    global.models[name] = defaultState;
    global.reducers[name] = reducer;
    [].merge(actions).map(action => {
      const type = `${name}${action}`;
      global.actions[`${name}${action}`] = (...payload) => {
        payload = !payload.length
          ? null
          : payload.length === 1
          ? payload[0]
          : payload;
        const data = { type, payload };
        return new Promise((resolve, reject) => {
          try {
            global.dispatchLog(data);
            resolve(data);
          } catch (e) {
            reject(e);
          }
        });
      };
      return;
    });
    global.apis[name] = apis;
    return global.models[name];
  }
  return;
});

//store
global.store = createStore();
//App
global.App =
  require(`../apps/${app}/components`).Application ||
  require(`./components`).Application;
//NotFound
global.NotFound =
  require(`../apps/${app}/components`).NotFound ||
  require(`./components`).NotFound;
//routes
global.routes = [];
const addRoutes = (p, pages) => {
  Object.keys(pages)
    .filter(o => pages[o])
    .map(o => {
      const component = pages[o];
      if (component.name) addRoute(p, o, component);
      else addRoutes(o, component);
    });
};
const addRoute = (pkg, o, component) => {
  const { path, isDefault } = component;
  const connectedCmp = connect({ component });
  const paths = [].merge(path);
  paths.map((p, i) => {
    if (isDefault && p !== "/")
      global.routes.push(
        <Route
          key="default"
          exact
          path="/"
          render={() => <Redirect to={p || `/${o.lcfirst()}`} />}
        />
      );
    global.routes.push(
      <Route
        key={`${o}${i}${component.name}`}
        exact
        path={p || `/${o.lcfirst()}`}
        render={props =>
          React.createElement(connectedCmp, {
            ...props,
            className: `page-${pkg ? `${pkg.lower()}-` : ""}${o.lower()}`
          })
        }
      />
    );
  });
};
addRoutes("", require(`../apps/${app}/pages`));
