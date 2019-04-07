#!/usr/bin/env node
/** Create service **/
const fs = require("fs-extra");
const mkservice = async function(name, page) {
  if (!name) name = process.argv[3];
  if (!name) throw new Error("Service is missing");
  const service = name
    .replace(/[\W_]/g, " ")
    .camel()
    .replace(/\W/g, "_")
    .lower();
  const rootDir = `./public/services`;
  const dir = `${rootDir}/${service}`;
  if (fs.existsSync(dir))
    throw new Error(`Service ${service} exists at ${dir}`);
  await fs.mkdirSync(dir);
  const content = fs.readFileSync(
    `${__dirname}/templates/service/index.py`,
    "utf8"
  );
  await fs.writeFileSync(
    `${dir}/index.py`,
    content
      .replace(/\{\{\s*service\s*\}\}/g, service)
      .replace(/\{\{\s*Service\s*\}\}/g, name)
  );
  await fs.copySync(`${__dirname}/templates/service/Pipfile`, `${dir}/Pipfile`);
  await fs.copySync(
    `${__dirname}/templates/service/Pipfile.lock`,
    `${dir}/Pipfile.lock`
  );
  const services = require("../public/services/index.js");
  const ports = Object.keys(services)
    .map(o => parseInt(o))
    .filter(o => o);
  const port = Math.max(...ports);
  services[`${ports.length ? port + 1 : 5001}`] = service;
  await fs.writeFileSync(
    `${rootDir}/index.js`,
    `module.exports = ${JSON.stringify(services)}`
  );
  console.log(
    `Service ${service} is created at ${dir}/${service}.js, please restart your server to get updates`
  );
};
/** Remove service **/
const rmservice = async function(name, page) {
  if (!name) name = process.argv[3];
  if (!name) throw new Error("Service is missing");
  const service = name
    .replace(/[\W_]/g, " ")
    .camel()
    .replace(/\W/g, "_")
    .lower();
  const rootDir = `./public/services`;
  const dir = `${rootDir}/${service}`;
  await fs.removeSync(dir);
  const services = require("../public/services/index.js");
  const port = Object.keys(services)
    .map(o => parseInt(o))
    .filter(o => o)
    .find(o => services[`${o}`] === service);
  if (port) delete services[`${port}`];
  await fs.writeFileSync(
    `${rootDir}/index.js`,
    `module.exports = ${JSON.stringify(services)}`
  );
  console.log(
    `Service ${service} is removed, please restart your server to get updates`
  );
}; /** mkservice **/
module.exports = async function() {};

module.exports.mkservice = mkservice;
module.exports.rmservice = rmservice;
