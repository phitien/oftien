module.exports = {
  friendlyName: "Action Detail",

  description: "Action Detail.",

  inputs: {
    id: {
      description: "Action id",
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    return exits.success(await UserActionService.detail(inputs.id));
  }
};
