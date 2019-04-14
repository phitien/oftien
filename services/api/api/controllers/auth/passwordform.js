module.exports = {
  friendlyName: "Change Password Form",

  description: "Change Password Form",

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

  exits: {
    success: {
      responseType: "view",
      viewTemplatePath: "auth/forgot-password"
    }
  },

  fn: async function(inputs, exits) {
    const { token, username } = inputs;
    return exits.success({ token, username });
  }
};
