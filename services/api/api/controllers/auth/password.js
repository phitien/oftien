module.exports = {
  friendlyName: "Password",

  description: "Password",

  extendedDescription: ``,

  inputs: {
    token: {
      type: "string",
      required: true
    },
    username: {
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
    const { token, username, password, confirmed } = inputs;
    const user = await UserService.password({
      token,
      username,
      password,
      confirmed
    });
    return exits.success(user);
  }
};
