module.exports = {
  attributes: {
    name: { type: "string", example: "Left_Main_Right" },
    top: { type: "string", example: "" },
    bottom: { type: "string", example: "" },
    left: { type: "string", example: "" },
    right: { type: "string", example: "" },
    main: { type: "string", example: "" },
    owner: {
      model: "User",
      required: true,
      unique: true
    }
  },
  customToJSON: function() {
    const rs = { ...this };
    return _.omit(rs, "createdAt", "updatedAt");
  }
};
