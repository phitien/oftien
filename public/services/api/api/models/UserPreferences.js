module.exports = {
  attributes: {
    nameFormat: {
      type: "string",
      defaultsTo: "title, familyName middleName givenName",
      example: "Mr, Phi Duc Tien"
    },
    homepage: {
      type: "string",
      defaultsTo: "/",
      example: "/dashboard"
    },
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
