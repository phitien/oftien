class AppError extends Error {
  constructor(message, status, ...args) {
    super(message, status, ...args);
    this.status = status || 500;
    this.message = message;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  toJSON() {
    return {
      status: this.status,
      message: this.message,
      stack: this.stack
    };
  }
}
class UnauthorizedError extends AppError {
  constructor(message, status, ...args) {
    super(message, status, ...args);
    this.status = status || 401;
  }
}
class PermissionDeniedError extends AppError {
  constructor(message, status, ...args) {
    super(message, status, ...args);
    this.status = status || 500;
  }
}
class NotFoundError extends AppError {
  constructor(message, status, ...args) {
    super(message, status, ...args);
    this.status = status || 404;
  }
}
module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  PermissionDeniedError
};
