const error = require('../../constants/error');
const Goal = require('../../models/user/goal/goal');
const User = require('../../models/user/user');
const mongoose = require('mongoose');
const { checkIfUserExists } = require('../../validators/authentication/validateAuth');
const goal = require('../../models/user/goal/goal');
const UserProgress = require ('../../models/user/goal/progress')

const { updateUserProgress } = require('../../services/updateUserProgress')


exports.setGoalController = async (req, res , next ) => {
try{
    const userId = req.user.userId;

    if(!userId) {
        error('Not authorized', 403);
    }
    const user = await User.findOne({
        _id: userId
    }).populate('goals');

    if(!user){
        error('User not found', 401);
    }

const hasCategory = user.goals.some(goal => goal.category === req.body.category);
    
    if(hasCategory){

        return res.status(400).json({
            message: "User already has an active goal with that category"
        })

    }


    const nextReset = setReset(req.body.frequency);
    const goal = new Goal({
        category: req.body.category,
        targetCount: req.body.targetCount,
        frequency: req.body.frequency,
        userId: userId,
        nextReset: nextReset
    })


     user.goals.push(goal);
    
     await user.save();


     await goal.save();



    res.status(200).json({
        message:'Goal placed sucessfully',
        goalId: goal._id,
    })
}
 catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
 }
}


exports.deleteGoalController = async (req, res, next ) => {
    const userId = req.user.userId;
    try{
    if(!userId){
        error('User not found', 404);
    }
    const user = await User.findById(userId);

    if(!user) {
        error('User not found', 404);
    }

    const goalId = new mongoose.Types.ObjectId
   ( req.body.goalId);

    if(!goalId){
        error('Goal not defined', 400)
    }

    const goal = await Goal.findById(goalId);

    if(!goal){
        error('Goal not found', 404);
    }

if(userId.toString() !== goal.userId.toString()){   
error('Not authorized to access', 401);
}


const goalToDelete = user.goals.find((goal) => goal._id.toString() === goalId.toString());

 if(!goalToDelete){
    error('Goal not found', 404);
  }
  
  user.goals = user.goals.filter((g) => g._id.toString() !== goalId.toString());
       
await  user.save();

  await Goal.deleteOne({_id: goalId});

 return res.status(204).end()
    }
    catch( error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.updateGoal = async (req, res, next ) => {

    const userId = req.user.userId;
    const goalId = req.params.goalId;

    
    try{
    const user = await User.findById(userId);

    if(!user){
error('User not found', 404);

    }
if(!goalId) {
    error('Invalid goalId')
}

console.log(user);


    const goalToUpdate = await Goal.findById({_id: goalId});

    console.log(goalToUpdate);
    
    if(!goalToUpdate){
        error('No such goal found in database', 404);
    }

    if(goalToUpdate.userId.toString() !== userId) {
        error('Not authorized', 401);
    }

    if(goalToUpdate.targetCount === goalToUpdate.completedCount && goalToUpdate.status==="completed" && goalToUpdate.progress===100) {
        error('goal is completed or expired!', 400);
    }

    goalToUpdate.completedCount = goalToUpdate.completedCount + 1;

    goalToUpdate.progress = (goalToUpdate.completedCount * 100) / goalToUpdate.targetCount;

    goalToUpdate.status = await updateUserProgress(userId, goalToUpdate);

    if(goalToUpdate.status==='completed') {

user.goals = user.goals.filter( (g) =>  g._id.toString() !== goalToUpdate._id.toString());
await user.save();    
}


    await goalToUpdate.save();
    

    res.status(200).json({
        message:'Goal updated sucessfully',
        progress: goalToUpdate.progress
    })

  }

  catch(err) {
    if(!err.statusCode) {   

        err.statusCode = 500;

    }
    next(err)
  }
}


exports.activeGoals = async ( req , res , next ) => {

    const userId = req.user.userId;

    const user = await User.findById(userId);
    
    if(!user){
        error('User not found', 404);
    }

    const goals = user.goals;

    return res.status(200).json({
        userId: userId,
        activeGoals:goals
    });


}



exports.allGoals = async ( req , res , next ) => {

    try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate('goals');
    
    if(!user){
        error('User not found', 404);
    }

    const activeGoals = user.goals;

    const userProgress = await UserProgress.findOne({userId: userId}).populate(['goalProgress.finishedGoals', 'goalProgress.unfinishedGoals']); 


    
    let totalGoals = [...activeGoals]

    let userProgressGoals = [];

    if(userProgress){

        const finishedGoals = userProgress.goalProgress.finishedGoals;

        
        const unfinishedGoals = userProgress.goalProgress.unfinishedGoals;


        userProgressGoals = [...finishedGoals, ...unfinishedGoals];

    }

    totalGoals = [...totalGoals, ...userProgressGoals];
    return res.status(200).json({
        userId: userId,
        totalGoals:totalGoals
    });

 }

 catch(error) {
    if(!error.statusCode)
 
        error.statusCode = 500;
    }
    

    next(error);
}










function setReset(status) {
    const currentTime = new Date();
    
    switch (status) {
        case 'daily':
            // Add 24 hours
            return new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
        
        case 'weekly':
            // Add 7 days
            return new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        case 'monthly':
            // Add 1 month (handles edge cases like month length)
            const newDate = new Date(currentTime);
            newDate.setMonth(currentTime.getMonth() + 1);
            return newDate;
        
        default:
            //  invalid status
            throw new Error("Invalid status. Use 'daily', 'weekly', or 'monthly'.");
    }
}
