module.exports = {
  friendlyName: "User Detail",

  description: "User Detail.",

  inputs: {
    id: {
      description: "User id",
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(await UserService.detailById(inputs.id));
  }
};
