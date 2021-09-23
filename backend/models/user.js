const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * A user represents a member of TSE. Users are defined by their personal information, their latest
 * role within the organization, and whether or not they are active.
 *
 * Passports are hashed using bcrypt with a cost factor of 10.
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  github_username: {
    type: String,
    required: false,
  },
  discord_username: {
    type: String,
    required: false,
  },
  linkedin_username: {
    type: String,
    required: false,
  },
  grad_quarter: {
    type: String,
    enum: ["Fall", "Winter", "Spring", "Summer"],
  },
  graduation: {
    // Graduation year
    type: Number,
    required: true,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false, // Refresh tokens are created the first time they are used
  },
});

UserSchema.pre("save", function preSave(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  return next();
});

UserSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.set("toJSON", {
  transform(doc, obj) {
    const ret = { ...obj };
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

module.exports = mongoose.model("User", UserSchema);
