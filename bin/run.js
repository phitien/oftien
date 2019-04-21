#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");

// process.on("unhandledRejection", err => {
//   console.log(err.message);
//   throw err;
// });
const run = async function() {
  const spawn = require("react-dev-utils/crossSpawn");
  const args = process.argv.slice(3);

  const scriptIndex = args.findIndex(
    x => x === "build" || x === "eject" || x === "start" || x === "test"
  );

  const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
  const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

  const configFile = "webpack.config.js";
  const originalConfigDir = path.dirname(
    require.resolve(`react-scripts/config/${configFile}`)
  );
  const configDir = path.dirname(require.resolve(`./${configFile}`));
  try {
    if (!fs.existsSync(`${configDir}/${configFile}.bak`))
      fs.copySync(
        `${originalConfigDir}/${configFile}`,
        `${configDir}/${configFile}.bak`,
        { overwrite: true }
      );
    fs.copySync(
      `${configDir}/${configFile}`,
      `${originalConfigDir}/${configFile}`,
      {
        overwrite: true
      }
    );
  } catch (e) {
    console.log(e);
  }
  const app = process.env.REACT_APP_APP;
  const appsDir = path.resolve(__dirname, `../src/apps`);
  const appsBakDir = path.resolve(__dirname, `../.tmp/apps`);
  const publicDir = path.resolve(__dirname, `../public`);
  const tmpDir = path.resolve(__dirname, `../.tmp`);
  const archiveDir = path.resolve(__dirname, `../archive`);
  const revertApps = () =>
    fs
      .readdirSync(appsBakDir)
      .filter(o => fs.statSync(path.join(appsBakDir, o)).isDirectory())
      .map(o => {
        fs.renameSync(`${appsBakDir}/${o}`, `${appsDir}/${o}`);
      });
  const revertToOrigin = () => {
    revertApps();
    if (fs.existsSync(`${tmpDir}/index.html`)) {
      fs.renameSync(`${publicDir}/index.html`, `${publicDir}/index.ejs`);
      fs.renameSync(`${tmpDir}/index.html`, `${publicDir}/index.html`);
    }
  };
  revertToOrigin();
  if (script === "build") {
    process.env.NODE_ENV = "production";
    process.env.BABEL_ENV = "production";
    fs.readdirSync(appsDir)
      .filter(
        o => o !== app && fs.statSync(path.join(appsDir, o)).isDirectory()
      )
      .map(o => {
        fs.renameSync(`${appsDir}/${o}`, `${appsBakDir}/${o}`);
      });
    fs.renameSync(`${publicDir}/index.html`, `${tmpDir}/index.html`);
    fs.renameSync(`${publicDir}/index.ejs`, `${publicDir}/index.html`);
    !fs.existsSync(archiveDir) && fs.mkdirSync(archiveDir);
    const dist = `${archiveDir}/${app}`;
    fs.removeSync(dist);
  }
  const result = spawn.sync(
    "node",
    nodeArgs
      .concat(require.resolve(`react-scripts/scripts/${script}`))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: "inherit" }
  );
  fs.copySync(
    `${configDir}/${configFile}.bak`,
    `${originalConfigDir}/${configFile}`,
    { overwrite: true }
  );
  if (script === "build") {
    revertToOrigin();
    const dist = `${archiveDir}/${app}`;
    const buildDir = path.resolve(__dirname, "../build");
    const content = fs.readFileSync(`${buildDir}/index.html`, "utf8");
    fs.writeFileSync(
      `${buildDir}/index.html`,
      content
        .replace(/{{oftien}}/g, "<oftien")
        .replace(/{{\/oftien}}/g, "oftien>")
    );
    fs.renameSync(`${buildDir}/index.html`, `${buildDir}/index.ejs`);
    fs.renameSync(buildDir, dist);
  }
  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        "The build failed because the process exited too early. " +
          "This probably means the system ran out of memory or someone called " +
          "`kill -9` on the process."
      );
    } else if (result.signal === "SIGTERM") {
      console.log(
        "The build failed because the process exited too early. " +
          "Someone might have called `kill` or `killall`, or the system could " +
          "be shutting down."
      );
    }

    process.exit(1);
  }
  process.exit(result.status);
};
module.exports = async function() {};

module.exports.run = run;
