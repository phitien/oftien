module.exports = async function(req, res, proceed) {
  if (!UserService.currentUser)
    throw new errors.UnauthorizedError("Unauthorized");
  return proceed();
};
