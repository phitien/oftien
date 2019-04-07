module.exports = {
  friendlyName: "Forgot",

  description: "Forgot",

  extendedDescription: ``,

  inputs: {
    username: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { username } = inputs;
    return exits.success(await UserService.forgot({ username }));
  }
};
