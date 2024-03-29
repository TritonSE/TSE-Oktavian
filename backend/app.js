const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const { MONGO_URI, NODE_ENV } = require("./constants");
const { initializePassport } = require("./middleware/auth");
const { createMockData } = require("./services/mock");
const { ensureBuiltinRolesExist } = require("./services/roles");

// Database
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(MONGO_URI);
mongoose.connection.once("open", async () => {
  console.log("A connection to MongoDB has been established.");
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
app.use("/api/users", require("./routes/users"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/pipelines", require("./routes/pipelines"));
app.use("/api/projects", require("./routes/projects"));

app.get(["/", "/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  if (err.status === 500 || err.status == null) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong on the server" });
  } else {
    res.status(err.status).json({ message: err.message });
  }
});
/* eslint-enable no-unused-vars */

// Generate builtin roles
ensureBuiltinRolesExist()
  .then(() => {
    console.log("Builtin roles have been generated (if necessary).");

    // Generate mock data
    if (NODE_ENV === "development") {
      createMockData()
        .then(() => {
          console.log("Mock data has been generated.");
        })
        .catch((err) => {
          console.log(`Error generating mock data: ${err}`);
        });
    } else {
      console.log("Ignoring mock data generation.");
    }
  })
  .catch((err) => {
    console.log(`Error generating builtin roles: ${err}`);
  });

module.exports = app;
