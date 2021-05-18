const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * A role is the most fundamental unit in Oktavian. It represents
 * the position of a member in the organization. For example: Developer,
 * Designer, VP Operations, President.
 *
 * A role also carries certain permissions, which are described below.
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
      /**
       * View the organization roster and other users' profiles.
       */
      roster: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Participate in the recruitment process. Grants access to the recruitment dashboard.
       */
      recruitment: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Final review decision making. Gives the user the final say in any application. Note that
       * the user needs the `recruitment` permission to be able to see application details.
       */
      final_approval: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Edit other users' profiles and assign roles.
       */
      user_edit: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Edit existing projects.
       */
      project_edit: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Create new projects.
       */
      project_create: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Create, edit, and delete roles.
       */
      role_management: {
        type: Boolean,
        required: true,
        default: false,
      },
      /**
       * Activate and deactivate user accounts.
       */
      account_activation: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  })
);
