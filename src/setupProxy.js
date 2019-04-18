const fs = require("fs");
const proxy = require("http-proxy-middleware");
const bodyParser = require("body-parser");

require("@oftien-tools/env");
const { constants } = global;

/** Uploader **/
const multer = require("multer");
const uploader = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null);
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});
const setupRoutes = async app => {
  const routes = require(`../src/apps/${constants.app}/routes`);
  if (routes instanceof Array)
    routes.map(route => route(app, uploader, bodyParser));
};
const socketSetup = app => {
  const io = (app.io = require("socket.io")());
  io.origins("*:*");
  io.on("connection", function(client) {
    app.io = this;
    client.emit({ type: "socket.connected" });
  });
  io.listen(constants.socketPort);
  console.log("Socket is listening on port ", constants.socketPort);
};
const proxySetup = app => {
  const beEndpoint = "/api/v1";
  const { beBaseUrl } = constants;
  const apiProxy = proxy(beEndpoint, {
    target: beBaseUrl,
    changeOrigin: true
  });
  app.use(beEndpoint, apiProxy);
};
module.exports = function(app) {
  app.rootDir = __dirname;

  /** Socket **/
  socketSetup(app);
  /** routes **/
  setupRoutes(app);
  /** proxy **/
  proxySetup(app);
};
