const { validationResult } = require("express-validator")

exports.signUpValidate = (req, res, next) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
    const errorMessages = errors.array().map( err => err.msg);
    
    const error = new Error('Validation failed');

    error.statusCode = 400;
    error.errors = errorMessages;
    return next(error);
 
}
next();
    
}

exports.loginValidator = (req, res , next ) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessages = errors.array().map( err => err.msg);
        const error = new Error('Validation failed');

        error.statusCode =400;
        
        error.errors = errorMessages;
        
        return next(error)
    }       
    next();
}

