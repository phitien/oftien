module.exports = {
  friendlyName: "List",

  description: "List group.",

  inputs: {},

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(await UserGroupService.allExcept());
  }
};
