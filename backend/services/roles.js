const { Role, User } = require("../models");
const { ServiceError } = require("./errors");

/**
 * Returns an array of all roles according to an optional filter parameter
 * @param filter - JSON object specifying field and target value pairs
 */
async function getRoles(filter) {
  return Role.find(filter);
}

/**
 * Returns a single role matching the role id
 */
async function getRole(role_id) {
  const result = Role.findOne({ _id: role_id });
  return result;
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

/**
 * Delete a role
 */
async function deleteRole(id) {
  const role = await Role.findById(id);
  if (role === null) {
    throw ServiceError(404, "Role does not exist");
  }

  const usersWithRole = await User.find({ role }).exec();
  await Promise.all(
    usersWithRole.map((user) => async () => {
      // TODO: use Unassigned role instead of having no role. https://github.com/TritonSE/TSE-Oktavian/pull/48#discussion_r630687553
      delete user.role;
      return user.save();
    })
  );

  return role.delete();
}

module.exports = {
  getRoles,
  getRole,
  editRole,
  createRole,
  deleteRole,
};
