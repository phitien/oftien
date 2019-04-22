module.exports = {
  attributes: {
    profile: { type: "string", defaultsTo: "occupation,quote,intro,funny" },
    contact: {
      type: "string",
      defaultsTo:
        "website,github,email,skype,mobile,phone,address,address1,address2,state,country"
    },
    avatarStyle: { type: "string", example: "margin: 0 -18px" },
    layout: { type: "string", defaultsTo: "Left_Main_Right" },
    fontFamily: { type: "string", defaultsTo: "roboto-condensed, sans-serif" },
    fontWeight: { type: "string", defaultsTo: "500" },
    fontSize: { type: "string", defaultsTo: "14px" },
    leftWidth: { type: "string", defaultsTo: "280px" },
    rightWidth: { type: "string", defaultsTo: "280px" },
    width: { type: "string", defaultsTo: "1024px" },
    clPrimary: { type: "string", defaultsTo: "#06a4df" },
    clPrimary2: { type: "string", defaultsTo: "#3883fa" },
    clSecondary: { type: "string", defaultsTo: "#9acd32" },
    clSecondary2: { type: "string", defaultsTo: "#86c700" },
    clText: { type: "string", defaultsTo: "#000000" },
    bgBody: { type: "string", defaultsTo: "#ffffff" },
    style: { type: "string", defaultsTo: "" },
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
