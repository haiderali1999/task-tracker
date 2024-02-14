const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const { userModal } = require("./models/user");
const { exerciseModel } = require('./models/task');

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  console.log("mongo db connected")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;

    const newUser = new userModal({ username })

    const saveUserRes = await userModal.create(newUser)
    res.json({ username: saveUserRes.username, _id: saveUserRes._id }).status(201)
  } catch (error) {
    res.json(error)
  }

})

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    debugger
    const { _id } = req.params
    const userExist = await userModal.findById({ _id: _id })
    if (userExist) {
      delete req.body[":_id"]
      req.body._id = _id
      const insertExercise = { ...req.body, username: userExist._doc.username }
      const excercise = new exerciseModel(insertExercise)
      const insertedExercise = await excercise.save()
      res.json(insertedExercise).status(201)
    }
  } catch (error) {
    res.json(error)
  }

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
