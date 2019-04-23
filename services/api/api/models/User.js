module.exports = {
  attributes: {
    name: {
      type: "string"
    },
    email: {
      type: "string",
      unique: true,
      isEmail: true,
      example: "dev@oftien.com"
    },
    username: {
      type: "string",
      unique: true
    },
    password: {
      type: "string",
      required: true,
      description:
        "Securely hashed representation of the user's login password.",
      protect: true
    },
    forgotToken: { type: "string" }, //forgot password token
    token: { type: "string" }, //session token
    proofToken: { type: "string" }, //activation token
    status: {
      type: "string",
      isIn: ["unconfirmed", "changeRequested", "confirmed", "forced", "banned"],
      defaultsTo: "unconfirmed",
      description: "The confirmation status of the user's email address.",
      extendedDescription: `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "changeRequested"
email status until they click the link in the confirmation email.`
    },
    lastSeenAt: { type: "number" },
    isSuperAdmin: { type: "boolean", defaultsTo: false },
    profile: { model: "UserProfile" },
    preferences: { model: "UserPreferences" },
    setting: { model: "Setting" },
    layouts: { collection: "Layout" },
    contacts: { collection: "Contact" },
    educations: { collection: "Education" },
    experiences: { collection: "Experience" },
    projects: { collection: "Project" },
    skills: { collection: "Skill" },
    groups: { collection: "UserGroup", via: "users" },
    actions: { collection: "UserAction", via: "users" }
  },
  customToJSON: function() {
    const rs = { ...this };
    return _.omit(rs, "name", "createdAt", "updatedAt", "password");
  }
};
