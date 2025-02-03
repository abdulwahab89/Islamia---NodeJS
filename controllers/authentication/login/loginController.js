const argon2= require('argon2');
const {checkIfUserExists} = require('../../../validators/authentication/validateAuth');

const error = require('../../../constants/error')

const User = require('../../../models/user/user');

const jwt = require('jsonwebtoken')

require('dotenv').config({ path: './locker.env' });


exports.loginController = async (req, res, next) => {
try{
    //Client's data
    const data = {
        email: req.body.email,
        password: req.body.password
    }

const user= await checkIfUserExists(req.body.email);

    if(!user){ //Checks if not exist already
    error("User doesn't exists", 404);
            }
const verifyPassword = await argon2.verify(user.password,data.password); 
if(!verifyPassword){
error('Password mismatch!', 401);
}

const token = jwt.sign({
    'email':user.email,
    'userId':user._id,

},
process.env.TOKEN_SECRET_KEY
);


res.status(200).json({
    message:'User login sucessfully',  
    token:token
});



} 
catch(error){
    if(!error.statusCode){
        error.statusCode=500; //DEFAULT - STATUS CODE
    }
    next(error);
}
    
}
