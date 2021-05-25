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
  return Role.findById(role_id);
}

/**
 * Return the role with the specified name
 */
async function getRoleByName(name) {
  return Role.findOne({ name });
}

/**
 * Edit an existing role
 */
async function editRole(rawRole) {
  const role = await Role.findById(rawRole._id);
  if (role === null) {
    throw ServiceError(404, "Role does not exist");
  }
  if (role.builtin && role.name !== rawRole.name) {
    throw ServiceError(400, `Builtin role '${role.name}' cannot be renamed`);
  }
  if (role.builtin !== rawRole.builtin) {
    throw ServiceError(400, `Cannot change whether '${role.name}' is a builtin role`);
  }
  role.set(rawRole);
  return role.save();
}

/**
 * Create a new role
 */
async function createRole(rawRole) {
  const role = await getRoleByName(rawRole.name);
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
  if (role.builtin) {
    throw ServiceError(400, `Builtin role '${role.name}' cannot be deleted`);
  }

  const unassignedRole = await getRoleByName("Unassigned");

  const usersWithRole = await User.find({ role }).exec();
  await Promise.all(
    usersWithRole.map(async (user) => {
      user.role = unassignedRole._id;
      return user.save();
    })
  );

  return role.delete();
}

/**
 * Generate builtin roles if they don't already exist
 */
async function ensureBuiltinRolesExist() {
  const rawRoles = [
    {
      name: "Pending",
      builtin: true,
      permissions: {},
    },
    {
      name: "Unassigned",
      builtin: true,
      permissions: {
        roster: true,
      },
    },
  ];
  return Promise.all(
    rawRoles.map(async (rawRole) => {
      let role = await getRoleByName(rawRole.name);
      console.log([rawRole, role]);
      if (role === null) {
        role = await new Role(rawRole).save();
        console.log(`Created builtin role '${rawRole.name}'`);
      }
      return role;
    })
  );
}

module.exports = {
  getRoles,
  getRole,
  getRoleByName,
  editRole,
  createRole,
  deleteRole,
  ensureBuiltinRolesExist,
};
