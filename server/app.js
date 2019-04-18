import path from "path";
import fs from "fs";

import React from "react";
import { StaticRouter as Router } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";

require("@oftien-env")();
const setupProxy = require("../src/setupProxy");
const bootstrap = require("../src/bootstrap");

const PORT = process.env.PORT;
const app = process.env.REACT_APP_APP;
const expressApp = express();

const staticDir = `./archive/${app}`;

expressApp.staticDir = staticDir;
expressApp.use(express.static(expressApp.staticDir));
setupProxy(expressApp);

const defaultRender = async (req, res) => {
  const context = {};
  const { App, theme, constants, api, apis, store } = global;

  // await api(apis.Resume.fetch, null, ["phitien"]);
  const indexFile = path.resolve(`${expressApp.staticDir}/index.html`);
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

expressApp.get("/", defaultRender);
expressApp.get("/*", defaultRender);

expressApp.listen(PORT, () => {
  console.log(`Website running at: ${global.constants.uiBaseUrl}`);
});
