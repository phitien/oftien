module.exports = {
  attrs: function() {
    return [];
  },
  data: function(raw, attrs) {
    attrs = attrs || this.attrs();
    if (attrs && attrs.length)
      return attrs.reduce((rs, o) => {
        rs[o] = raw[o];
        return rs;
      }, {});
    return raw;
  },
  model: function() {
    throw new errors.AppError("Model is not declared");
  },
  findOne: async function(opts) {
    const model = this.model();
    return await model.findOne(opts);
  },
  find: async function(opts) {
    const model = this.model();
    return await model.find(opts);
  },
  tokenName: function() {
    return sails.config.custom.tokenName || "apa-token";
  }
};
