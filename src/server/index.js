import express from "express";
import ejs from "ejs";
// import webpack from "webpack";
import React from "react";
import { StaticRouter as Router } from "react-router-dom";
import { renderToString } from "react-dom/server";
import defaultRender from "./defaultRender";

require("@oftien-tools/env");
global.sessionStorage = { getItem(n) {}, setItem(n, v) {} };
global.localStorage = { getItem(n) {}, setItem(n, v) {} };
global.location = { pathname: "/", search: "", hash: "" };

const setupProxy = require("../setupProxy");
const bootstrap = require("../bootstrap");

const PORT = process.env.PORT;
const app = process.env.REACT_APP_APP;

const path = require("path");
const staticDir = path.join(__dirname, `../../archive/${app}`);
const server = express();
server.set("views", staticDir);
server.locals.delimiter = "oftien";
server.set("view engine", "ejs");
// server.engine("html", ejs.renderFile);
// server.set("view engine", "html");

server.staticDir = staticDir;
setupProxy(server);
server.use(express.static(server.staticDir));
server.use("/", defaultRender);
server.use("*", defaultRender);

server.listen(PORT, () => {
  console.log(`Website running at: ${global.constants.uiBaseUrl}`);
});
