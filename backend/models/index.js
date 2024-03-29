const Application = require("./application");
const Review = require("./review");
const User = require("./user");
const Role = require("./role");
const ApplicationPipeline = require("./application_pipeline");
const PasswordReset = require("./password_reset");
const Project = require("./project");

module.exports = {
  // General
  User,
  PasswordReset,
  Role,
  // Recruitment
  Application,
  Review,
  ApplicationPipeline,
  Project,
};
