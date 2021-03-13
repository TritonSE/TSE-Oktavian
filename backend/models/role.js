const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * A role is the most fundamental unit in Oktavian. It represents
 * the position of a member in the organization. For example: Developer,
 * Designer, VP Operations, President.
 *
 * A role also carries certain permissions. There are four permissions:
 *  1. permit_apply = If true, prospective applicants are allowed to submit applications for
 *  this role. The applications will reference this role object.
 *    Examples: Developer, Designer, Project Manager
 *  2. permit_regular_review = If true, users who belong to this role can be involved with the
 *  recruitment process. This grants them access to the recruitment dashboard.
 *    Examples: President, VP ..., Project Manager
 *  3. permit_final_review = If true, users who belong to this role can be involved with the
 *  final review decision making. This gives them the final say in any application.
 *    Examples: President
 *  4. permit_admin = If true, users who belong to this role can create/edit/delete roles,
 *  promote/demote/deactivate users, and have access to the administrative dashboard.
 *    Examples: President, VP ...
 *
 *  Almost all critical objects refer to a role. Users have a role that they belong to,
 *  and applications also refer to a role (the position they are applying for).
 */
module.exports = mongoose.model(
  "Role",
  new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permit_apply: {
      type: Boolean,
      required: true,
    },
    permit_regular_review: {
      type: Boolean,
      required: true,
    },
    permit_final_review: {
      type: Boolean,
      required: true,
    },
    permit_admin: {
      type: Boolean,
      required: true,
    },
  })
);
