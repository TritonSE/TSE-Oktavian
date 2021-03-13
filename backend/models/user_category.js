const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * A user category represents the state associated with the round-robin process for a
 * particular application type. 
 *
 * For a particular application type/role, it contains a queue of users who are cleared to potentially 
 * review the application at any stage. Whenever a new review is created, it will refer to the 
 * application's role's user category to select the next reviewer (the person at the head of the queue).
 * Once the assignment has been made, then the person is re-inserted at the end of the queue.
 */
module.exports = mongoose.model("UserCategory", new Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
}));
