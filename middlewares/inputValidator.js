const { validationResult } = require("express-validator")

exports.inputValidator = (req, res, next ) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(err => err.msg);
        
        const error = new Error('Goal validation failed');
error.errors = errorMessages;
        error.statusCode = 400;

        
        return next(error);
    }
    next();

}