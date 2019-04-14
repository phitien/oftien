module.exports = {
  friendlyName: "Change User Profile",

  description: "Change User Profile.",

  inputs: {
    id: {
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { id } = inputs;
    const user = await UserService.detailById(id);
    if (!user) throw new errors.NotFoundError("User not found");
    const { req } = this;
    const { body } = req;
    const data = {};
    for (let name in UserProfile.attributes) {
      if (body.hasOwnProperty(name)) data[name] = body[name];
    }
    return exits.success(await UserService.profileupdate(user, data));
  }
};
