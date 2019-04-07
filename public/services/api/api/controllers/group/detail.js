module.exports = {
  friendlyName: "Group Detail",

  description: "Group Detail.",

  inputs: {
    id: {
      description: "Group id",
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(await UserGroupService.detail(inputs.id));
  }
};
