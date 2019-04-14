/**
 * @Override serverError
 */
var defaultServerError = require("sails/lib/hooks/responses/defaults/serverError");
module.exports = function serverError(data) {
  sails.log.error(data);
  const { req, res } = this;
  if (req.wantsJSON && data instanceof errors.AppError)
    return res.status(data.status || 500).json(data);
  else if (req.wantsJSON && data instanceof Error)
    return res.status(500).json({
      status: 500,
      message: data.message || data.raw || "Internal Server Error",
      stack: data.stack || ""
    });
  else return defaultServerError.call(this, ...arguments);
};
