const CONFIG = require("./BaseService");

module.exports = Object.assign({}, CONFIG, {
  model: () => UserAction,
  attrs: () => ["id", "name", "description", "active"],
  allExcept: async function(...exceptions) {
    const exclude = [].concat(...exceptions).filter(o => o);
    const criteria = {
      id: { "!=": exclude }
    };
    return await UserAction.find(criteria);
  },
  upsert: async function(raw) {
    await UserActionService.validateData(raw);
    let { id } = raw;
    const data = this.data(raw);
    if (id) {
      //save
      await UserAction.update({ id }, { ...data, id });
    } else {
      //create
      const newObj = await UserAction.create(data).fetch();
      id = newObj.id;
    }
    return await UserActionService.detail(id);
  },
  validateData: async function(data) {
    const { id, name } = data;
    const found = await UserAction.findOne({ name });
    if (!found || (id && id === found.id)) return true;
    throw new errors.AppError("User Action name is already used");
  },
  detail: async function(id) {
    if (!id) throw new errors.NotFoundError("User Action not found");
    const found = await UserAction.findOne({ id }).populate("groups");
    if (!found) throw new errors.NotFoundError("User Action not found");
    return found;
  },
  inGroup: async function(actionid, groupid) {
    const action = await UserAction.findOne({ id: actionid }).populate(
      "groups",
      { select: ["id"] }
    );
    if (!action) throw new errors.NotFoundError("User Action not found");
    if (action.groups.find(o => o.id === groupid)) return true;
    return false;
  },
  addToGroup: async function(actionid, groupid) {
    if (!(await UserActionService.inGroup(actionid, groupid)))
      return await UserAction.addToCollection(actionid, "groups", groupid);
    return true;
  },
  removeFromGroup: async function(actionid, groupid) {
    return await UserAction.removeFromCollection(actionid, "groups", groupid);
  }
});
