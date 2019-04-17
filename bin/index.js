#!/usr/bin/env node
String.prototype.lower = String.prototype.toLowerCase;
String.prototype.upper = String.prototype.toUpperCase;
String.prototype.lcfirst = function() {
  return this.substr(0, 1).toLowerCase() + this.substr(1);
};
String.prototype.ucfirst = function() {
  return this.substr(0, 1).toUpperCase() + this.substr(1);
};
String.prototype.camel = function() {
  var str = this.replace(/^([A-Z])|\s([a-z])/g, function(
    match,
    p1,
    p2,
    offset
  ) {
    if (p2) return ` ${p2.toUpperCase()}`;
    return p1.toLowerCase();
  });
  return str;
};
const [nodepath, apapath, cmd] = process.argv;
if (cmd === "mkpackage") require("./package").mkpackage();
else if (cmd === "rmpackage") require("./package").rmpackage();
else if (cmd === "mkpage") require("./page").mkpage();
else if (cmd === "rmpage") require("./page").rmpage();
else if (cmd === "mkmodel") require("./model").mkmodel();
else if (cmd === "rmmodel") require("./model").rmmodel();
else if (cmd === "mkapi") require("./api").mkapi();
else if (cmd === "rmapi") require("./api").rmapi();
else if (cmd === "mkservice") require("./service").mkservice();
else if (cmd === "rmservice") require("./service").rmservice();
else if (cmd === "run") require("./run").run();
else if (cmd === "serve") require("./serve").serve();
else
  throw new Error(
    "Missing command, eg: run, build, mkpackage, mkpage, mkmodel...."
  );
