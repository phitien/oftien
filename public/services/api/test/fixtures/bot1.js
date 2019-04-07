module.exports = {
  atomic: true,
  name: "Dummy Bot 1 for Product Controller test",
  description: "Dummy bot 1 description",
  executor: { script: "dummy_exe1", type: "tagui" },
  parameters: [
    { name: "Bot1's Param1", value: "Bot1's Param1's default value" }
  ]
};
