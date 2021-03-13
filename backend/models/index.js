const Application = require("./application");
const Review = require("./review");
const User = require("./user");
const Role = require("./role");
const Committee = require("./committee");
const PasswordReset = require("./password_reset");

module.exports = {
  // General
  User,
  PasswordReset,
  Role,
  // Recruitment
  Application,
  Review,
  Committee,
};
