const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const config = require('../config');
const { User, UserCategory, PasswordReset } = require('../models');
const { ServiceError } = require('./errors')
const { sendEmail } = require('./email');

async function createUser(raw_user) {
  let user = await User.findOne({email : raw_user.email}).exec();
  if (raw_user.secret !== config.auth.register_secret) {
    throw ServiceError(403, "Invalid secret value");
  }
  if (user) {
    throw ServiceError(409, "Email already taken");
  }
  user = new User(raw_user);
  await user.save();
  for (let role of raw_user.roles) {
    if (typeof role === 'string') {
      let category = await UserCategory.findOne({ role: role }).exec();
      if (category != null) {
        category.users.push(user);
        await category.save();
      }
    }
  }
  return user;
}

async function createUserCategories(roles) {
  let new_roles = [];
  for (let role of roles) {
    let category = await UserCategory.findOne({role: role}).exec();
    if (category == null) {
      category = UserCategory({role: role});
      await category.save();
      new_roles.push(role);
    }
  }
  return new_roles;
}

async function forgotPassword(data) {
  if (data.secret !== config.auth.register_secret) {
    throw ServiceError(403, "Invalid secret value");
  }
  const user = await User.findOne({email: data.email}).exec();
  // End users should not know if the user exists
  if (user == null) {
    return;
  }
  let password_reset = PasswordReset({
    token: uuidv4(),
    user: user._id
  });
  await password_reset.save();
  await sendEmail('password-reset', data.email, {
    token: password_reset.token
  });
}

async function resetPassword(data) {
  const password_reset = await PasswordReset.findOne({token: data.token}).populate('user').exec();
  if (password_reset == null) {
    throw ServiceError(403, "Invalid or expired token");
  }
  const time_since_creation = Math.abs(Date.now() - password_reset.created_at) / 36e5;
  if (time_since_creation >= 1) {
    await PasswordReset.deleteOne({_id: password_reset._id}).exec();
    throw ServiceError(403, "Invalid or expired token");
  }
  const user = password_reset.user;
  user.password = data.password;
  await user.save();
  await PasswordReset.deleteOne({_id: password_reset._id}).exec();
}

module.exports = {
  createUser,
  createUserCategories,
  forgotPassword,
  resetPassword
};
