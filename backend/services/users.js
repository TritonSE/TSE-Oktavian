const { v4: uuidv4 } = require("uuid");

const { REGISTER_SECRET } = require("../constants");
const { User, PasswordReset, Role } = require("../models");
const { ServiceError } = require("./errors");
const { sendEmail } = require("./email");
const { getRoleByName } = require("./roles");

// User model fields that are editable by normal users (editing themselves) and admins (editing anyone)
const USER_EDITABLE = new Set([
  "phone",
  "grad_quarter",
  "graduation",
  "discord_username",
  "github_username",
  "linkedin_username",
]);
const ADMIN_EDITABLE = new Set([...USER_EDITABLE, "email", "name", "role", "active"]);

async function createUser(raw_user) {
  let user = await User.findOne({ email: raw_user.email }).exec();
  if (raw_user.secret !== REGISTER_SECRET) {
    throw ServiceError(403, "Invalid secret value");
  }
  if (user) {
    throw ServiceError(409, "Email already taken");
  }

  const pending_role = await getRoleByName("Pending");
  // TODO - Enable users to input these fields on account creation or make these fields optional
  const raw_user_no_secret = {
    ...raw_user,
    phone: "(xxx)xxx-xxxx",
    github_username: "github_user",
    role: pending_role._id,
  };

  delete raw_user_no_secret.secret;
  user = new User(raw_user_no_secret);
  await user.save();
  user.role = pending_role; // Populate role field in returned user object
  return user;
}

async function forgotPassword(data) {
  if (data.secret !== REGISTER_SECRET) {
    throw ServiceError(403, "Invalid secret value");
  }
  const user = await User.findOne({ email: data.email }).exec();
  // End users should not know if the user exists
  if (user == null) {
    return;
  }
  const password_reset = PasswordReset({
    token: uuidv4(),
    user: user._id,
  });
  await password_reset.save();
  await sendEmail("password-reset", data.email, {
    token: password_reset.token,
  });
}

async function resetPassword(data) {
  const password_reset = await PasswordReset.findOne({ token: data.token }).populate("user").exec();
  if (password_reset == null) {
    throw ServiceError(403, "Invalid or expired token");
  }
  const time_since_creation = Math.abs(Date.now() - password_reset.created_at) / 36e5;
  if (time_since_creation >= 1) {
    await PasswordReset.deleteOne({ _id: password_reset._id }).exec();
    throw ServiceError(403, "Invalid or expired token");
  }
  const { user } = password_reset;
  user.password = data.password;
  await user.save();
  await PasswordReset.deleteOne({ _id: password_reset._id }).exec();
}

async function changePassword(data) {
  const { user, password } = data;
  user.password = password;
  await user.save();
}

/**
 * Returns an array of all users according to an optional filter parameter
 * @param filter - JSON object specifying field and target value pairs
 */
async function getUsers(filter) {
  return User.find(filter).populate("role").exec();
}

/**
 * Returns a specific user according to provided user_id
 * @param user_id - _id of user
 */
async function getUser(user_id) {
  return User.findById(user_id).populate("role").exec();
}

/**
 * Edit a user object
 * @param rawUser The edited user object
 * @param editingUser The user who is doing the editing
 */
async function editUser(rawUser, editingUser) {
  let editableFields = USER_EDITABLE;
  if (editingUser.role != null && editingUser.role.permissions.user_edit) {
    editableFields = ADMIN_EDITABLE;
  } else if (editingUser._id.toString() !== rawUser._id) {
    throw ServiceError(403, "You do not have permission to edit other users");
  }
  const editedUser = await User.findOne({ _id: rawUser._id }).populate("role");
  if (editedUser === null) {
    throw ServiceError(404, "User does not exist");
  }
  for (const [field, newValue] of Object.entries(rawUser)) {
    if (
      field === "_id" ||
      // eslint-disable-next-line eqeqeq
      (editedUser[field] != undefined && newValue.toString() === editedUser[field].toString()) ||
      newValue.toString() === editedUser.role._id.toString()
    ) {
      continue;
    }
    if (editableFields.has(field)) {
      if (field === "role") {
        if (editedUser.role.name === "Pending") {
          throw ServiceError(403, "You cannot change the role of a Pending user.");
        }
        // eslint-disable-next-line no-await-in-loop
        const new_role = await Role.findById(newValue);
        if (!new_role) {
          throw ServiceError(404, "Role does not exist.");
        }
        if (new_role.name === "Pending") {
          throw ServiceError(403, "You cannot set a user's role to Pending");
        }
      }
      editedUser[field] = newValue;
    } else {
      throw ServiceError(403, `You do not have permission to edit the '${field}' field`);
    }
  }
  return editedUser.save();
}

/**
 * Delete a user object
 * @param _id The id of the user being deleted
 */
async function deleteUser(_id) {
  return User.deleteOne({ _id });
}

/**
 * Activate a user (ie. change a user role from pending to another role)
 * @param user_id The id of the user to be activated
 * @param role_id The id of the role to give to the user
 */
async function activateUser(user_id, role_id) {
  const user = await User.findById(user_id).populate("role");
  if (!user) {
    throw ServiceError(404, "User does not exist.");
  }
  if (user.role.name !== "Pending") {
    throw ServiceError(403, "User is already activated.");
  }
  const role = await Role.findById(role_id);
  if (!role) {
    throw ServiceError(404, "Role does not exist.");
  }
  user.role = role_id;
  return user.save();
}

module.exports = {
  createUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getUsers,
  getUser,
  editUser,
  deleteUser,
  activateUser,
};
