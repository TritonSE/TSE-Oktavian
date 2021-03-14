const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * A committee represents a subset of the users of TSE, who have been assigned to review
 * applications corresponding to a particular role.
 *
 * The basic process looks like such:
 *  1. Let's say a new review needs to be created for the role 'Developer'. We need to choose
 *  a priviledged user to review this role.
 *  2. We first access the committee object for the 'Developer' role.
 *  3. We then look at the committee's queue.
 *  4. The first user at the head of the committee is assigned to the review.
 *  5. This user then gets moved to the end of the committee's queue.
 *  6. Both the review and committee objects are updated.
 *
 * In order for a role to be able to be applied to, it must have a matching committee object.
 * Committees can be put together in the admin dashboard. There are really only 3 roles that
 * need committees: 'Developer', 'Designer', 'Project Manager', but the system is flexible
 * enough to a committee for any role if need be.
 */
module.exports = mongoose.model(
  "Committee",
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
