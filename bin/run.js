#!/usr/bin/env node
/** Create api **/
process.on("unhandledRejection", err => {
  throw err;
});
const env = async function(env) {
  const fs = require("fs");
  /**** loads environment variables from a .env file into process.env *****/
  require("dotenv").config();
  env = env || process.env.ENV || "local";
  process.env.ENV = env;
  const ip = require("ip");
  process.env.REACT_APP_IP = ip.address();
  const envPath = `./config/.env.${process.env.ENV}`;
  const content = fs.readFileSync(envPath);
  const lines = content
    .toString()
    .split("\n")
    .filter(o => o && /^[A-Z]/.test(o))
    .map(o => `REACT_APP_${o}`);
  fs.writeFileSync(".env", lines.join("\n"));
  require("dotenv").config();
  process.env.REACT_APP_UI_PROTOCOL =
    process.env.REACT_APP_UI_PROTOCOL || "http";
  process.env.REACT_APP_UI_DOMAIN =
    process.env.REACT_APP_UI_DOMAIN || process.env.REACT_APP_IP;
  process.env.REACT_APP_UI_PORT = process.env.REACT_APP_UI_PORT || 2810;

  process.env.REACT_APP_BE_PROTOCOL =
    process.env.REACT_APP_BE_PROTOCOL || "http";
  process.env.REACT_APP_BE_DOMAIN =
    process.env.REACT_APP_BE_DOMAIN || process.env.REACT_APP_IP;
  process.env.REACT_APP_BE_PORT = process.env.REACT_APP_BE_PORT || 1028;

  process.env.REACT_APP_SOCKET_PORT =
    process.env.REACT_APP_SOCKET_PORT || 28100;

  process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID =
    process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || "";

  process.env.REACT_APP_ALPHAVANTAGE_API_KEY =
    process.env.REACT_APP_ALPHAVANTAGE_API_KEY || "YEL6VCPIIYP83YZC";

  process.env.REACT_APP_DATA_ENCRYPTION_KEYS =
    process.env.REACT_APP_DATA_ENCRYPTION_KEYS ||
    "IGCD9HaeoE++tNpSQV55dTsnSb819dvchEOTk33e/YA=";
  process.env.REACT_APP_INTERNAL_EMAIL_ADDRESS =
    process.env.REACT_APP_INTERNAL_EMAIL_ADDRESS || "support@oftien.com";
  process.env.REACT_APP_JWT_SECRET =
    process.env.REACT_APP_JWT_SECRET || "xStmbyc066BOFn40gIr29y09Ud94z1P7";
  process.env.REACT_APP_EMAIL_ACCOUNT =
    process.env.REACT_APP_EMAIL_ACCOUNT || "contact.oftien@gmail.com";
  process.env.REACT_APP_EMAIL_PASSWORD =
    process.env.REACT_APP_EMAIL_PASSWORD || "Password@1234";
  process.env.REACT_APP_DB_ADAPTER = process.env.DB_ADAPTER || "sails-mongo";
  process.env.REACT_APP_DB_LINK =
    process.env.REACT_APP_DB_LINK ||
    `mongodb://${process.env.REACT_APP_IP}/oftien`;

  process.env.REACT_APP_APP = process.env.REACT_APP_APP || "oftien";
  process.env.REACT_APP_WEB_NAME = process.env.REACT_APP_WEB_NAME || "OfTien";
  process.env.REACT_APP_WEB_AUTHOR =
    process.env.REACT_APP_WEB_AUTHOR || "Phi Tien<im.phitien@gmail.com>";
  process.env.REACT_APP_WEB_KEYWORDS =
    process.env.REACT_APP_WEB_KEYWORDS || "OfTien Framework, ReactJS";
  process.env.REACT_APP_WEB_DESCRIPTION =
    process.env.REACT_APP_WEB_DESCRIPTION || "OfTien Framework, ReactJS";
  process.env.REACT_APP_LOGO =
    process.env.REACT_APP_LOGO || "/static/icons/logo_vJi_5.ico";
  process.env.REACT_APP_DEFAULT_PATH =
    process.env.REACT_APP_DEFAULT_PATH || "/";
  process.env.REACT_APP_DATE_FORMAT =
    process.env.REACT_APP_DATE_FORMAT || "d/m/yy";
  process.env.REACT_APP_THEME = process.env.REACT_APP_THEME || "black";

  process.env.REACT_APP_TOKEN_NAME =
    process.env.REACT_APP_TOKEN_NAME || "oftien-token";

  process.env.REACT_APP_NOTIFICATION_TIMEOUT =
    process.env.REACT_APP_NOTIFICATION_TIMEOUT || 7000;

  process.env.REACT_APP_UI_ORIGIN = `${process.env.REACT_APP_UI_PROTOCOL}://${
    process.env.REACT_APP_UI_DOMAIN
  }`;
  process.env.REACT_APP_UI_BASE_URL = `${process.env.REACT_APP_UI_ORIGIN}:${
    process.env.REACT_APP_UI_PORT
  }`;

  process.env.REACT_APP_BE_ORIGIN = `${process.env.REACT_APP_BE_PROTOCOL}://${
    process.env.REACT_APP_BE_DOMAIN
  }`;
  process.env.REACT_APP_BE_BASE_URL = `${process.env.REACT_APP_BE_ORIGIN}:${
    process.env.REACT_APP_BE_PORT
  }`;

  process.env.REACT_APP_SOCKET_URL = `${process.env.REACT_APP_UI_ORIGIN}:${
    process.env.REACT_APP_SOCKET_PORT
  }`;

  process.env.REACT_APP_MODELS_MIGRATE =
    process.env.REACT_APP_MODELS_MIGRATE || "safe";
  process.env.REACT_APP_LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || "debug";
  process.env.REACT_APP_ACTIVATION_REQUIRED =
    process.env.REACT_APP_ACTIVATION_REQUIRED || false;
  process.env.REACT_APP_MAX_AGE =
    process.env.REACT_APP_MAX_AGE || 24 * 60 * 60 * 1000;
  process.env.REACT_APP_SESSION_BUFFER =
    process.env.REACT_APP_SESSION_BUFFER || 60 * 1000;
  process.env.REACT_APP_HTTP_CACHE =
    process.env.REACT_APP_HTTP_CACHE || 365.25 * 24 * 60 * 60 * 1000;
  process.env.REACT_APP_FILE_UPLOAD_SIZE =
    process.env.REACT_APP_FILE_UPLOAD_SIZE || 4000000;
  process.env.REACT_APP_EMAIL_REG = process.env.REACT_APP_EMAIL_REG || ".+";
  const key = "REACT_APP_";
  const keyReg = new RegExp(`^${key}.+`);
  Object.keys(process.env).map(o => {
    const v = process.env[o];
    if (keyReg.test(o)) {
      const k = o
        .substr(key.length)
        .split("_")
        .map(o => o.lower().ucfirst())
        .join("")
        .lcfirst();
      lines.push(`${key}${k}=${v}`);
    }
  });
  fs.writeFileSync(".env", lines.join("\n"));
  fs.writeFileSync("./public/.env", lines.join("\n"));
  require("dotenv").config();
  process.env.PORT = process.env.REACT_APP_UI_PORT || 2810;
};
const run = async function() {
  env();
  const spawn = require("react-dev-utils/crossSpawn");
  const args = process.argv.slice(3);

  const scriptIndex = args.findIndex(
    x => x === "build" || x === "eject" || x === "start" || x === "test"
  );

  const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
  const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];
  const result = spawn.sync(
    "node",
    nodeArgs
      .concat(require.resolve(`react-scripts/scripts/${script}`))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: "inherit" }
  );
  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        "The build failed because the process exited too early. " +
          "This probably means the system ran out of memory or someone called " +
          "`kill -9` on the process."
      );
    } else if (result.signal === "SIGTERM") {
      console.log(
        "The build failed because the process exited too early. " +
          "Someone might have called `kill` or `killall`, or the system could " +
          "be shutting down."
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
};
module.exports = async function() {};

module.exports.run = run;
