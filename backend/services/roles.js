const { Role } = require("../models");

async function getAllRoles() {
  return Role.find();
}

module.exports = {
  getAllRoles,
};
