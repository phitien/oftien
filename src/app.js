import React from "react";
import { StaticRouter as Router } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";

require("@oftien-tools/env");
global.localStorage = { getItem(n) {}, setItem(n, v) {} };

const setupProxy = require("./setupProxy");
const bootstrap = require("./bootstrap");

const PORT = process.env.PORT;
const app = process.env.REACT_APP_APP;
const expressApp = express();

const staticDir = `./archive/${app}`;
const defaultRender = async (req, res) => {
  const fs = require("fs");
  const path = require("path");

  const context = {};
  const { App, theme, constants, api, apis, store } = global;

  // await api(apis.Resume.fetch, null, ["phitien"]);
  const indexFile = path.resolve(`${expressApp.staticDir}/_index.html`);
  const content = fs.readFileSync(indexFile, "utf8");
  try {
    const html = renderToString(
      <Router location={req.url} context={context}>
        <App store={store} theme={theme} />
      </Router>
    );
    return res.send(
      content.replace(
        /<div\s+id=["|']root["|']><\/div>/g,
        `<div id="root">${html}</div>`
      )
    );
  } catch (e) {
    console.log("Error:", e);
    return res.send(content);
  }
};
expressApp.staticDir = staticDir;
expressApp.use(express.static(expressApp.staticDir));
expressApp.use("/", defaultRender);
setupProxy(expressApp);
expressApp.use("*", defaultRender);

expressApp.listen(PORT, () => {
  console.log(`Website running at: ${global.constants.uiBaseUrl}`);
});
