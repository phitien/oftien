module.exports = {
  friendlyName: "Profile Update",

  description: "Profile Update",

  extendedDescription: ``,

  inputs: {},

  exits: {},

  fn: async function(inputs, exits) {
    const { req, res } = this;
    const { body, me } = req;
    const data = {};
    for (let name in UserProfile.attributes) {
      if (body.hasOwnProperty(name)) data[name] = body[name];
    }
    const user = await UserService.profileupdate(me, data);
    await sails.helpers.userUpdate.with({ user, req, res });
    return exits.success(this.req.me);
  }
};
