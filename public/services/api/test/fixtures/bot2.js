module.exports = {
  atomic: true,
  name: "Dummy Bot 2 for Product Controller test",
  description: "Dummy bot 2 description",
  executor: { script: "dummy_exe2", type: "tagui" },
  parameters: [
    { name: "Bot2's Param1", value: "Bot2's Param1's default value" }
  ]
};
