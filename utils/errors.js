class APIError extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}

class NotFoundError extends APIError {
  constructor() {
    super("Not Found!", 404);
  }
}

class AuthError extends APIError {
  constructor() {
    super("Auth error!", 403);
  }
}

module.exports = { APIError, NotFoundError, AuthError };
