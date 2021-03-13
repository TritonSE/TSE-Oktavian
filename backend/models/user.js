const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  return next();
});

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      email: ret.email,
      name: ret.name,
    };
  },
});

module.exports = mongoose.model("User", UserSchema);
