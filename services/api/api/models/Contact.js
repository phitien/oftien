module.exports = {
  attributes: {
    type: {
      type: "string",
      isIn: [
        "mobile",
        "phone",
        "email",
        "github",
        "skype",
        "whatsapp",
        "viber",
        "facebook",
        "linkedin",
        "wechat",
        "line",
        "zalo",
        "website",
        "address",
        "address1",
        "address2",
        "state",
        "postcode",
        "locaton",
        "country"
      ]
    },
    query: { type: "string" },
    value: { type: "string" },
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
