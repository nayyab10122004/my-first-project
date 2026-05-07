const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  email: String,
  task: String
});

module.exports = mongoose.model("Task", taskSchema);