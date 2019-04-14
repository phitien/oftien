module.exports = {
  friendlyName: "Preferences Update",

  description: "Preferences Update",

  extendedDescription: ``,

  inputs: {},

  exits: {},

  fn: async function(inputs, exits) {
    const { req, res } = this;
    const { body, me } = req;
    const data = {};
    for (let name in UserPreferences.attributes) {
      if (body.hasOwnProperty(name)) data[name] = body[name];
    }
    const user = await UserService.preferencesupdate(me, data);
    await sails.helpers.userUpdate.with({ user, req, res });
    return exits.success(this.req.me);
  }
};
