#!/usr/bin/env node
/** Serve website **/
process.on("unhandledRejection", err => {
  throw err;
});
const serve = async function() {
  const fs = require("fs");
  const spawn = require("react-dev-utils/crossSpawn");
  const args = process.argv.slice(3);
  const folder = args[0] || "public";
  const nodeArgs = args.slice(0, 1);
  const script = `../${folder}/server`;
  const result = spawn.sync("node", [require.resolve(script), ...nodeArgs], {
    stdio: "inherit"
  });
  if (result.signal) process.exit(1);
  process.exit(result.status);
};
module.exports = async function() {};

module.exports.serve = serve;
