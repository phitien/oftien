const fs = require("fs");
const path = require("path");

module.exports = function(app) {
  app.get("/successful.html", async function(req, res) {
    const { poReference, orderReference } = req.query;
    const filepath = path.join(__dirname + "/../public/successful.html");
    const content = fs.readFileSync(filepath, "utf8");
    res.send(
      content
        .replace(/3831859/g, poReference)
        .replace(/20930290/g, orderReference)
    );
  });
};
