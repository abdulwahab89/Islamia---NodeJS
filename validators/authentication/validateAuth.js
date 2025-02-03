const User = require('../../models/user/user');

const error = require('../../constants/error')

const jwt = require('jsonwebtoken');
const { check } = require('express-validator');

const expressValidator = require('express-validator').check;

const checkIfUserExists = async (email) => {
    try{
    const user = await User.findOne({ email:email }); //finds user in DB.
    if(user){  
        return user; //results true if found one.
    }
    return null;  //results false if not found.
  } 
  catch(error){
  throw new Error('Error occured while looking user existence!') 
  }
}

const validateSignUp = [
  check('email').isEmail().withMessage('Invalid email').custom(async(email)=> {
    const userExists = await checkIfUserExists(email);
    if(userExists){
     return Promise.reject(error('User with this email already exists', 403));
    } 

  }).normalizeEmail(),

  check('firstName').notEmpty().withMessage('Name cannot be empty').isLength({
    max:50,
  }).withMessage('Name should be less than 50 characters'),

  check('lastName').notEmpty().withMessage('Name cannot be empty').isLength({
    max:50,
  }).withMessage('Name should be less than 50 characters'),

  check('password').notEmpty().withMessage('Password cannot be empty').isStrongPassword().withMessage('Choose a stronger password')
]

const validateLogin =[

check('email').custom( async(email ) => {
  const userExists = await checkIfUserExists(email);


  if(!userExists) {
    return Promise.reject( new Error('Invalid Email or password!'));
  }
  
}).normalizeEmail(),


]
module.exports = {
  checkIfUserExists,
  validateSignUp,
  validateLogin
};