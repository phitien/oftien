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
    active: {
      type: "boolean",
      defaultsTo: true
    },
    groups: {
      collection: "UserGroup",
      via: "actions"
    },
    users: {
      collection: "User",
      via: "actions"
    }
  },
  customToJSON: function() {
    const rs = { ...this };
    return _.omit(rs, "createdAt", "updatedAt");
  }
};
