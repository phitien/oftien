module.exports = {
  attributes: {
    type: { type: "string", example: "Databases" },
    name: { type: "string", example: "MySQL, MongoDB" },
    description: { type: "string", example: "" },
    owner: {
      model: "User",
      required: true
    }
  },
  customToJSON: function() {
    const rs = { ...this };
    return _.omit(rs, "createdAt", "updatedAt");
  }
};
