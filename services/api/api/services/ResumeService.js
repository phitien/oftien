const CONFIG = require("./BaseService");

module.exports = Object.assign({}, CONFIG, {
  model: () => User,
  attrs: () => ["id", "username", "password"],
  detail: async function(username) {
    const resume = await User.findOne({ username })
      .populate("profile")
      .populate("setting")
      .populate("contacts")
      .populate("educations")
      .populate("experiences")
      .populate("projects")
      .populate("skills")
      .populate("layouts");
    return resume;
  }
});
