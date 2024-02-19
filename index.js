const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const mongoose = require("mongoose")
const { userModal } = require("./models/user")
const { exerciseModel } = require("./models/task")

app.use(cors())
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(process.env.MONGO_URL)
  console.log("mongo db connected")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/api/users", async (req, res) => {
  try {
    debugger
    const userList = await userModal.find({})
    res.json(userList)
  } catch (error) {
    res.json({ error: error })
  }
})

app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body

    const newUser = new userModal({ username })

    const saveUserRes = await userModal.create(newUser)

    res.json({ username: username, _id: saveUserRes._id }).status(201)
  } catch (error) {
    res.json(error)
  }
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    debugger
    const { _id } = req.params
    const { description, duration, date } = req.body
    const userExist = await userModal.findById({ _id: _id })

    if (userExist) {
      const { username } = userExist._doc
      const dateString = date ? new Date(date) : new Date()

      const newExcercise = {
        user_id: _id,
        description,
        duration,
        date: dateString,
        username: username,
      }

      const excercise = new exerciseModel(newExcercise)
      await excercise.save()
      const returnExercise = {
        _id: _id,
        description: description,
        duration: duration,
        date: dateString.toDateString(),
        username: username,
      }

      res.json(returnExercise).status(201)
    }
  } catch (error) {
    res.json({ error: error })
    console.log(error)
  }
})

app.get("/api/users/:_id/logs", async (req, res) => {
  debugger
  const { from, to, limit } = req.query
  const { _id } = req.params
  console.log(from, to, +limit, _id)
  const userExist = userModal.findOne({ _id })
  if (!userExist) {
    res.json("User does not exist")
    return
  }
  let date = {}
  if (from) date["$gte"] = new Date(from)
  if (to) date["$lte"] = new Date(to)
  let filter = {
    user_id: _id,
  }
  if (from || to) {
    filter.date = date
  }
  const filterExercises = await exerciseModel.find(filter).limit(+limit ?? 500)
  const exerciseFormat = filterExercises.map((exercise) => {
    const { description, duration, date } = exercise
    return {
      description: description,
      duration: duration,
      date: date.toDateString(),
    }
  })
  res.json({
    username: userExist.username,
    _id,
    count: filterExercises.length,
    logs: exerciseFormat,
  })
})

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log("Your app is listening on port " + listener.address().port)
})

// http://localhost:3000/api/users/65d19ab70df4950a48b22039/exercises
