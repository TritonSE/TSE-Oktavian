const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const { MONGO_URI, PUBLIC_ROLES, FINAL_ROLE } = require("./constants");
const { createUserCategories } = require("./services/users");
const { initializePassport } = require("./middleware/auth");

// Database
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(MONGO_URI);
mongoose.connection.once("open", async () => {
  console.log("A connection to MongoDB has been established.");
  let new_roles = await createUserCategories([...PUBLIC_ROLES, FINAL_ROLE]);
  if (new_roles.length > 0) {
    console.log(`Default user categories for [${new_roles}] were created.`);
  }
});

const app = express();

// Middleware
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));

// Authentication
app.use(initializePassport());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/stats", require("./routes/stats"));
app.get(["/", "/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
/* eslint-disable no-unused-vars */
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ message: err.message });
});
/* eslint-enable no-unused-vars */

module.exports = app;
