module.exports = {
  friendlyName: "List",

  description: "List product.",

  inputs: {},

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(await UserService.allExcept());
  }
};
