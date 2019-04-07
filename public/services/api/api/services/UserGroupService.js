const CONFIG = require("./BaseService");

module.exports = Object.assign({}, CONFIG, {
  model: () => UserGroup,
  attrs: () => ["id", "name", "description"],
  allExcept: async function(...exceptions) {
    const exclude = [].concat(...exceptions).filter(o => o);
    const criteria = {
      id: { "!=": exclude }
    };
    return await UserGroup.find(criteria);
  },
  upsert: async function(raw) {
    await UserGroupService.validateData(raw);
    let { id } = raw;
    const data = this.data(raw);
    if (id) {
      //save
      await UserGroup.update({ id }, { ...data, id });
    } else {
      //create
      const newObj = await UserGroup.create(data).fetch();
      id = newObj.id;
    }
    return await UserGroupService.detail(id);
  },
  validateData: async function(data) {
    const { id, name } = data;
    const found = await UserGroup.findOne({ name });
    if (!found || (id && id == found.id)) return true;
    throw new errors.AppError("User Group name is already used");
  },
  detail: async function(id) {
    if (!id) throw new errors.NotFoundError("User Group not found");
    const found = await UserGroup.findOne({ id }).populate("actions");
    if (!found) throw new errors.NotFoundError("User Group not found");
    return found;
  },
  hasAction: async function(groupid, actionid) {
    const group = await UserGroup.findOne({ id: groupid }).populate("actions", {
      select: ["id"]
    });
    if (!group) throw new errors.NotFoundError("User Group not found");
    if (group.actions.find(o => o.id == actionid)) return true;
    return false;
  },
  addAction: async function(groupid, actionid) {
    if (!(await UserGroupService.hasAction(groupid, actionid)))
      return await UserGroup.addToCollection(groupid, "actions", actionid);
    return true;
  },
  removeAction: async function(groupid, actionid) {
    return await UserGroup.removeFromCollection(groupid, "actions", actionid);
  }
});
