const { ApplicationPipeline, User, Role } = require("../models");

const { ServiceError } = require("./errors");

/**
 * Return a list of all ApplicationPipeline objects
 */
async function getAllPipelines() {
  return ApplicationPipeline.find();
}

/**
 * Create a new ApplicationPipeline for a specified role and reviewers. Must first
 * check that there are no existing ApplicationPipelines already using the specified role.
 *
 * @param role - string MongoId of a role
 * @param reviewers - array of strings of reviewer MongoId's
 */
async function createApplicationPipeline(role, reviewers) {
  // Throw error another ApplicationPipeline already exists with the given role or if
  // role does not exist
  if (
    (await ApplicationPipeline.findOne({ role }).exec()) ||
    (await Role.count(role).exec()) === 0
  ) {
    throw ServiceError(400, `Role already has an ApplicationPipeline use or does not exist`);
  }

  // Throw error if an invalid reviewer is found
  if ((await User.count({ _id: { $in: reviewers } }).exec()) !== reviewers.length) {
    throw ServiceError(400, "Invalid reviewer id detected");
  }

  const pipeline = new ApplicationPipeline({ role, reviewers });
  return pipeline.save();
}

/**
 * Updates the role and reviewers field of the matching ApplicationPipeline object.
 *
 * @param pipeline_id - MongoId of ApplicationPipeline to modify
 * @param role - Updated value of role
 * @param reviewers - Updated array of reviewers
 */
async function updateApplicationPipeline(pipeline_id, role, reviewers) {
  // Check ApplicationPipeline object exists with specified pipeline_id
  const pipeline = await ApplicationPipeline.findOne({ _id: pipeline_id }).exec();
  if (!pipeline) {
    throw ServiceError(400, "Invalid or missing ApplicationPipeline ID");
  }

  // Modify role field
  if (role) {
    // Throw error another ApplicationPipeline already exists with the given role or if
    // role does not exist
    const duplicatePipeline = await ApplicationPipeline.findOne({ role }).exec();
    if (
      (duplicatePipeline && duplicatePipeline._id !== pipeline_id) ||
      (await Role.count(role)) === 0
    ) {
      throw ServiceError(400, `Role already has an ApplicationPipeline use or does not exist`);
    }

    pipeline.role = role;
  }

  // Modify reviewers field
  if (reviewers) {
    // Throw error if an invalid reviewer is found
    if ((await User.count({ _id: { $in: reviewers } }).exec()) !== reviewers.length) {
      throw ServiceError(400, "Invalid reviewer id detected");
    }

    pipeline.reviewers = reviewers;
  }

  return pipeline.save();
}

/**
 * Delete the ApplicationPipline associated with the given MongoId
 *
 * @param pipeline_id - MongoId of ApplicationPipeline to delete
 */
async function deleteApplicationPipeline(pipeline_id) {
  return ApplicationPipeline.deleteOne({ _id: pipeline_id });
}

module.exports = {
  getAllPipelines,
  createApplicationPipeline,
  updateApplicationPipeline,
  deleteApplicationPipeline,
};
