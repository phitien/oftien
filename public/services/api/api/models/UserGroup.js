module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      unique: true
    },
    description: {
      type: "string"
    },
    users: {
      collection: "User",
      via: "groups"
    },
    actions: {
      collection: "UserAction",
      via: "groups"
    }
  },
  customToJSON: function() {
    const rs = { ...this };
    return _.omit(rs, "createdAt", "updatedAt");
  }
};
