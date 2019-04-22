module.exports = {
  attributes: {
    name: {
      type: "string",
      example: "SOZO Trading Platform for vegetable commodities"
    },
    company: { type: "string", example: "PureCode" },
    role: { type: "string", example: "Architect, Frontend Lead" },
    start: { type: "string", example: "Mar 2018" },
    end: { type: "string", example: "Present" },
    used: {
      type: "string",
      example: "PHP, jQuery, MySQL, Firebase, ReactJs, Html, CSS"
    },
    description: {
      type: "string",
      example: ""
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
