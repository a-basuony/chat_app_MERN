const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      message: "Validation Error",
      errors: errors.array().map((err) => ({
        field: err.param,
        msg: err.msg,
      })),
    });
  }
  next();
};

module.exports = validatorMiddleware;
