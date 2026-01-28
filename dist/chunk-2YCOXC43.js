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
var BadRequestError = class extends CustomError {
  constructor(message = "Bad Request", options) {
    super("BadRequestError", message, { statusCode: 400, ...options });
  }
};
var InternalError = class extends CustomError {
  constructor(message = "Internal Server Error", options) {
    super("InternalError", message, { statusCode: 500, ...options });
  }
};
var SomethingWentWrong = class extends InternalError {
  constructor(message = "Something Went Wrong", options) {
    super(message, { statusCode: 500, ...options });
    this.name = "SomethingWentWrong";
  }
};
var ForbiddenError = class extends CustomError {
  constructor(message = "Forbidden", options) {
    super("ForbiddenError", message, { statusCode: 403, ...options });
  }
};
var UnauthorizedError = class extends CustomError {
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
var TimeoutError = class extends CustomError {
  constructor(message = "Timeout", options) {
    super("TimeoutError", message, { statusCode: 408, ...options });
  }
};
var RateLimitExceededError = class extends CustomError {
  constructor(message = "Rate Limit Exceeded", options) {
    super("RateLimitExceededError", message, { statusCode: 429, ...options });
  }
};
var RecoverableError = class extends CustomError {
  constructor(message, options) {
    super("RecoverableError", message, { statusCode: 500, ...options });
  }
};
var UnrecoverableError = class extends CustomError {
  constructor(message, options) {
    super("UnrecoverableError", message, { statusCode: 500, ...options });
  }
};
var ConflictError = class extends CustomError {
  constructor(message = "Conflict", options) {
    super("ConflictError", message, { statusCode: 409, ...options });
  }
};
var SkipableError = class extends CustomError {
  constructor(message = "skippable", options) {
    super("SkipableError", message, { statusCode: 500, ...options });
  }
};

export {
  CustomError,
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
//# sourceMappingURL=chunk-2YCOXC43.js.map