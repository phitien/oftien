module.exports = {
  friendlyName: "Change User Groups",

  description: "Change User Groups.",

  inputs: {
    id: {
      type: "string",
      required: true
    },
    groups: {
      type: "ref",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { id, groups } = inputs;
    const user = await UserService.detailById(id);
    if (!user) throw new errors.NotFoundError("User not found");
    await UserService.removeFromGroups(user.id, user.groups.map(o => o.id));
    await Promise.all(
      []
        .concat(groups)
        .filter(o => o)
        .map(o => UserService.addToGroup(user.id, o))
    );
    return exits.success({ ok: true });
  }
};
