const _ = require("lodash");
global._ = _;

Array.prototype.merge = function(...args) {
  return this.concat(...args).filter(o => o);
};
Array.prototype.diff = function(a) {
  return this.filter(o => a.indexOf(o) < 0);
};
Date.prototype.format = function(f) {
  if (
    !f &&
    (!global.constants ||
      !global.constants.dateFormat ||
      !global.jQuery ||
      !global.jQuery.datepicker)
  )
    return this.toLocaleDateString();
  return global.jQuery.datepicker.formatDate(
    f || global.constants.dateFormat,
    this
  );
};
Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
Number.prototype.format = function() {
  return this.toFixed(9);
};
Number.prototype.percent = function(n) {
  if (n) return "" + this.toFixed(9) + "%";
  return "" + this + "%";
};
Number.prototype.pad = function(size) {
  let s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};
String.prototype.lower = String.prototype.toLowerCase;
String.prototype.upper = String.prototype.toUpperCase;
String.prototype.lcfirst = function() {
  return this.substr(0, 1).toLowerCase() + this.substr(1);
};
String.prototype.ucfirst = function() {
  return this.substr(0, 1).toUpperCase() + this.substr(1);
};
String.prototype.camel = function() {
  return this.replace(/^([A-Z])|\s([a-z])/g, function(match, p1, p2, offset) {
    if (p2) return ` ${p2.toUpperCase()}`;
    return p1.toLowerCase();
  });
};
Object.omit = _.omit;
Object.isEmpty = _.isEmpty;
/**** default environment variables *****/
process.env.OFT_APP = process.env.APP || "oftien";
process.env.OFT_WEB_NAME = process.env.WEB_NAME || "OfTien";
process.env.OFT_WEB_AUTHOR =
  process.env.WEB_AUTHOR || "Phi Tien<im.phitien@gmail.com>";
process.env.OFT_WEB_KEYWORDS =
  process.env.WEB_KEYWORDS || "OfTien Framework, ReactJS";
process.env.OFT_WEB_DESCRIPTION =
  process.env.WEB_DESCRIPTION || "OfTien Framework, ReactJS";
process.env.OFT_LOGO = process.env.LOGO || "/static/icons/logo_vJi_5.ico";
process.env.OFT_DEFAULT_PATH = process.env.DEFAULT_PATH || "/";
process.env.OFT_DATE_FORMAT = process.env.DATE_FORMAT || "d/m/yy";
process.env.OFT_THEME = process.env.THEME || "black";

process.env.OFT_TOKEN_NAME = process.env.TOKEN_NAME || "oftien-token";

process.env.OFT_NOTIFICATION_TIMEOUT = process.env.NOTIFICATION_TIMEOUT || 7000;

process.env.OFT_UI_ORIGIN = `${process.env.OFT_UI_PROTOCOL}://${
  process.env.OFT_UI_DOMAIN
}`;
process.env.OFT_UI_BASE_URL = `${process.env.OFT_UI_ORIGIN}:${
  process.env.OFT_UI_PORT
}`;

process.env.OFT_BE_ORIGIN = `${process.env.OFT_BE_PROTOCOL}://${
  process.env.OFT_BE_DOMAIN
}`;
process.env.OFT_BE_BASE_URL = `${process.env.OFT_BE_ORIGIN}:${
  process.env.OFT_BE_PORT
}`;

process.env.OFT_SOCKET_URL = `${process.env.OFT_UI_ORIGIN}:${
  process.env.OFT_SOCKET_PORT
}`;

process.env.OFT_MODELS_MIGRATE = process.env.MODELS_MIGRATE || "safe";
process.env.OFT_LOG_LEVEL = process.env.LOG_LEVEL || "debug";
process.env.OFT_ACTIVATION_REQUIRED = process.env.ACTIVATION_REQUIRED || false;
process.env.OFT_MAX_AGE = process.env.MAX_AGE || 24 * 60 * 60 * 1000;
process.env.OFT_SESSION_BUFFER = process.env.SESSION_BUFFER || 60 * 1000;
process.env.OFT_HTTP_CACHE =
  process.env.HTTP_CACHE || 365.25 * 24 * 60 * 60 * 1000;
process.env.OFT_FILE_UPLOAD_SIZE = process.env.FILE_UPLOAD_SIZE || 4000000;
process.env.OFT_EMAIL_REG = process.env.EMAIL_REG || ".+";

const key = "OFT_";
const keyReg = new RegExp(`^${key}.+`);
const skey = "OFTS_";
const skeyReg = new RegExp(`^${skey}.+`);
Object.keys(process.env).reduce((rs, o) => {
  const v = process.env[o];
  if (keyReg.test(o)) {
    const k = o
      .substr(key.length)
      .split("_")
      .map(o => o.lower().ucfirst())
      .join("")
      .lcfirst();
    process.env[k] = process.env[`REACT_APP_${k}`] = v;
  } else if (skeyReg.test(o)) {
    const k = o
      .substr(skey.length)
      .split("_")
      .map(o => o.lower().ucfirst())
      .join("")
      .lcfirst();
    process.env[k] = v;
  }
  return rs;
}, {});

const rkey = "REACT_APP_";
const rkeyReg = new RegExp(`^${rkey}.+`);
global.constants = Object.keys(process.env)
  .filter(o => rkeyReg.test(o))
  .reduce((rs, o) => {
    const v = process.env[o];
    const k = o.substr(rkey.length);
    rs[k] = v;
    return rs;
  }, {});
