import React from "react";
import { StaticRouter as Router } from "react-router-dom";
import { renderToString } from "react-dom/server";

require("@oftien-tools/env");
const app = process.env.REACT_APP_APP;

export default async (req, res) => {
  const fs = require("fs");
  const path = require("path");
  const context = {};
  // await api(apis.Resume.fetch, null, ["phitien"]);
  const { App, theme, constants, api, apis, store } = global;
  const html = renderToString(
    <Router location={req.url} context={context}>
      <App store={store} theme={theme} />
    </Router>
  );
  return res.render("index", {
    app,
    title: "",
    keywords: "",
    author: "",
    description: "",
    logo: "",
    html
  });
};
