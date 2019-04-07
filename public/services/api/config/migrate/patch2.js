module.exports = {
  description: "Create groups and default group users",
  uniqueArray: function(arr) {
    return Array.from(new Set([].concat(...arr).filter(o => o)));
  },
  groupCreationFn: async function(usergroups) {
    if (usergroups.length) {
      const { data, actions } = usergroups.shift();
      const group = await UserGroup.findOrCreate(data, { ...data });
      let username = group.name.replace(/[\W]/gi, "_").toLowerCase();
      username = `dev+${username}@amaris.ai`;
      const password = username;
      const user = await UserService.forceCreate({
        username,
        password
      });
      await UserService.addToGroup(user.id, group.id);
      //add group actions
      Array.from(new Set([].concat(actions).filter(o => o))).map(async name => {
        const action = await UserAction.findOrCreate({ name }, { name });
        await UserGroupService.addAction(group.id, action.id);
      });
      await module.exports.groupCreationFn(usergroups);
    }
  },
  fn: async function() {
    const usergroups = require("../usergroups").usergroups;
    await module.exports.groupCreationFn(usergroups);
  }
};
