const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const config = require("./config");
const { createUserCategories } = require("./services/users");

// Database
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(config.db.uri);
mongoose.connection.once("open", async () => {
  console.log("Established connection to MongoDB.");
  let new_roles = await createUserCategories([
    ...config.roles,
    config.final_role,
  ]);
  console.log(`Created default user categories for [${new_roles}].`);
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
require("./middleware/passport")();
app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/stats", require("./routes/stats"));
app.get(["/", "/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
