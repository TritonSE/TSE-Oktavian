require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "8000",
  REGISTER_SECRET: process.env.REGISTER_SECRET || "tritonse",
  JWT_SECRET: process.env.JWT_SECRET || "keyboard cat",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tse-oktavian",
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  DEPLOYMENT_URL: process.env.DEPLOYMENT_URL || "http://localhost:3000",
  STAGES: ["Resume 1", "Resume 2", "Phone", "Interview", "Final"],
};
