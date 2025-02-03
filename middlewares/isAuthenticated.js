const error = require('../constants/error')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './locker.env' });


exports.isAuth = async (req, res, next) => {
    try{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        error('The authorization is not defined!', 401);
    }

    const recievedToken = authHeader.split(' ')[1];

    const decoded = jwt.verify(recievedToken, process.env.TOKEN_SECRET_KEY);


    req.user = decoded;

    next();
    
}
    catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
    
}