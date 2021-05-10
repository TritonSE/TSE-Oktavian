const { Role } = require("../models");

/**
 * Returns an array of all roles in Oktavian
 */
async function getAllRoles() {
  return Role.find();
}

/**
 * Returns a single role matching the role id
 */
async function getRole(role_id) {
  const result = Role.findOne({ _id: role_id });
  return result;
}

module.exports = {
  getAllRoles,
  getRole,
};
