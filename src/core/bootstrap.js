import React from "react";
import jQuery from "jquery";
import datepickerFactory from "jquery-datepicker";
import datepickerJAFactory from "jquery-datepicker/i18n/jquery.ui.datepicker-ja";
import _ from "lodash";
import { createMuiTheme } from "@material-ui/core/styles";
import { Route, Redirect } from "react-router-dom";

import { connect, createStore } from "./redux";

datepickerFactory(jQuery);
datepickerJAFactory(jQuery);

global.$ = global.jQuery = jQuery;
global._ = _;
global.themes = require("./themes");

//Convenience functions for Object
Object.omit = _.omit;
Object.isEmpty = _.isEmpty;

//constants
const constants = {};
Object.keys(process.env).map(o => {
  const reg = /^REACT_APP_/gi;
  if (reg.test(o)) constants[o.replace(reg, "")] = process.env[o];
  return o;
});
global.constants = constants;
const { app } = constants;
if (!app)
  throw new Error("Pleace indicate REACT_APP_app value in enviroment file");

const { themename, dateformat, logging, notificationTimeout } = constants;
const { defaultPath, tokenName } = constants;
constants.tokenName = tokenName || "token";
constants.defaultPath = defaultPath || "/products";
constants.themename = themename || "black";
constants.dateformat = dateformat || "dd/mm/yy";
constants.notificationTimeout = parseInt(notificationTimeout) || 7000;

//import styles
require("./scss/index.scss");
try {
  require(`../apps/${app}/scss/index.scss`);
} catch (e) {}
try {
  require(`../apps/${app}/scss/${themename}.scss`);
} catch (e) {}

//Convenience functions for array
Array.prototype.merge = function(...args) {
  return this.concat(...args).filter(o => o !== undefined && o !== null);
};
Array.prototype.diff = function(...args) {
  let rs = this;
  args.map(a => (rs = rs.filter(o => a.indexOf(o) < 0)));
  return rs;
};
//Convenience functions for Date
Date.prototype.format = function(f = constants.dateformat) {
  return global.jQuery.datepicker.formatDate(f, this);
};
Date.prototype.toStandard = function() {
  return this.format("yy-mm-dd");
};
//Convenience functions for Number
Number.prototype.format = function(d, prefix = "", suffix = "") {
  return d
    ? `${prefix}${this.toFixed(d)}${suffix}`
    : `${prefix}${this}${suffix}`;
};
Number.prototype.percentage = function(d) {
  return (this * 100).format(d, "", "%");
};
Number.prototype.currency = function(prefix = "", suffix = "$", d = 2) {
  return this.format(d, prefix, suffix);
};
//Convenience functions for String
String.prototype.lower = function() {
  return this.toLowerCase();
};
String.prototype.upper = function() {
  return this.toUpperCase();
};
String.prototype.lcfirst = function() {
  return this.substr(0, 1).lower() + this.substr(1);
};
String.prototype.ucfirst = function() {
  return this.substr(0, 1).upper() + this.substr(1);
};
String.prototype.camel = function() {
  const reg = /^([A-Z])|\s([a-z])/g;
  return this.replace(reg, function(m, p1, p2, offset) {
    if (p2) return ` ${p2.upper()}`;
    return p1.lower();
  });
};
String.prototype.toDate = function(f = constants.dateformat) {
  return global.jQuery.datepicker.parseDate(f, this);
};

//theme
global.theme = createMuiTheme(global.themes[global.constants.themename]);
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
const pages = require(`../apps/${app}/pages`);
Object.keys(pages).map(o => {
  const component = pages[o];
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
        key={`${o}${i}`}
        exact
        path={p || `/${o.lcfirst()}`}
        render={props =>
          React.createElement(connectedCmp, { ...props, className: o.lower() })
        }
      />
    );
  });
});

export { global };
