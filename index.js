const mongoose = require("mongoose");
const express = require("express");
const req = require("express/lib/request");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema, "Teachers");

const ratingSchema = new mongoose.Schema(
  {
    username: { type: String },
    teacher: { type: String },
    comment: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema, "Rating");

app.get("/", async (req, res) => {
  const teachers = await Teacher.find({}).sort({ createdAt: -1 });
  res.render("teachers.ejs", { teachers });
});

app.get("/ratings", async (req, res) => {
  const ratings = await Rating.find({}).sort({ createdAt: -1 });
  res.render("ratings.ejs", { ratings });
});

app.post("/add/rating", async (req, res) => {
  const newRating = await new Rating({
    username: req.body.username,
    teacher: req.body.teacher,
    comment: req.body.comment,
    rating: req.body.rating,
  }).save();
  res.json(newRating);
});

app.post("/add/teacher", async (req, res) => {
  const newTeacher = await new Teacher({
    name: req.body.name,
    department: req.body.department,
    image: req.body.image,
  }).save();

  res.json(newTeacher);
});

// Create a dynamic delete route to remove a teacher by their ID


app.delete('/delete/teacher/:_id', async (req, res) =>{
const response = await Teacher.findOneAndDelete({_id: req.params._id})
res.json(response)
})
  


app.delete('/delete/ratings/:_id', async (req, res) =>{
  const response = await Rating.findOneAndDelete({_id: req.params._id})
  res.json(response)
  })

 //resonse in line 75 and line 76 can change in words but must match in name always




async function startServer() {
  await mongoose.connect(
    "mongodb+srv://SE12:CSH2025@cluster0.u9yhg.mongodb.net/CSHteachers?retryWrites=true&w=majority&appName=Cluster0"
  );

  app.listen(3000, () => {
    console.log(`Server running.`);
  });
}

startServer();
