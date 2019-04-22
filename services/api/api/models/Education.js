module.exports = {
  attributes: {
    name: { type: "string", example: "Hanoi Water Resources University" },
    period: { type: "string", example: "2002 -2007" },
    degree: { type: "string", example: "Bachelor of Computer Science" },
    description: { type: "string", example: "Information Technology" },
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
