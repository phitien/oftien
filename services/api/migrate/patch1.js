module.exports = {
  description: "Create user actions",
  fn: async function() {
    const usergroups = require("./usergroups").usergroups;
    let actions = Array.from(
      new Set([].concat(...usergroups.map(o => o.actions)).filter(o => o))
    );
    actions.map(async o => {
      const data = { name: o };
      await UserAction.findOrCreate(data, data);
    });
  }
};
