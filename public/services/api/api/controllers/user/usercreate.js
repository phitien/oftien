module.exports = {
  friendlyName: "Create User",

  description: "Create User.",

  inputs: {
    username: {
      type: "string",
      isEmail: true,
      required: true
    },
    password: {
      type: "string",
      required: true
    },
    confirmed: {
      type: "string",
      required: true
    },
    groups: {
      type: "ref",
      required: true
    },
    profile: {
      type: "ref",
      required: true
    },
    preferences: {
      type: "ref",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { username, password, confirmed } = inputs;
    if (password !== confirmed)
      throw new errors.AppError("Passwords don't match");
    const { groups, profile, preferences } = inputs;
    if (!groups.length) throw new errors.AppError("No groups assigned");
    return exits.success(
      await UserService.forceCreate({
        username,
        password,
        groups,
        profile,
        preferences
      })
    );
  }
};
