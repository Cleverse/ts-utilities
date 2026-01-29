"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

var _chunkRWHWC4QPcjs = require('./chunk-RWHWC4QP.cjs');


var _chunkT6TWWATEcjs = require('./chunk-T6TWWATE.cjs');

// src/errors/errors.ts
_chunkT6TWWATEcjs.init_cjs_shims.call(void 0, );
var _verror = require('verror'); var _verror2 = _interopRequireDefault(_verror);
var CustomError = class extends _verror2.default {
  
  constructor(name, message, options) {
    super(
      {
        name,
        cause: _optionalChain([options, 'optionalAccess', _ => _.cause]) ? _chunkRWHWC4QPcjs.errors.toError(options.cause) : void 0
      },
      message
    );
    this.statusCode = _nullishCoalesce(_optionalChain([options, 'optionalAccess', _2 => _2.statusCode]), () => ( 500));
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

















exports.CustomError = CustomError; exports.BadRequestError = BadRequestError; exports.InternalError = InternalError; exports.SomethingWentWrong = SomethingWentWrong; exports.ForbiddenError = ForbiddenError; exports.UnauthorizedError = UnauthorizedError; exports.NotFoundError = NotFoundError; exports.UnsupportedError = UnsupportedError; exports.InvalidArgumentError = InvalidArgumentError; exports.TimeoutError = TimeoutError; exports.RateLimitExceededError = RateLimitExceededError; exports.RecoverableError = RecoverableError; exports.UnrecoverableError = UnrecoverableError; exports.ConflictError = ConflictError; exports.SkipableError = SkipableError;
//# sourceMappingURL=chunk-ZBUJ2LFR.cjs.map