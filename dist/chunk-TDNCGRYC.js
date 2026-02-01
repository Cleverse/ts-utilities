import {
  errors
} from "./chunk-SHGTG2S3.js";

// src/errors/errors.ts
import VError from "verror";
var CustomError = class extends VError {
  statusCode;
  constructor(name, message, options) {
    super(
      {
        name,
        cause: options?.cause ? errors.toError(options.cause) : void 0
      },
      message
    );
    this.statusCode = options?.statusCode ?? 500;
  }
};
var ClientError = class extends CustomError {
  constructor(name, message, options) {
    super(name, message, options);
  }
};
var ServerError = class extends CustomError {
  constructor(name, message, options) {
    super(name, message, options);
  }
};
var BadRequestError = class extends ClientError {
  constructor(message = "Bad Request", options) {
    super("BadRequestError", message, { statusCode: 400, ...options });
  }
};
var InternalError = class extends ServerError {
  constructor(message = "Internal Server Error", options) {
    super("InternalError", message, { statusCode: 500, ...options });
  }
};
var SomethingWentWrong = class extends ServerError {
  constructor(message = "Something Went Wrong", options) {
    super("SomethingWentWrong", message, { statusCode: 500, ...options });
  }
};
var ForbiddenError = class extends ClientError {
  constructor(message = "Forbidden", options) {
    super("ForbiddenError", message, { statusCode: 403, ...options });
  }
};
var UnauthorizedError = class extends ClientError {
  constructor(message = "Unauthorized", options) {
    super("UnauthorizedError", message, { statusCode: 401, ...options });
  }
};
var NotFoundError = class extends BadRequestError {
  constructor(message = "Not Found", options) {
    super(message, { statusCode: 404, ...options });
    this.name = "NotFoundError";
  }
};
var UnsupportedError = class extends BadRequestError {
  constructor(message = "Unsupported", options) {
    super(message, options);
    this.name = "UnsupportedError";
  }
};
var InvalidArgumentError = class extends BadRequestError {
  constructor(message = "Invalid Argument", options) {
    super(message, options);
    this.name = "InvalidArgumentError";
  }
};
var TimeoutError = class extends ClientError {
  constructor(message = "Timeout", options) {
    super("TimeoutError", message, { statusCode: 408, ...options });
  }
};
var RateLimitExceededError = class extends ClientError {
  constructor(message = "Rate Limit Exceeded", options) {
    super("RateLimitExceededError", message, { statusCode: 429, ...options });
  }
};
var RecoverableError = class extends ServerError {
  constructor(message, options) {
    super("RecoverableError", message, { statusCode: 500, ...options });
  }
};
var UnrecoverableError = class extends ServerError {
  constructor(message, options) {
    super("UnrecoverableError", message, { statusCode: 500, ...options });
  }
};
var ConflictError = class extends ClientError {
  constructor(message = "Conflict", options) {
    super("ConflictError", message, { statusCode: 409, ...options });
  }
};
var SkipableError = class extends ServerError {
  constructor(message = "skippable", options) {
    super("SkipableError", message, { statusCode: 500, ...options });
  }
};

export {
  CustomError,
  ClientError,
  ServerError,
  BadRequestError,
  InternalError,
  SomethingWentWrong,
  ForbiddenError,
  UnauthorizedError,
  NotFoundError,
  UnsupportedError,
  InvalidArgumentError,
  TimeoutError,
  RateLimitExceededError,
  RecoverableError,
  UnrecoverableError,
  ConflictError,
  SkipableError
};
//# sourceMappingURL=chunk-TDNCGRYC.js.map