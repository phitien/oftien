import React from "react";
import { StaticRouter as Router } from "react-router-dom";
import { renderToString } from "react-dom/server";

require("@oftien-tools/env");
const app = process.env.REACT_APP_APP;

export default async (req, res) => {
  const fs = require("fs");
  const path = require("path");
  const context = {};
  const { App, theme, constants, api, apis, store, dispatch } = global;
  //call api to get applicaton config
  await api(apis.Application.config);
  //call route apis
  const url = req.url;
  const [pathname, search] = url.split("?");
  const location = { pathname, search };
  dispatch({ type: "ApplicationLocation", payload: location });
  const currentRoute = global.routes
    .filter(o => o.props.class)
    .find(o => o.props.class.apis);
  let title = "";
  let keywords = "";
  let author = "";
  let description = "";
  let logo = "";

  if (currentRoute) {
    const { apis } = currentRoute.props.class;
    [].merge(apis).map(async args => await api(...args));
    ({ title, keywords, author, description, logo } = currentRoute.props.class);
  }
  const html = renderToString(
    <Router location={location} context={context}>
      <App store={store} theme={theme} />
    </Router>
  );
  return res.render("index", {
    app,
    title,
    keywords,
    author,
    description,
    logo,
    html
  });
};
