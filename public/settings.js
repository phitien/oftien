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
