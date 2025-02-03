    const mongoose = require('mongoose');

    const UserProgress = mongoose.Schema({
        userId : {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        
        goalProgress : 
            {
                finishedGoals : [
                    {
            type: mongoose.Types.ObjectId,
            ref: 'Goal'
        },
                ],
                
                unfinishedGoals: [
                    
                    {
                        type: mongoose.Types.ObjectId,
                        ref: 'Goal'

                    },
                
            ]

            },

            
            
            
        
    })


    module.exports = mongoose.model('UserProgress', UserProgress)