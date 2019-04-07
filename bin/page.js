#!/usr/bin/env node
/** Create page **/
const mkpage = async function(pname, page) {
  const fs = require("fs-extra");
  if (!pname) pname = process.argv[3];
  if (!page) page = process.argv[4];
  if (!pname) throw new Error("Package is missing");
  if (!page) throw new Error("Page is missing");
  const pagesDir = "./src/pages";
  const spname = pname.lower();
  const ppath = `${pagesDir}/${spname}`;
  pname = pname.ucfirst();
  const heading = page;
  page = page
    .camel()
    .replace(/\W/g, "_")
    .ucfirst();
  const spage = page.lower();
  if (!fs.existsSync(ppath)) {
    await fs.mkdirSync(ppath);
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
  }
  if (fs.existsSync(`${ppath}/${page}.js`))
    throw new Error(`Page ${page} exists at ${ppath}/${page}.js`);
  const jscontent = fs.readFileSync(
    `${__dirname}/templates/package/Page.js`,
    "utf8"
  );
  await fs.writeFileSync(
    `${ppath}/${page}.js`,
    jscontent
      .replace(/\{\{\s*PName\s*\}\}/g, pname)
      .replace(/\{\{\s*pname\s*\}\}/g, spname)
      .replace(/\{\{\s*Page\s*\}\}/g, page)
      .replace(/\{\{\s*page\s*\}\}/g, spage)
      .replace(/\{\{\s*heading\s*\}\}/g, heading)
  );
  const csscontent = fs.readFileSync(
    `${__dirname}/templates/package/style.scss`,
    "utf8"
  );
  await fs.writeFileSync(
    `${ppath}/${spage}.scss`,
    csscontent
      .replace(/\{\{\s*PName\s*\}\}/g, pname)
      .replace(/\{\{\s*pname\s*\}\}/g, spname)
      .replace(/\{\{\s*Page\s*\}\}/g, page)
      .replace(/\{\{\s*page\s*\}\}/g, spage)
      .replace(/\{\{\s*heading\s*\}\}/g, heading)
  );
  const idxlines =
    (fs.existsSync(`${ppath}/index.js`) &&
      fs
        .readFileSync(`${ppath}/index.js`, "utf8")
        .split("\n")
        .filter(o => o && !o.includes(`"./${page}"`))) ||
    [];
  idxlines.push(`export { default as ${page} } from "./${page}";`);
  await fs.writeFileSync(`${ppath}/index.js`, idxlines.join("\n"));
  console.log(`Page ${page} is created at ${ppath}, package ${pname}`);
};
/** Remove page **/
const rmpage = async function(pname, page) {
  const fs = require("fs-extra");
  if (!pname) pname = process.argv[3];
  if (!page) page = process.argv[4];
  if (!pname) throw new Error("Package is missing");
  if (!page) throw new Error("Page is missing");
  const pagesDir = "./src/pages";
  const spname = pname.lower();
  const ppath = `${pagesDir}/${spname}`;
  pname = pname.ucfirst();
  const heading = page;
  page = page
    .camel()
    .replace(/\W/g, "_")
    .ucfirst();
  const spage = page.lower();
  if (!fs.existsSync(ppath))
    throw new Error(`Package ${spname} does not exist`);
  const idxlines =
    (fs.existsSync(`${ppath}/index.js`) &&
      fs
        .readFileSync(`${ppath}/index.js`, "utf8")
        .split("\n")
        .filter(o => o && !o.includes(`"./${page}"`))) ||
    [];
  await fs.writeFileSync(`${ppath}/index.js`, idxlines.join("\n"));
  await fs.removeSync(`${ppath}/${page}.js`);
  await fs.removeSync(`${ppath}/${spage}.scss`);
};
/** mkpage **/
module.exports = async function() {};

module.exports.mkpage = mkpage;
module.exports.rmpage = rmpage;
