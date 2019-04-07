module.exports = async function(req, res, proceed) {
  const actions = ["Create User"];
  const hasPermission = await UserService.hasOneOfActions(...actions);
  if (hasPermission) return proceed();
  throw new errors.PermissionDeniedError("Permission Denied");
};
