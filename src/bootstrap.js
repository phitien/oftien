import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { Route, Redirect } from "react-router-dom";

//*note: keep these lines below in exact order
require("@oftien-tools/addon");
const { connect, createStore } = require("./core/redux");
global.themes = require("./core/themes");
//*note: keep these lines above in exact order

//constants
const { constants } = global;
const { app } = constants;
if (!app) throw new Error("Pleace indicate APP value in enviroment file");

const { theme, logging } = constants;

//import styles
require("./core/scss/index.scss");
try {
  require(`./apps/${app}/scss/index.scss`);
} catch (e) {}
try {
  require(`./apps/${app}/scss/${theme}.scss`);
} catch (e) {}

global.addStyle = (attr, value) => {
  const body = global.jQuery("body");
  const styles = (body.attr("style") || "")
    .split(";")
    .map(o => o.trim())
    .filter(o => o.indexOf(attr) < 0);
  styles.push(`${attr}: ${value}`);
  body.attr("style", styles.join(";"));
};
//theme
global.theme = createMuiTheme(global.themes[theme]);
//models, reducers, actions, apis, store
global.models = {};
global.reducers = {};
global.actions = {};
global.apis = {};
global.dispatch = global.dispatchLog = (...args) => {
  if (logging) console.log("dispatchLog", ...args);
  return global.store.dispatch(...args);
};
global.dispatchAll = async (payload, ...acts) => {
  acts = [].merge(...acts);
  return Promise.all(acts.map(type => global.dispatchLog({ type, payload })));
};
const coreModels = require(`./core/models`);
const models = { ...coreModels, ...require(`./apps/${app}/models`) };
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
      return true;
    });
    global.apis[name] = apis;
    return global.models[name];
  }
  return true;
});

//store
global.store = createStore();
//App
global.App =
  require(`./apps/${app}/components`).Application ||
  require(`./core/components`).Application;
//NotFound
global.NotFound =
  require(`./apps/${app}/components`).NotFound ||
  require(`./core/components`).NotFound;
//routes
global.routes = [];
const addRoutes = (p, pages) =>
  Object.keys(pages)
    .filter(o => pages[o])
    .map(o => {
      const component = pages[o];
      if (component.name) addRoute(p, o, component);
      else addRoutes(o, component);
      return o;
    });
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
    return p;
  });
};
addRoutes("", require(`./apps/${app}/pages`));
