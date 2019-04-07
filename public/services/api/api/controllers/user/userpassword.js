module.exports = {
  friendlyName: "Change User Password",

  description: "Change User Password.",

  inputs: {
    id: {
      type: "string",
      required: true
    },
    password: {
      type: "string",
      required: true
    },
    confirmed: {
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { id, password, confirmed } = inputs;
    const user = await UserService.detailById(id);
    if (!user) throw new errors.NotFoundError("User not found");
    if (password !== confirmed)
      throw new errors.AppError("Passwords don't match");
    await UserService.setUserPassword(user, password);
    return exits.success({ ok: true });
  }
};
