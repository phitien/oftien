module.exports = {
  friendlyName: "Logout",

  description: "Logout",

  extendedDescription: ``,

  inputs: {
    token: {
      type: "string"
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    let { token } = inputs;
    const tokenName = BaseService.tokenName();
    if (!token) token = this.req.get(tokenName);
    token = await UserService.logout({ token });
    await this.res.set(tokenName, "");
    return exits.success({ [tokenName]: "" });
  }
};
