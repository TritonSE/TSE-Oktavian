const { Role } = require("../models");

/**
 * Returns an array of all roles in Oktavian
 */
async function getAllRoles() {
  return Role.find();
}

module.exports = {
  getAllRoles,
};
