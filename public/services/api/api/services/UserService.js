const CONFIG = require("./BaseService");

const jwt = require("jwt-simple");
const uuid = require("uuid/v4");

const { jwtSecret } = sails.config.custom;
const { maxAge } = sails.config.session.cookie;

module.exports = Object.assign({}, CONFIG, {
  model: () => User,
  attrs: () => ["id", "username", "password"],
  currentUser: null,
  defaultGroup: async function() {
    return await UserGroup.findOne({ name: "Viewer" });
  },
  adminGroup: async function() {
    return await UserGroup.findOne({ name: "Administrator" });
  },
  bizAdminGroup: async function() {
    return await UserGroup.findOne({ name: "Biz Administrator" });
  },
  superAdminGroup: async function() {
    return await UserGroup.findOne({ name: "Super Administrator" });
  },
  hasAction: async function(action) {
    if (!UserService.currentUser) throw new errors.AppError("Unauthorized");
    const actionnames = UserService.currentUser.actionnames;
    return actionnames.includes(action);
  },
  hasOneOfActions: async function(...actions) {
    if (!UserService.currentUser) throw new errors.AppError("Unauthorized");
    const actionnames = UserService.currentUser.actionnames;
    let rs = false;
    for (let i in actions) {
      if (rs) break;
      if (actionnames.includes(actions[i])) rs = true;
    }
    return rs;
  },
  hasAllActions: async function(...actions) {
    if (!UserService.currentUser) throw new errors.AppError("Unauthorized");
    const actionnames = UserService.currentUser.actionnames;
    if (!actionnames.length) return false;
    let rs = true;
    for (let i in actions) {
      if (!rs) break;
      if (!actionnames.includes(actions[i])) rs = false;
    }
    return rs;
  },
  allExcept: async function(...exceptions) {
    const exclude = [].concat(...exceptions).filter(o => o);
    const criteria = {
      id: { "!=": exclude }
    };
    const users = await User.find(criteria)
      .populate("profile")
      .populate("preferences")
      .populate("groups")
      .populate("actions");
    return await Promise.all(users.map(o => UserService.normalise(o)));
  },
  hash: async function(str) {
    return sails.helpers.passwords.hashPassword(str);
  },
  checkUsername: async function(username) {
    username = username.trim();
    const user = await User.findOne({ username });
    if (user) throw new errors.AppError("Username is already used");
  },
  checkPassword: async function(user, password) {
    try {
      await sails.helpers.passwords.checkPassword(password, user.password);
    } catch (e) {
      throw new errors.AppError("Password did not match");
    }
  },
  setUserPassword: async function(user, password) {
    password = password.trim();
    await User.update({ id: user.id }).set({
      password: await UserService.hash(password),
      forgotToken: ""
    });
  },
  setUserProfile: async function(user, data = {}) {
    if (
      !(await UserProfile.findOne({
        email: user.username,
        owner: user.id
      }))
    ) {
      const profile = await UserProfile.create({
        ...data,
        email: user.username,
        owner: user.id
      }).fetch();
      await User.update({ id: user.id }).set({ profile: profile.id });
    }
  },
  setUserPreferences: async function(user, data = {}) {
    if (!(await UserPreferences.findOne({ owner: user.id }))) {
      const preferences = await UserPreferences.create({
        ...data,
        owner: user.id
      }).fetch();
      await User.update({ id: user.id }).set({ preferences: preferences.id });
    }
  },
  generateToken: async function(user) {
    const { username } = user;
    const randomUUID = uuid();
    return jwt.encode(
      { username, issued: Date.now(), uuid: randomUUID },
      jwtSecret
    );
  },
  grantToken: async function(user) {
    let { token, lastSeenAt } = user;
    if (!token) {
      lastSeenAt = Date.now();
      token = await UserService.generateToken(user);
      await User.update({ id: user.id }).set({ token, lastSeenAt });
    } else {
      //check session timeout
      const now = Date.now();
      const { sessionBuffer } = sails.config.custom;
      if (now - lastSeenAt > sessionBuffer) {
        //only create new token if user do not access app within session buffer
        const { issued } = jwt.decode(token, jwtSecret);
        if (now - issued >= maxAge) {
          token = await UserService.generateToken(user);
          lastSeenAt = Date.now();
          await User.update({ id: user.id }).set({ token, lastSeenAt });
        }
      }
    }
    user.token = token;
    user.lastSeenAt = lastSeenAt;
    return token;
  },
  activationUrl: async function(user) {
    const { username, proofToken } = user;
    return `${
      sails.config.custom.rootUrl
    }/api/v1/activate?token=${proofToken}&username=${username}`;
  },
  sendActivationEmail: async function(user) {
    await sails.hooks.email.send(
      "account-activation",
      { ...user, url: await UserService.activationUrl(user) },
      {
        to: username,
        subject: `Welcome to APA`
      },
      err => (err ? console.log(err) : false)
    );
  },
  forceRemove: async function(id) {
    if (id === UserService.currentUser.id)
      throw new errors.AppError("You cannot remove your account");
    const user = await User.findOne({ id })
      .populate("actions", { select: ["id"] })
      .populate("groups", { select: ["id"] })
      .populate("products", { select: ["id"], limit: 1 })
      .populate("profile")
      .populate("preferences");
    if (!user) throw new errors.AppError("User does not exits");
    if (user.products.length)
      throw new errors.AppError(
        "User possesses some products, would you might deactivating instead of deleting"
      );
    await UserService.removeFromGroups(id, user.groups.map(o => o.id));
    await UserService.removeFromActions(id, user.actions.map(o => o.id));
    await UserProfile.destroy({ id: user.profile.id });
    await UserPreferences.destroy({ id: user.preferences.id });
    await User.destroy({ id });
  },
  forceCreate: async function(raw) {
    let { username, password, groups, profile, preferences } = raw;
    username = username.toLowerCase().trim();
    let user = await User.findOne({ username });
    if (!user)
      user = await User.create({
        username,
        name: username,
        password: "dummy",
        status: "forced",
        proofToken: ""
      }).fetch();
    const defaultGroup = await UserService.defaultGroup();
    groups = [].concat(groups || [defaultGroup.id]).filter(o => o);
    await Promise.all(
      groups.map(async o => await UserService.addToGroup(user.id, o))
    );
    await UserService.setUserPassword(user, password);
    await UserService.setUserProfile(user, profile);
    await UserService.setUserPreferences(user, preferences);
    return await UserService.detail(username);
  },
  register: async function(raw) {
    let { username, password, groups, profile, preferences } = raw;
    username = username.toLowerCase().trim();
    await UserService.checkUsername(username);
    let user = await User.create({
      username,
      name: username,
      password,
      status: sails.config.custom.activationRequired
        ? "unconfirmed"
        : "confirmed",
      proofToken: sails.config.custom.activationRequired
        ? await UserService.generateToken(raw)
        : ""
    }).fetch();
    const defaultGroup = await UserService.defaultGroup();
    groups = [].concat(groups || [defaultGroup.id]).filter(o => o);
    await Promise.all(groups.map(o => UserService.addToGroup(user.id, o)));
    await UserService.setUserPassword(user, password);
    await UserService.setUserProfile(user, profile);
    await UserService.setUserPreferences(user, preferences);
    user = await UserService.detail(username);
    if (!sails.config.custom.activationRequired) {
      const token = await UserService.grantToken(user);
      user.token = token;
      return user;
    } else {
      await UserService.sendActivationEmail(user);
      return { ...user, activationUrl: await UserService.activationUrl(user) };
    }
  },
  activate: async function(raw) {
    const { token, username } = raw;
    let user = await User.findOne({
      where: { proofToken: token, username },
      select: ["password", "status"]
    });
    if (!user) throw new errors.NotFoundError("Token is invalid");
    await User.update({ id: user.id }).set({
      status: "confirmed",
      proofToken: ""
    });
    user = await UserService.detail(username);
    user.token = await UserService.grantToken(user);
    return user;
  },
  login: async function(raw) {
    const { username, password } = raw;
    const user = await UserService.detail(username);
    if (!user) throw new errors.AppError("User is not registered");
    if (sails.config.custom.activationRequired) {
      if (user.status !== "confirmed")
        throw new errors.UnauthorizedError("Account is not activated");
    }
    await UserService.checkPassword(user, password);
    await UserService.grantToken(user);
    return user;
  },
  forgot: async function(raw) {
    const { username } = raw;
    const user = await User.findOne({
      where: { username },
      select: ["id", "status", "username"]
    });
    if (!user) throw new errors.AppError("Username is not registered");
    user.token = "";
    const token = await UserService.generateToken(user);
    if (sails.config.custom.activationRequired) {
      if (user.status !== "confirmed") {
        await User.update({ id: user.id }).set({
          token: "",
          proofToken: token
        });
        user.proofToken = token;
        await UserService.sendActivationEmail(user);
        throw new errors.AppError(
          `Account is not activated. Please activate it in newly email sent to ${username}`
        );
      }
    }
    await User.update({ id: user.id }).set({ token: "", forgotToken: token });
    user.forgotToken = token;
    await UserService.sendForgotPasswordEmail(user);
    return { forgotUrl: await UserService.forgotUrl(user) };
  },
  sendForgotPasswordEmail: async function(user) {
    await sails.hooks.email.send(
      "account-forgot",
      { ...user, url: await UserService.forgotUrl(user) },
      {
        to: user.username,
        subject: `APA change password request`
      },
      err => (err ? console.log(err) : false)
    );
  },
  forgotUrl: async function(user) {
    const { username, forgotToken } = user;
    return `${
      sails.config.custom.rootUrl
    }/api/v1/password?token=${forgotToken}&username=${username}`;
  },
  validatePassword: async function(password) {
    return true; //TOTO apply some rules here
  },
  password: async function(raw) {
    const { token, username, password, confirmed } = raw;
    const user = await User.findOne({
      where: { forgotToken: token, username },
      select: ["username", "status"]
    });
    if (!user) throw new errors.AppError("Token is invalid");
    await UserService.validatePassword(password);
    if (password !== confirmed)
      throw new errors.AppError("Passwords don't match");
    await UserService.setUserPassword(user, password);
    return await UserService.detail(username);
  },
  auth: async function(raw) {
    let { token } = raw;
    const user = await User.findOne({
      where: { token },
      select: ["username", "status"]
    });
    if (!user) throw new errors.UnauthorizedError("Token is invalid");
    if (sails.config.custom.activationRequired) {
      if (user.status !== "confirmed")
        throw new errors.UnauthorizedError("Account is not activated");
    }
    await UserService.grantToken(user);
    return await UserService.detail(user.username);
  },
  logout: async function(raw) {
    let { token } = raw;
    const user = await User.findOne({
      where: { token },
      select: ["username"]
    });
    if (!user) throw new errors.AppError("Token is invalid");
    await User.update({ id: user.id }).set({
      token: "",
      lastSeenAt: new Date().getTime()
    });
    return { token: "" };
  },
  setLastSeen: async function(user, lastSeenAt) {
    if (!lastSeenAt) lastSeenAt = Date.now();
    await User.update({ id: user.id }).set({ lastSeenAt });
    return { ...user, lastSeenAt };
  },
  profile: async function(raw, noError = false) {
    let { token } = raw;
    if (!token) throw new errors.AppError("Token is invalid");
    token = token.trim();
    const user = await User.findOne({
      where: { token },
      select: ["username"]
    });
    if (!user) {
      if (noError) return undefined;
      throw new errors.AppError("Token is invalid");
    }
    return await UserService.detail(user.username);
  },
  profileupdate: async function(user, data) {
    if (!user) throw new errors.AppError("Token is invalid");
    await UserProfile.update({ id: user.profile.id }).set(
      _.omit(data, "id", "owner")
    );
    return await UserService.detail(user.username);
  },
  preferencesupdate: async function(user, data) {
    if (!user) throw new errors.AppError("Token is invalid");
    await UserPreferences.update({ id: user.preferences.id }).set(
      _.omit(data, "id", "owner")
    );
    return await UserService.detail(user.username);
  },
  inGroup: async function(userid, groupid) {
    const user = await User.findOne({ id: userid }).populate("groups", {
      select: ["id"]
    });
    if (!user) throw new errors.NotFoundError("User not found");
    if (user.groups.find(o => o.id === groupid)) return true;
    return false;
  },
  addToGroup: async function(userid, groupid) {
    if (!(await UserService.inGroup(userid, groupid)))
      return await User.addToCollection(userid, "groups", groupid);
    return true;
  },
  removeFromGroup: async function(userid, groupid) {
    return await User.removeFromCollection(userid, "groups", groupid);
  },
  removeFromGroups: async function(userid, groups) {
    if (!groups || !groups.length) return true;
    return await User.removeFromCollection(
      userid,
      "groups",
      [].concat(groups).filter(o => o)
    );
  },
  removeFromActions: async function(userid, actions) {
    if (!actions || !actions.length) return true;
    return await User.removeFromCollection(
      userid,
      "actions",
      [].concat(actions).filter(o => o)
    );
  },
  detail: async function(username) {
    return await UserService.normalise(
      await User.findOne({ username })
        .populate("profile")
        .populate("preferences")
        .populate("groups")
        .populate("actions")
    );
  },
  detailById: async function(id) {
    return await UserService.normalise(
      await User.findOne({ id })
        .populate("profile")
        .populate("preferences")
        .populate("groups")
        .populate("actions")
    );
  },
  normalise: async function(user) {
    if (!user) return user;
    const groupids = []
      .concat(user.groups)
      .filter(o => o)
      .map(o => o.id);
    const groups = await UserGroup.find({ id: groupids }).populate("actions");
    user.groupnames = groups.map(o => o.name);
    user.actionnames = Array.from(
      new Set(
        []
          .concat(user.actions, ...groups.map(o => o.actions))
          .filter(o => o)
          .map(o => o.name)
      )
    );
    return user;
  }
});
