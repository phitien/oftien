module.exports = {
  attributes: {
    company: { type: "string", example: "PureCode" },
    role: { type: "string", example: "Co-Founder, CTO" },
    start: { type: "string", example: "Mar 2018" },
    end: { type: "string", example: "Present" },
    location: { type: "string", example: "Vietnam" },
    description: {
      type: "string",
      example:
        "Start his first own company in Mar 2018, in AI Shop product and Trading Platform, and outsourcing service"
    },
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
