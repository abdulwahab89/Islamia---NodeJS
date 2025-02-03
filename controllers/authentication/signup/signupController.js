    const argon2= require('argon2');
    const {checkIfUserExists} = require('../../../validators/authentication/validateAuth');

    const User = require('../../../models/user/user');


    const error = require('../../../constants/error')
    

    exports.signupController = async (req, res, next) => {
    
        try{
        //Client's data
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }

    const isExisting= await checkIfUserExists(req.body.email);

        if(isExisting){ //Checks if exist already
      error('User with this email already exists', 409);
                }

    data.password = await argon2.hash(data.password);

            const user = new User(data);

            const savedUser = await user.save(); // storing the user in database

    res.status(201).json({
        message:'User signup sucessfuly',
        userId: savedUser._id,  
    });



    } 
    catch(error){
        if(!error.statusCode){
            error.statusCode=500; //DEFAULT - STATUS CODE
        }
        next(error);
    }
        
    }