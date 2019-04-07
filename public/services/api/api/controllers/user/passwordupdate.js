module.exports = {
  friendlyName: "Change Self Password",

  description: "Change Self Password.",

  inputs: {
    current: {
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
    const { current, password, confirmed } = inputs;
    let user = UserService.currentUser;
    if (!user) throw new errors.NotFoundError("User not found");
    const { username } = user;
    try {
      user = await UserService.login({ username, password: current });
    } catch (e) {
      throw new errors.AppError("Wrong password");
    }
    if (password !== confirmed)
      throw new errors.AppError("Passwords don't match");
    await UserService.setUserPassword(user, password);
    return exits.success({ ok: true });
  }
};
