const Application = require("./application");
const Review = require("./review");
const User = require("./user");
const RoleRoundRobin = require("./role_round_robin");
const PasswordReset = require("./password_reset");

module.exports = {
  // General
  User,
  PasswordReset,
  // Recruitment
  Application,
  Review,
  RoleRoundRobin,
};
