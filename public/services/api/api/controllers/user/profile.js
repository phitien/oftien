module.exports = {
  friendlyName: "Profile",

  description: "Profile",

  extendedDescription: ``,

  inputs: {},

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(this.req.me);
  }
};
