module.exports = {
  attributes: {
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      example: "phi.tien@oftien.com"
    },
    gender: {
      type: "string",
      isIn: ["NA", "Male", "Female", "Bio", "None", "Gay", "Les"],
      defaultsTo: "NA"
    },
    title: {
      type: "string",
      example: "Mr, Mrs, Ms, Dr..."
    },
    occupation: {
      type: "string",
      example: "Software Engineer"
    },
    company: {
      type: "string",
      example: "Amaris.AI pte ltd"
    },
    birthdate: {
      type: "string",
      example: "1984-xx-xx"
    },
    phone: {
      type: "string",
      example: "+65 85xx xxxx"
    },
    country: {
      type: "string",
      example: "Singapore"
    },
    state: {
      type: "string"
    },
    address1: {
      type: "string",
      example: "#17-27, block xxx"
    },
    address2: {
      type: "string",
      example: "Robinson Rd, Singapore"
    },
    postcode: {
      type: "string",
      example: "123456"
    },
    familyName: {
      type: "string",
      description: "User's family name",
      example: "Phi"
    },
    givenName: {
      type: "string",
      description: "User's given name",
      example: "Tien"
    },
    middleName: {
      type: "string",
      description: "User's middle name",
      example: "Duc"
    },
    fullName: {
      type: "string",
      description: "Full representation of the user's name",
      example: "Phi Tien"
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
