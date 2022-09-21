const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// get goles from user
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  res.status(200).json(goals);
});

// set goles from user
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text file");
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id
  });

  res.status(200).json(goal);
});

// update goles from user
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  //cheack for the user
  if(!req.user){
    res.status(401)
    throw new Error("User not found")
  }

  // Make sure the login user matches the goal user
  if(goal.user.toString() !== req.user.id){
    res.status(401)
    throw new Error("user not authorized")
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// delete goles from user
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  //cheack for the user
  if(!req.user){
    res.status(401)
    throw new Error("User not found")
  }

  // Make sure the login user matches the goal user
  if(goal.user.toString() !== req.user.id){
    res.status(401)
    throw new Error("user not authorized")
  }

  await goal.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
