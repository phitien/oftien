module.exports = {
  friendlyName: "Change User Preferences",

  description: "Change User Preferences.",

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
    for (let name in UserPreferences.attributes) {
      if (body.hasOwnProperty(name)) data[name] = body[name];
    }
    return exits.success(await UserService.preferencesupdate(user, data));
  }
};
