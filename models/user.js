const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true }
})

const userModal = mongoose.model("people", userSchema)

module.exports = { userModal }