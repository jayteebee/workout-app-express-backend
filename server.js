require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

// DATABASE CONNECTION
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
db.once("open", () => console.log('Database Connected'))


// MIDDLEWARE
app.use(
    cors({
      origin:  ["http://localhost:3000"],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    })
  );

  app.use(express.json())

  // PORT 
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server Started Successfully On Port: ${port}, In Environment: ${env}.`))

app.use(express.json())

