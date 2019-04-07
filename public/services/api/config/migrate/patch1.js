module.exports = {
  description: "Create user actions",
  fn: async function() {
    const usergroups = require("../usergroups").usergroups;
    let actions = Array.from(
      new Set([].concat(...usergroups.map(o => o.actions)).filter(o => o))
    );
    const actCreationFn = async function() {
      if (actions.length) {
        const o = { name: actions.shift() };
        await UserAction.findOrCreate(o, o);
        await actCreationFn();
      }
    };
    await actCreationFn();
  }
};
