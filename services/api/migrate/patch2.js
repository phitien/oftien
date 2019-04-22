module.exports = {
  description: "Create user groups",
  fn: async function() {
    const usergroups = [].merge(require("./usergroups").usergroups);
    usergroups.map(async o => {
      const { data, actions } = o;
      const group = await UserGroup.findOrCreate(data, { ...data });
      //add group actions
      Array.from(new Set([].concat(actions).filter(o => o))).map(async name => {
        const action = await UserAction.findOrCreate({ name }, { name });
        await UserGroupService.addAction(group.id, action.id);
      });
    });
  }
};
