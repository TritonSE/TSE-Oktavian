const { v4: uuidv4 } = require("uuid");

const { REGISTER_SECRET } = require("../constants");
const { User, PasswordReset } = require("../models");
const { ServiceError } = require("./errors");
const { sendEmail } = require("./email");

async function createUser(raw_user) {
  let user = await User.findOne({ email: raw_user.email }).exec();
  if (raw_user.secret !== REGISTER_SECRET) {
    throw ServiceError(403, "Invalid secret value");
  }
  if (user) {
    throw ServiceError(409, "Email already taken");
  }
  const raw_user_no_secret = { ...raw_user };
  delete raw_user_no_secret.secret;
  user = new User(raw_user_no_secret);
  await user.save();
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

async function getAllUsers() {
  return User.find();
}

module.exports = {
  createUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
};
