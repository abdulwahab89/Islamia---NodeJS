const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: [50, "Name cannot be greater than 10 characters!"]
  },
  lastName: {
    type: String,
    maxlength: [50, "Name cannot be greater than 10 characters!"]
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password cannot be shorter than 6 characters"],
    },

    goals :[
      {
        type:mongoose.Schema.Types.ObjectId,
            ref: 'Goal'
        
      }
    ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
