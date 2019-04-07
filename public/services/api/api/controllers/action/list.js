module.exports = {
  friendlyName: "List",

  description: "List action.",

  inputs: {},

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(await UserActionService.allExcept());
  }
};
