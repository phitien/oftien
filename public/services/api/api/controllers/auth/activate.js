module.exports = {
  friendlyName: "Activate",

  description: "Activate",

  extendedDescription: ``,

  inputs: {
    token: {
      type: "string",
      required: true
    },
    username: {
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { req, res } = this;
    const { token, username } = inputs;
    const user = await UserService.activate({ token, username });
    await sails.helpers.userUpdate.with({ user, req, res });
    const tokenName = BaseService.tokenName();
    return exits.success({ ...user, [tokenName]: user.token });
  }
};
