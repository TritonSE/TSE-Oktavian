const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * In order for a role to be able to be applied to, it must have an ApplicationPipeline
 * object attached to it. This pipeline determines some of the criteria necessary
 * for applications to be processed. Notably, the pipeline contains a subset of users,
 * who have been assigned to review all of the applications corresponding to the pipeline's role.
 *
 * The basic process looks like such:
 *  1. Let's say a new review needs to be created for the role 'Developer'. We need to choose
 *  a user to review this role.
 *  2. We first access the pipeline object for the 'Developer' role.
 *  3. We then look at the pipeline's queue.
 *  4. The first user at the head of the queue is assigned to the review.
 *  5. This user then gets moved to the end of the pipeline's queue.
 *  6. Both the review and pipeline objects are updated.
 *
 * Pipelines can be constructed in the admin dashboard. Currently, there are three roles that
 * need pipelines: 'Developer', 'Designer', 'Project Manager', but the system is flexible
 * enough to support a pipeline for any role if need be.
 */
module.exports = mongoose.model(
  "ApplicationPipeline",
  new Schema({
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
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
  })
);
