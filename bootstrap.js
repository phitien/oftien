const fs = require("fs");
/**** loads environment variables from a .env file into process.env *****/
require("dotenv").config();
const ip = require("ip");
const ip_address = ip.address();
if (!process.env.ENV) process.env.ENV = "local";
const envPath = `${__dirname}/config/.env.${process.env.ENV}`;
const content = fs.readFileSync(envPath);
fs.writeFileSync(".env", content.toString());
require("dotenv").config();
/**** ****/
process.env.OFT_UI_PROTOCOL = process.env.UI_PROTOCOL || "http";
process.env.OFT_UI_DOMAIN = process.env.UI_DOMAIN || ip_address;
process.env.OFT_UI_PORT = process.env.UI_PORT || 2810;

process.env.OFT_BE_PROTOCOL = process.env.BE_PROTOCOL || "http";
process.env.OFT_BE_DOMAIN = process.env.BE_DOMAIN || ip_address;
process.env.OFT_BE_PORT = process.env.BE_PORT || 1028;

process.env.OFT_SOCKET_PORT = process.env.SOCKET_PORT || 28100;

process.env.OFT_GOOGLE_ANALYTICS_TRACKING_ID =
  process.env.GOOGLE_ANALYTICS_TRACKING_ID || "";

process.env.OFT_ALPHAVANTAGE_API_KEY =
  process.env.OFT_ALPHAVANTAGE_API_KEY || "YEL6VCPIIYP83YZC";

process.env.OFTS_DATA_ENCRYPTION_KEYS =
  process.env.DATA_ENCRYPTION_KEYS ||
  "IGCD9HaeoE++tNpSQV55dTsnSb819dvchEOTk33e/YA=";
process.env.OFTS_INTERNAL_EMAIL_ADDRESS =
  process.env.INTERNAL_EMAIL_ADDRESS || "support@oftien.com";
process.env.OFTS_JWT_SECRET =
  process.env.JWT_SECRET || "xStmbyc066BOFn40gIr29y09Ud94z1P7";
process.env.OFTS_EMAIL_ACCOUNT =
  process.env.EMAIL_ACCOUNT || "contact.oftien@gmail.com";
process.env.OFTS_EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "Password@1234";
process.env.OFTS_DB_ADAPTER = process.env.DB_ADAPTER || "sails-mongo";
process.env.OFTS_DB_LINK =
  process.env.DB_LINK || `mongodb://${ip_address}/oftien`;

/**** ****/
require("./src/settings");
