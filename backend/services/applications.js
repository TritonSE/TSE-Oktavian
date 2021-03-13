const { STAGES, PUBLIC_ROLES, FINAL_ROLE } = require("../constants");
const { Application, Review, RoleRoundRobin } = require("../models");
const { ServiceError } = require("./errors");
const { sendEmail } = require("./email");

/**
 * Assigns the given reviewer to the application by creating a new review.
 */
async function assignApplication(application, reviewer) {
  const review = new Review({
    application: application._id,
    reviewer: reviewer._id,
    stage: application.current_stage,
  });
  await review.save();
  await sendEmail("reviewer-assignment", reviewer.email, {
    current_stage: application.current_stage,
    role: application.role,
    applicant: application.name,
    reviewer: reviewer.name,
  });
}

/**
 * Auto-assigns a reviewer to a specific application.
 * Uses a modified round-robin algorithm to ensure fairness and to make sure
 * applications preferably don't end up with the same reviewer assigned to two stages
 */
async function autoAssignApplication(application) {
  let role = application.role;
  // Special case: president(s) make the final decision
  if (application.current_stage === STAGES[STAGES.length - 1]) {
    role = FINAL_ROLE;
  }
  const rrr = await RoleRoundRobin.findOne({ role: role })
    .populate("users")
    .exec();
  if (rrr == null || rrr.reviewers.length === 0) {
    throw ServiceError(
      400,
      "Unable to auto-assign any reviewer to application"
    );
  }
  // Find first reviewer in the round robin list not in past reviewers
  const past_reviews = await Review.find({
    application: application._id,
  }).exec();
  const past_reviewers = new Set(
    past_reviews.map((review) => review.reviewer.toString())
  );
  // In the case where no reviewer is new, just use the first person
  let ridx = 0;
  for (let [i, reviewer] of rrr.reviewers.entries()) {
    if (!past_reviewers.has(reviewer._id.toString())) {
      ridx = i;
      break;
    }
  }
  const reviewer = rrr.reviewers[ridx];
  rrr.reviewers.splice(ridx, 1);
  rrr.reviewers.push(reviewer);
  await rrr.save();
  await assignApplication(application, reviewer);
}

/**
 * Given an application object and the acceptance result of the last review,
 * either terminates or advances the application. An advancement can either
 * imply a final acceptance or another review (with the stage advanced).
 */
async function advanceApplication(application, review_accepted) {
  const old_completed = application.completed;
  const old_accepted = application.accepted;
  const old_stage = application.current_stage;
  if (review_accepted) {
    if (application.current_stage === STAGES[STAGES.length - 1]) {
      application.completed = true;
      application.accepted = true;
    } else {
      const idx = STAGES.indexOf(application.current_stage);
      if (idx === -1) {
        throw ServiceError(
          400,
          "Application has invalid stage '" + application.current_stage + "'"
        );
      }
      application.current_stage = STAGES[idx + 1];
    }
  } else {
    application.completed = true;
    application.accepted = false;
  }
  await application.save();
  if (application.completed) {
    if (application.accepted) {
      await sendEmail("applicant-acceptance", application.email, {
        name: application.name,
      });
    } else {
      await sendEmail("applicant-rejection", application.email, {
        name: application.name,
        role: application.role,
      });
    }
  } else {
    try {
      await autoAssignApplication(application);
    } catch (err) {
      // Rollback application update
      application.completed = old_completed;
      application.accepted = old_accepted;
      application.current_stage = old_stage;
      await application.save();
      throw err;
    }
  }
}

/*
 * Given a JSON object representing some application, saves it into the database
 * and auto-assigns it a reviewer.
 *
 * raw_application = { name: ..., role: ..., year: ..., etc. }
 */
async function createApplication(raw_application) {
  if (!PUBLIC_ROLES.includes(raw_application.role)) {
    throw ServiceError(400, "Invalid application role");
  }
  let application = await Application.findOne({
    role: raw_application.role,
    email: raw_application.email,
    completed: false,
  }).exec();
  if (application != null) {
    throw ServiceError(400, "Previous application is still in review");
  }
  application = new Application(raw_application);
  await application.save();
  try {
    await autoAssignApplication(application);
  } catch (err) {
    // Rollback application creation
    await Application.findByIdAndDelete(application._id);
    throw err;
  }
  await sendEmail("applicant-confirmation", raw_application.email, {
    name: raw_application.name,
    role: raw_application.role,
  });
  return application;
}

/**
 * Returns a list of JSON objects representing all applications in the system.
 * Can be filtered using options (e.g. to fetch only open applications, etc.)
 */
async function getAllApplications(options) {
  return await Application.find({ ...options }).exec();
}

/**
 * Returns a JSON object representing an application given an ID.
 */
async function getApplication(application_id) {
  return await Application.findOne({ _id: application_id }).exec();
}

module.exports = {
  assignApplication,
  autoAssignApplication,
  advanceApplication,
  createApplication,
  getAllApplications,
  getApplication,
};
