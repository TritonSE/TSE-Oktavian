const { v4: uuidv4 } = require("uuid");

const { REGISTER_SECRET } = require("../constants");
const { User, PasswordReset, Role } = require("../models");
const { ServiceError } = require("./errors");
const { sendEmail } = require("./email");

// User model fields that are editable by normal users (editing themselves) and admins (editing anyone)
const USER_EDITABLE = new Set([
  "phone",
  "discord_username",
  "github_username",
  "linkedin_username",
]);
const ADMIN_EDITABLE = new Set([...USER_EDITABLE, "email", "name", "graduation", "role", "active"]);

async function createUser(raw_user) {
  let user = await User.findOne({ email: raw_user.email }).exec();
  if (raw_user.secret !== REGISTER_SECRET) {
    throw ServiceError(403, "Invalid secret value");
  }
  if (user) {
    throw ServiceError(409, "Email already taken");
  }

  const pending_role = await Role.findOne({ name: "Pending" }).exec();
  // TODO - Enable users to input these fields on account creation or make these fields optional
  const raw_user_no_secret = {
    ...raw_user,
    phone: "(xxx)xxx-xxxx",
    github_username: "github_user",
    graduation: new Date().getFullYear(),
    role: pending_role._id,
  };

  delete raw_user_no_secret.secret;
  user = new User(raw_user_no_secret);
  await user.save();
  user.role = pending_role;
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
 * Returns an array of all users in Oktavian
 */
async function getAllUsers() {
  return User.find().populate("role").exec();
}

/**
 * Edit a user object.
 * @param rawUser The edited user object.
 * @param editingUser The user who is doing the editing.
 */
async function editUser(rawUser, editingUser) {
  let editableFields = USER_EDITABLE;
  if (editingUser.role != null && editingUser.role.permissions.user_edit) {
    editableFields = ADMIN_EDITABLE;
  } else if (editingUser._id.toString() !== rawUser._id) {
    throw ServiceError(403, "You do not have permission to edit other users");
  }
  const editedUser = await User.findOne({ _id: rawUser._id });
  if (editedUser === null) {
    throw ServiceError(404, "User does not exist");
  }
  for (const [field, newValue] of Object.entries(rawUser)) {
    if (
      field === "_id" ||
      // eslint-disable-next-line eqeqeq
      (editedUser[field] != undefined && newValue.toString() === editedUser[field].toString())
    ) {
      continue;
    }
    if (editableFields.has(field)) {
      editedUser[field] = newValue;
    } else {
      throw ServiceError(403, `You do not have permission to edit the '${field}' field`);
    }
  }
  return editedUser.save();
}

module.exports = {
  createUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsers,
  editUser,
};
