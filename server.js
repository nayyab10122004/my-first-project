const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/studentApp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error: ", err));

const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  course: String
}));

const Task = mongoose.model('Task', new mongoose.Schema({
  email: String,
  task: String,
  status: { type: String, default: 'pending' },
  date: String
}));

const CalendarTask = mongoose.model('CalendarTask', new mongoose.Schema({
  email: String,
  date: String,
  task: String
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();
    res.send("User Created");
  } catch (err) {
    res.status(400).send("Error creating user (Email already exists)");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, email: user.email, name: user.name });
    } else {
      res.json({ success: false, message: "Email or password is incorrect!" });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.post("/addTask", async (req, res) => {
  try {
    const { email, task, date } = req.body;
    await Task.create({ email, task, date, status: 'pending' });
    res.send("Task Added");
  } catch (err) {
    res.status(500).send("Task could not be added");
  }
});

app.get("/tasks/:email", async (req, res) => {
  try {
    const tasks = await Task.find({ email: req.params.email });
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Could not load tasks");
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Task Deleted");
  } catch (err) {
    res.status(500).send("Task could not be deleted");
  }
});

app.post("/updateTask/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.send("Task Updated");
  } catch (err) {
    res.status(500).send("Task could not be updated");
  }
});

app.post("/profile", async (req, res) => {
  try {
    const { email, name, course } = req.body;
    await User.updateOne({ email }, { name, course });
    res.send("Profile Saved");
  } catch (err) {
    res.status(500).send("Profile could not be saved");
  }
});

app.get("/profile/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json({ name: user.name, course: user.course, email: user.email });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get("/calendarTasks/:email", async (req, res) => {
  try {
    const tasks = await CalendarTask.find({ email: req.params.email });
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Could not load calendar tasks");
  }
});

app.post("/addCalendarTask", async (req, res) => {
  try {
    const { email, date, task } = req.body;
    await CalendarTask.create({ email, date, task });
    res.send("Calendar Task Added");
  } catch (err) {
    res.status(500).send("Calendar task could not be added");
  }
});

app.delete("/deleteCalendarTask/:id", async (req, res) => {
  try {
    await CalendarTask.findByIdAndDelete(req.params.id);
    res.send("Calendar Task Deleted");
  } catch (err) {
    res.status(500).send("Calendar task could not be deleted");
  }
});

app.listen(3000, () => {
  console.log('Server is running: http://localhost:3000 ');
});