const express = require('express');
const router = express.Router();

const { isAuth } = require('../middlewares/isAuthenticated');
const  GoalController  = require('../controllers/goal/goalController');

const goalValidator = require('../middlewares/inputValidator')

const {validateGoal} = require('../validators/inputValidator/inputValidator')




 router.post('/goal', isAuth , validateGoal, goalValidator.inputValidator , GoalController.setGoalController)


 router.delete('/goal', isAuth, GoalController.deleteGoalController)

 router.patch('/goal/update/:goalId', isAuth, GoalController.updateGoal)

 router.get('/goal/active/goals',isAuth, GoalController.activeGoals)

 router.get('/goal', isAuth , GoalController.allGoals);
 
 module.exports = router;

