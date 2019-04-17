require("dotenv").config();
require("./settings");
process.env.PORT = process.env.REACT_APP_UI_PORT || 2810;
const chalk = require("chalk");
console.log(
  chalk.cyan(`${chalk.white("frontend")} - ${chalk.white(process.env.PORT)}`)
);
/**********************************************************************/
const express = require("express");
const app = express();
const port = process.env.PORT;
const setupProxy = require("./setupProxy");

const notFounds = [
  "/node_modules",
  "/routes",
  "/routes",
  "/services",
  "/index.html",
  "/server.js",
  "/setupProxy.js",
  "/settings.js",
  "/package-lock.json",
  "/package.json",
  "/yarn.lock"
];
app.use(express.static(__dirname));
app.use("/", express.static(__dirname + "/"));
notFounds.map(o => {
  app.all(o, (req, res) => {
    res.status(404).send("Not found");
  });
});
setupProxy(app);
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));
