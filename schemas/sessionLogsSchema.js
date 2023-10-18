const mongoose = require("mongoose")

const sessionLogsSchema = new mongoose.Schema({
    userID: {
        // this dictates that the type will be an object id
        type: mongoose.Schema.Types.ObjectId,
        // referencing the users model
        ref: "users",
        required: true
    },
    details: {
        // mixed data type, similar to jsonb (binary json) in rails. Offers a flexible data type.
        type: mongoose.Schema.Types.Mixed
    }
})

module.exports = mongoose.model("sessionLogs", sessionLogsSchema, "sessionLogs")