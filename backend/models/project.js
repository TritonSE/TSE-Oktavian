const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * Represents every TSE project ever started since the dawn of time
 *
 * Contains all the people who have/are working on the project as well as other
 * information such as project timeline, relevant files, etc.
 */
module.exports = mongoose.model(
  "Project",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    phase: {
      type: String,
      required: true,
    },
    timeline: {
      start: {
        quarter: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
      },
      end: {
        quarter: {
          type: String,
          required: false,
        },
        year: {
          type: Number,
          required: false,
        },
      },
    },
    project_manager: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    outreach: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    designers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    developers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    files: [
      {
        link: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  })
);
