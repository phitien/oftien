const path = require("path");

module.exports = function(app) {
  app.get("/successful", async function(req, res) {
    res.sendFile(path.join(__dirname + "/../public/successful.html"));
  });
};
