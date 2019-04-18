module.exports = function(app, uploader, bodyParser) {
  const fs = require("fs-extra");
  const path = require("path");
  const cvDir = path.join(
    app.rootDir,
    "../",
    app.staticDir
      ? `${app.staticDir}/static/apps/oftien/cv`
      : "./public/static/apps/oftien/cv"
  );

  const body = bodyParser.json();
  /** get resume **/
  app.get("/api/v2/resume/:username", async function(req, res, next) {
    const { username } = req.params;
    if (!username) return res.status(404).json({ message: "Missing Username" });
    const filepath = path.join(cvDir, `${username}.json`);
    if (fs.existsSync(filepath)) return res.sendFile(filepath);
    else return res.sendFile(path.join(cvDir, `../sample.resume.json`));
  });
  /** save resume **/
  app.post("/api/v2/resume/:username", body, async function(req, res, next) {
    const { username } = req.params;
    const resume = req.body;
    if (!resume) return res.status(500).json({ message: `Missing data` });
    const filepath = path.join(cvDir, `${username}.json`);
    if (username !== resume.username && fs.existsSync(filepath))
      return res
        .status(500)
        .json({ message: `User name ${username} is already taken` });
    fs.writeFileSync(filepath, JSON.stringify(resume));
    return res.json(req.body);
  });
};
