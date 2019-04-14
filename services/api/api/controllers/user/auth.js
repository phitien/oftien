module.exports = {
  friendlyName: "Authenticate",

  description: "Authenticate",

  extendedDescription: ``,

  inputs: {
    token: {
      type: "string"
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { req, res } = this;
    const { me } = req;
    const user = await UserService.auth({ token: me.token });
    await sails.helpers.userUpdate.with({ user, req, res });
    const tokenName = BaseService.tokenName();
    return exits.success({ ...user, [tokenName]: user.token });
  }
};
