/**********************************************************************/
require("../bootstrap");
process.env.PORT = process.env.uiPort;
process.env.HOST = process.env.uiDomain;
const chalk = require("chalk");
console.log(
  chalk.cyan(
    `ENV: ${chalk.yellow(process.env.ENV)} - ${chalk.white(
      "frontend"
    )} - ${chalk.white(process.env.PORT)}`
  )
);
/**********************************************************************/
const express = require("express");
const app = express();
const port = process.env.PORT;
const setupProxy = require("./setupProxy");

const notFounds = [
  "/node_modules/*",
  "/routes",
  "/services",
  "/services/*",
  "/index.html",
  "/server.js",
  "/setupProxy.js",
  "/package-lock.json",
  "/package.json",
  "/yarn.lock"
];
notFounds.map(o => {
  app.all(o, (req, res) => {
    res.status(404).send("Not found");
  });
});
app.use(express.static(__dirname));
app.use("/", express.static(__dirname + "/"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

setupProxy(app);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
