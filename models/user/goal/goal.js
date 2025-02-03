const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({

    category : {
        
        type:String,
        required: true,
    },

    targetCount : {
    
        type: Number,
        required: true,
    
    },

    completedCount: {
        
        type: Number,
    
        default:0
    },

    startDate: { 
        type: Date, 
        default: Date.now 
    },

    nextReset : {
        type: Date,
        required: true
    },


    status: {
        type: String,
        enum: ["active", "completed", "paused"],
        default: "active",
      },

    frequency : {
        type: String,
        enum : ["daily", "weekly", "monthly"],
        required: true
    },

    

    
 
    progress: { 
        type: Number, default: 0 
    },
    
    userId: {
        
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
      },

},{
    timestamps: true
}
)

module.exports = mongoose.model('Goal', GoalSchema)