const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * A role is the most fundamental unit in Oktavian. It represents
 * the position of a member in the organization. For example: Developer,
 * Designer, VP Operations, President.
 *
 * A role also carries certain permissions:
 *  1. roster = If true, users who belong to this role can view the organization
 *  roster. This grants them access to other users' profiles & the global roster list.
 *  2. recruitment = If true, users who belong to this role can be involved with the
 *  recruitment process. This grants them access to the recruitment dashboard.
 *  3. final_approval = If true, users who belong to this role can be involved with the
 *  final review decision making. This gives them the final say in any application.
 *  Note that they need the `recruitment` permission to be able to see application details.
 *  4. admin = If true, users who belong to this role can create/edit/delete roles,
 *  promote/demote/deactivate users, and have access to the administrative dashboard.
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
    permissions: {
      roster: {
        type: Boolean,
        required: true,
        default: false,
      },
      recruitment: {
        type: Boolean,
        required: true,
        default: false,
      },
      final_approval: {
        type: Boolean,
        required: true,
        default: false,
      },
      admin: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  })
);
