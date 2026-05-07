const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/studentApp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ success: true, email });
  } else {
    res.json({ success: false });
  }
});


app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const user = new User({ email, password });
  await user.save();

  res.send("User Created");
});


app.post("/addTask", async (req, res) => {
  const { email, task } = req.body;

  await Task.create({ email, task });

  res.send("Task Added");
});

app.get("/tasks/:email", async (req, res) => {
  const tasks = await Task.find({ email: req.params.email });
  res.json(tasks);
});

app.delete("/deleteTask/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});


app.post("/profile", async (req, res) => {
  const { email, name, course } = req.body;

  await User.updateOne({ email }, { name, course });

  res.send("Saved");
});

// Server ko chalaane ke liye
app.listen(3000, () => {
    console.log('Server is working: http://localhost:3000');
});