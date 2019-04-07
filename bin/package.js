#!/usr/bin/env node
const fs = require("fs-extra");
const mkpage = require("./page").mkpage;

module.exports = async function() {};
module.exports.mkpackage = async function() {
  const pname = process.argv[3];
  if (!pname) throw new Error("Package is missing");
  const pagesDir = "./src/pages";
  const spname = pname.lower();
  const ppath = `${pagesDir}/${spname}`;
  // fs.removeSync(ppath);
  if (fs.existsSync(ppath))
    throw new Error(`Package ${spname} exists at ${ppath}`);
  await fs.mkdirSync(ppath);
  mkpage(pname, "Dashboard");
  //add package to src/pages/index.js
  const lines = fs
    .readFileSync(`${pagesDir}/index.js`, "utf8")
    .split("\n")
    .filter(o => !o.includes(`${spname},`) && !o.includes(`"./${spname}"`));
  lines.unshift(`import * as ${spname} from "./${spname}";`);
  lines.splice(
    lines.indexOf(
      lines.find(o => o.includes(`/** PACKAGES - Do not remove **/`))
    ),
    1,
    `  /** PACKAGES - Do not remove **/`,
    `  ${spname},`
  );
  await fs.writeFileSync(`${pagesDir}/index.js`, lines.join("\n"));
  console.log(
    `Package ${pname} is created at ${ppath}, with Dashboard as default page`
  );
};
module.exports.rmpackage = async function() {
  const pname = process.argv[3];
  if (!pname) throw new Error("Package is missing");
  const pagesDir = "./src/pages";
  const spname = pname.lower();
  const ppath = `${pagesDir}/${spname}`;
  //remove package to src/pages/index.js
  const lines = fs
    .readFileSync(`${pagesDir}/index.js`, "utf8")
    .split("\n")
    .filter(o => !o.includes(`${spname},`) && !o.includes(`"./${spname}"`));
  await fs.writeFileSync(`${pagesDir}/index.js`, lines.join("\n"));
  try {
    fs.removeSync(ppath);
  } catch (e) {}

  console.log(`Package ${pname} is removed`);
};
