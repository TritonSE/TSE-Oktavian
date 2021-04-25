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
      enum: ["Outreach", "Design", "Development", "Post Development"],
      required: true,
    },
    timeline: {
      start: {
        quarter: {
          type: String,
          enum: ["Fall", "Winter", "Spring", "Summer"],
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
          enum: ["Fall", "Winter", "Spring", "Summer"],
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
        required: false,
      },
    ],
    developers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
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
