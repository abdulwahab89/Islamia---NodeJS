const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authentication/signup/signupController');

const authControllerLog = require('../../controllers/authentication/login/loginController');
// const { setGoalController } = require('../../controllers/authentication/feed/feedController');
const {validateSignUp} = require('../../validators/authentication/validateAuth');
const {validateLogin} = require('../../validators/authentication/validateAuth');


const validateRequest = require('../../middlewares/authValidator')

router.post('/signup', validateSignUp,validateRequest.signUpValidate,authController.signupController) // Sign-up route

router.post('/login', validateLogin, validateRequest.loginValidator,authControllerLog.loginController) // login route

module.exports = router;