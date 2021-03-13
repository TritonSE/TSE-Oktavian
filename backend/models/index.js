const Application = require("./application");
const Review = require("./review");
const User = require("./user");
const Role = require("./role");
const RoleRoundRobin = require("./role_round_robin");
const PasswordReset = require("./password_reset");

module.exports = {
  // General
  User,
  PasswordReset,
  Role,
  // Recruitment
  Application,
  Review,
  RoleRoundRobin,
};
