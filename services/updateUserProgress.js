const UserProgress = require('../models/user/goal/progress');
const User = require('../models/user/user');
const Goal = require('../models/user/goal/goal')
async function updateUserProgress (userId, goalToUpdate)  {
    
  try {
    
    
   let userProgress = await UserProgress.findOne({
    userId: userId
   });

  userProgress =  await initializeUserProgress(userProgress, userId); //makes new user progress if none
   
   if(userProgress) {

    let goalStatus;
    if ( goalToUpdate.startDate < goalToUpdate.nextReset  &&  goalToUpdate.progress===100 && goalToUpdate.status ==='active'){
        goalStatus = 'completed';

        userProgress.goalProgress.finishedGoals.push(goalToUpdate._id);

        await userProgress.save();
    
      
    }

    return goalStatus || 'active';


   }


   }

   catch(error) {

    console.log(error, "Something wrong occured in userProgress");
    
    throw error;

   }


}

async function initializeUserProgress (userProgress, userId) {

    if(!userProgress){

        userProgress = new UserProgress({  //if there's no user progress i simply make one
userId :userId,
goalProgress : {
    
        finishedGoals: [],
        unfinishedGoals : []
    
    
    
}
        });

        return await userProgress.save(); //new user progress if no user
        
        
    }
    
    return userProgress; // if there's one just simply return it


}

    async function updateToUnfinished  () {

        try {
    
            const result = await Goal.updateMany(
                {
                    status: 'active',
                
                    $expr: { $lt: ["$nextReset", "$startDate"] }
                },
                {
                    $set: { status: 'paused' }, 
                }
            );

            


        }
    
        catch (error){

            console.log('Updating status failed');
            throw error;
        }
    }

        async function updateUnfinishedProgress (userId) {
          
            try{

            
            await updateToUnfinished();


           
            const user = await User.findById(userId).populate('goals');

        
            const progress = await UserProgress.findOne({userId:userId});

            

            let userProgress = await initializeUserProgress(progress, userId);  
        

           const updatedGoals = user.goals.filter(goal => goal.status === 'paused');

            updatedGoals.forEach(goal => {
                userProgress.goalProgress.unfinishedGoals.push(goal._id);
            });
    
            user.goals = user.goals.filter(goal => goal.status !== 'paused');



            await userProgress.save();

          await  user.save();

        
        }
        
        catch(error){
            console.log("Error occured updating user unfinished progress");

            throw error;
            
        }
    }
    











module.exports = {

    updateUserProgress,

    updateToUnfinished,
    updateUnfinishedProgress,
    initializeUserProgress,
}