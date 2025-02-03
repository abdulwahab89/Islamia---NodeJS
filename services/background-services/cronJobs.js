const cron = require('node-cron');
const User = require('../../models/user/user');
const { updateUnfinishedProgress } = require('../updateUserProgress');

cron.schedule('*/1 * * * *', async () => { // Run every minute
    
    const users = await User.find({ goals: { $exists: true, $not: { $size: 0 } } });


    if(users.length ==0){
        console.log("Users already updated, job closed")
return;
    }
        for (let user of users) {
            try {
                await updateUnfinishedProgress(user._id);
                console.log(`Successfully updated progress for user: ${user._id}`);
            } catch (error) {
                console.error(`Failed to update progress for user ${user._id}: ${error.message}`);
            }
        }

    
});
