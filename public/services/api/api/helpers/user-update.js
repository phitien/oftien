module.exports = {
  friendlyName: "User Update",
  description: "User Update",
  extendedDescription: ``,
  inputs: {
    user: {
      description: "User Object",
      type: "ref",
      required: true
    },
    req: {
      description: "Request Object",
      type: "ref",
      required: true
    },
    res: {
      description: "Response Object",
      type: "ref",
      required: true
    }
  },
  exits: {},
  fn: async function(inputs, exits) {
    const { user, req, res } = inputs;
    const tokenName = BaseService.tokenName();
    res.set(tokenName, user.token);
    const { sessionBuffer } = sails.config.custom;
    const now = Date.now();
    if (!user.lastSeenAt || user.lastSeenAt < now - sessionBuffer)
      await UserService.setLastSeen(user, now);
    req.me = UserService.currentUser = user;
    if (user.status === "unconfirmed") user.dontDisplayAccountLinkInNav = true;
    if (req.method === "GET") {
      // Exclude any fields corresponding with attributes that have `protect: true`.
      var sanitizedUser = _.extend({}, user);
      for (let attrName in User.attributes) {
        if (User.attributes[attrName].protect) delete sanitizedUser[attrName];
      } //∞
      if (sanitizedUser.password) delete sanitizedUser.password;
      res.locals.me = sanitizedUser;
    } //ﬁ
    return exits.success({});
  }
};
