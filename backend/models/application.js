const mongoose = require("mongoose");

const { Schema } = mongoose;

const { STAGES } = require("../constants");

/**
 * Represents a application submitted by a prospective member & the corresponding acceptance decision
 *
 * The immutable section of the application is submitted by the applicant and doesn't change over the lifetime
 * of the application. It contains information about the applicant (name, email, answers to questions, etc.)
 *
 * The mutable section of the application changes depending on how the application's reviews progress. The
 * application is finalized when it is marked as completed; then all sections can be considered immutable.
 */
module.exports = mongoose.model(
  "Application",
  new Schema(
    {
      // Immutable
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      role: {
        type: mongoose.Types.ObjectId,
        ref: "Role",
        required: true,
      },
      graduation: {
        // Graduation year
        type: Number,
        required: true,
      },
      resume: {
        // Link to resume
        type: String,
        required: true,
      },
      about: {
        // Answer to "Describe yourself"
        type: String,
        required: true,
      },
      why: {
        // Answer to "Why TSE?"
        type: String,
        required: true,
      },
      // Mutable
      current_stage: {
        type: String,
        required: true,
        default: STAGES[0],
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
  )
);
