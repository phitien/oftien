module.exports = {
  friendlyName: "Resume",
  description: "Resume",
  extendedDescription: ``,
  inputs: {},
  exits: {},
  fn: async function(inputs, exits) {
    const { username } = inputs;
    return exits.success(await ResumeService.detail(username));
  }
};
