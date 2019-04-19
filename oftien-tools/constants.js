module.exports = function(o, env) {
  const rkey = "REACT_APP_";
  const rkeyReg = new RegExp(`^${rkey}.+`);
  o.constants = Object.keys(env)
    .filter(o => rkeyReg.test(o))
    .reduce((rs, o) => {
      const v = env[o];
      const k = o.substr(rkey.length);
      rs[k] = v;
      return rs;
    }, {});
};
