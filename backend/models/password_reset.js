const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * Used for resetting a user's password in the event that they forget it.
 * The token is a unique, alphanumeric, auto-generated string.
 */
module.exports = mongoose.model(
  "PasswordReset",
  new Schema(
    {
      token: {
        type: String,
        required: true,
        unique: true,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  )
);
