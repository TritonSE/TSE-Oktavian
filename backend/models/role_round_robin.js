const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * A role round robin object represents the state associated with the 
 * round-robin process for a particular application role.
 *
 * Whenever a new review is created, it will refer to the RRR object matching
 * the application's role. The user at the head of the queue is assigned to be the reviewer for
 * the new review. Once the assignment has been made, the person is re-inserted at the end.
 */
module.exports = mongoose.model("RoleRoundRobin", new Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  reviewers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
}));
