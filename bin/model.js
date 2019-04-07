#!/usr/bin/env node
/** Create model **/
const mkmodel = async function(model, page) {
  const fs = require("fs-extra");
  if (!model) model = process.argv[3];
  if (!model) throw new Error("Model is missing");
  model = model
    .replace(/[\W_]/g, " ")
    .camel()
    .replace(/\W/g, "_")
    .ucfirst();
  const dir = "./src/models";
  if (fs.existsSync(`${dir}/${model}.js`))
    throw new Error(`Model ${model} exists at ${dir}/${model}.js`);
  const content = fs.readFileSync(`${__dirname}/templates/model.js`, "utf8");
  await fs.writeFileSync(
    `${dir}/${model}.js`,
    content.replace(/\{\{\s*model\s*\}\}/g, model.lcfirst())
  );
  const lines = fs
    .readFileSync(`${dir}/index.js`, "utf8")
    .split("\n")
    .filter(o => o && !o.includes(`"./${model}"`));
  lines.push(`export { default as ${model} } from "./${model}";`);
  await fs.writeFileSync(`${dir}/index.js`, lines.join("\n"));
  console.log(`Model ${model} is created at ${dir}/${model}.js`);
};
/** Remove model **/
const rmmodel = async function(model, page) {
  const fs = require("fs-extra");
  if (!model) model = process.argv[3];
  if (!model) throw new Error("Model is missing");
  model = model
    .replace(/[\W_]/g, " ")
    .camel()
    .replace(/\W/g, "_")
    .ucfirst();
  const dir = "./src/models";
  const lines = fs
    .readFileSync(`${dir}/index.js`, "utf8")
    .split("\n")
    .filter(o => o && !o.includes(`"./${model}"`));
  await fs.writeFileSync(`${dir}/index.js`, lines.join("\n"));
  await fs.removeSync(`${dir}/${model}.js`);
  console.log(`Model ${model} is removed`);
}; /** mkmodel **/
module.exports = async function() {};

module.exports.mkmodel = mkmodel;
module.exports.rmmodel = rmmodel;
