const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: Date,
})

const exerciseModel = mongoose.model("exercise", exerciseSchema)

module.exports = { exerciseModel }