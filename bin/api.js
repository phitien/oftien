#!/usr/bin/env node
/** Create api **/
const mkapi = async function(api, page) {
  const fs = require("fs-extra");
  if (!api) api = process.argv[3];
  if (!api) throw new Error("API is missing");
  api = api
    .replace(/[\W_]/g, " ")
    .camel()
    .replace(/\W/g, "_")
    .lower();
  const dir = "./public/api";
  if (fs.existsSync(`${dir}/${api}.js`))
    throw new Error(`API ${api} exists at ${dir}/${api}.js`);
  const content = fs.readFileSync(`${__dirname}/templates/api.js`, "utf8");
  await fs.writeFileSync(
    `${dir}/${api}.js`,
    content.replace(/\{\{\s*api\s*\}\}/g, api.lcfirst())
  );
  const lines = fs
    .readFileSync(`${dir}/index.js`, "utf8")
    .split("\n")
    .filter(o => o && o.includes("require") && !o.includes(`"./${api}"`));
  lines.unshift(`  require("./${api}"),`);
  lines.unshift(`module.exports = [`);
  lines.push(`];`);
  await fs.writeFileSync(`${dir}/index.js`, lines.join("\n"));
  console.log(
    `API ${api} is created at ${dir}/${api}.js, please restart your server to get updates`
  );
};
/** Remove api **/
const rmapi = async function(api, page) {
  const fs = require("fs-extra");
  if (!api) api = process.argv[3];
  if (!api) throw new Error("API is missing");
  api = api
    .replace(/[\W_]/g, " ")
    .camel()
    .replace(/\W/g, "_")
    .lower();
  const dir = "./public/api";
  const lines = fs
    .readFileSync(`${dir}/index.js`, "utf8")
    .split("\n")
    .filter(o => o && o.includes("require") && !o.includes(`"./${api}"`));
  await fs.writeFileSync(`${dir}/index.js`, lines.join("\n"));
  await fs.removeSync(`${dir}/${api}.js`);
  console.log(
    `API ${api} is removed, please restart your server to get updates`
  );
}; /** mkapi **/
module.exports = async function() {};

module.exports.mkapi = mkapi;
module.exports.rmapi = rmapi;
