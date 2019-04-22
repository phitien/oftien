module.exports = {
  attributes: {
    gender: {
      type: "string",
      isIn: ["NA", "Male", "Female", "Bio", "None", "Gay", "Les"],
      defaultsTo: "Male"
    },
    title: {
      type: "string",
      example: "Mr, Mrs, Ms, Dr..."
    },
    occupation: { type: "string" },
    quote: { type: "string" },
    intro: { type: "string" },
    funny: { type: "string" },
    author: { type: "string" },
    keywords: { type: "string" },
    description: { type: "string" },
    birthDate: { type: "string", example: "1984-10-28" },
    nationality: { type: "string", example: "Singapore" },
    name: { type: "string", example: "Phi Tien" },
    familyName: { type: "string", example: "Phi" },
    givenName: { type: "string", example: "Tien" },
    middleName: { type: "string", example: "Duc" },
    fullName: { type: "string", example: "Phi Tien" },
    mariedStatus: { type: "string", example: "Single" },
    avatar: { type: "string", example: "/static/apps/oftien/cv/oftien.png" },
    background: { type: "string", example: "" },
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
