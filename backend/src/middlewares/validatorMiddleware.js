const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      const firstError = errors.array()[0]; // get first message

    return res.status(400).json({
      status: "fail",
      message: firstError.msg, // instead of "Validation Error"
      field: firstError.param,
    });
  
  }
  next();
};

module.exports = validatorMiddleware;
