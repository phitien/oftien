module.exports = {
  friendlyName: "Register",

  description: "Register",

  extendedDescription: ``,

  inputs: {
    username: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: "string",
      required: true
    },
    password: {
      description:
        'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { req, res } = this;
    const { username, password } = inputs;
    const user = await UserService.register({ username, password });
    await sails.helpers.userUpdate.with({ user, req, res });
    const tokenName = BaseService.tokenName();
    return exits.success({ ...user, [tokenName]: user.token });
  }
};
