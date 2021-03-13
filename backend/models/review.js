const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * A review is uniquely defined by three objects: an application, a user, and a stage. You can think
 * of it like a triplet containing all three.
 * 
 * More specifically, a review represents the a decision made on an application by a reviewer (the user)
 * at a specific stage. For example, a review could be summarized as "John Doe is reviewing Jane Doe's 
 * application at the RESUME stage." A review has comments, a rating and an acceptance decision associated
 * with it that change over the lifetime of the review. An application usually has several reviews associated
 * with it. A rejection review terminates the candidancy of that application. An acceptance review causes
 * the application to proceed to the next stage, resulting in the creation of a new review if not on the final
 * stage. Only at most one review per application can be considered not completed; this is the "latest" review
 * of the application.
 */
module.exports = mongoose.model("Review", new Schema(
  {
    // Immutable
    application: {
      type: mongoose.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    reviewer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stage: {
      type: String,
      required: true,
    },
    // Mutable
    comments: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
));
