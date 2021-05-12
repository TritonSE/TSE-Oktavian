const { Role } = require("../models");
const { ServiceError } = require("./errors");

/**
 * Returns an array of all roles in Oktavian
 */
async function getAllRoles() {
  return Role.find();
}

/**
 * Edit an existing role
 */
async function editRole(rawRole) {
  const role = await Role.findById(rawRole._id);
  if (role === null) {
    throw ServiceError(404, "Role does not exist");
  }
  role.set(rawRole);
  return role.save();

  // for (const [key, value] of Object.entries(rawRole)) {
  //   if (key == "_id") continue;
  //   if (`permissions.${key}` in Role.schema.paths) {
  //     role.permissions[key] = value;
  //   } else {
  //     throw ServiceError(400, `Unrecognized attribute ${key}`);
  //   }
  // }

  // return role.save();
}

/**
 * Create a new role
 */
async function createRole(rawRole) {
  const role = await Role.findOne({ name: rawRole.name });
  if (role !== null) {
    throw ServiceError(409, `A role named '${rawRole.name}' already exists`);
  }
  return Role.create(rawRole);
}

module.exports = {
  getAllRoles,
  editRole,
  createRole,
};
