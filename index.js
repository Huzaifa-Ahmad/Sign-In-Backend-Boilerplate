require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Importing Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

// Connecting to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB!");
  }
);

// Middleware
app.use(express.json());
// Route Middleware
const port = 3000;
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

app.listen(port, () =>
  console.log(`The Server at port ${port} is Up and Running!`)
);
