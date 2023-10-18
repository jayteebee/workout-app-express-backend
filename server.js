require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

const env = process.env.NODE_ENV || "development";
let dbUri;
if (env === "production") {
  dbUri = process.env.DATABASE_URL_PROD
} else {
  dbUri = process.env.DATABASE_URL_DEV
}

mongoose.connect(dbUri, {useNewUrlParser: true})
const db = mongoose.connection
db.on("error", (err) => console.log(err))
db.once("open", () => console.log('connected to database'))

app.use(express.json())