module.exports = function(app, constants, upload, bodyParser) {
  app.post("/api/v1/{{ api }}", async function(req, res, next) {
    return res.json({ name: "{{ api }}" });
  });
};
