module.exports = {
  friendlyName: "Create User",

  description: "Create User.",

  inputs: {
    id: {
      type: "string",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    const { id } = inputs;
    await UserService.forceRemove(id);
    return exits.success({ ok: true });
  }
};
