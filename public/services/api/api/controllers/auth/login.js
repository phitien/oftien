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
    },
    rememberMe: {
      description: "Whether to extend the lifetime of the user's session.",
      extendedDescription: `Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
    requests over WebSockets instead of HTTP).`,
      type: "boolean"
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { req, res } = this;
    const { username, password, rememberMe } = inputs;
    const user = await UserService.login({
      username,
      password,
      rememberMe
    });
    await sails.helpers.userUpdate.with({ user, req, res });
    if (rememberMe) {
      if (this.req.isSocket) {
        sails.log.warn(
          "Received `rememberMe: true` from a virtual request, but it was ignored\n" +
            "because a browser's session cookie cannot be reset over sockets.\n" +
            "Please use a traditional HTTP request instead."
        );
      } else {
        this.req.session.cookie.maxAge =
          sails.config.custom.rememberMeCookieMaxAge;
      }
    } //ﬁ
    const tokenName = BaseService.tokenName();
    return exits.success({ ...user, [tokenName]: user.token });
  }
};
