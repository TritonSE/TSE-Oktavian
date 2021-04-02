const mongoose = require("mongoose");

const { Review } = require("../models");
const { ServiceError } = require("./errors");
const { advanceApplication } = require("./applications");

/**
 * Given a JSON object representing partial updates to a review object, updates and saves
 * the review into the database. If the update completes the review, this will trigger
 * an application advancement.
 *
 * raw_review = { _id: ..., completed: ..., accepted: ..., comments: ..., rating: ... }
 * reviewer = User object
 */
async function updateReview(raw_review, submitter) {
  const review = await Review.findOne({ _id: raw_review._id })
    .populate({
      path: "application",
      populate: {
        path: "role",
      },
    })
    .exec();
  if (review == null) {
    throw ServiceError(400, "Could not find a review matching that ID");
  }
  const was_completed_prior = review.completed;
  if (was_completed_prior) {
    throw ServiceError(400, "A completed review cannot be edited");
  }
  if (!mongoose.Types.ObjectId(submitter._id).equals(review.reviewer)) {
    throw ServiceError(400, "Not assigned to this review");
  }
  const old_comments = review.comments;
  const old_rating = review.rating;
  const old_accepted = review.accepted;
  if ("comments" in raw_review) {
    review.comments = raw_review.comments;
  }
  if ("rating" in raw_review) {
    review.rating = raw_review.rating;
  }
  if ("completed" in raw_review) {
    review.completed = raw_review.completed;
  }
  if ("accepted" in raw_review) {
    review.accepted = raw_review.accepted;
  }
  if (review.completed && review.comments === "") {
    throw ServiceError(400, "Comments cannot be empty; please justify your decision");
  }
  await review.save();
  if (review.completed) {
    try {
      await advanceApplication(review.application, review.accepted);
    } catch (err) {
      // Rollback review update
      review.comments = old_comments;
      review.rating = old_rating;
      review.completed = false;
      review.accepted = old_accepted;
      await review.save();
      throw err;
    }
  }
  return review;
}

/**
 * Returns a JSON list of all of the reviews belonging to a user.
 * Can be filtered using options (e.g. to fetch only open reviews, etc.)
 */
async function getUserReviews(user_id, options) {
  return await Review.find({ reviewer: user_id, ...options })
    .populate({
      path: "application",
      populate: {
        path: "role",
      },
    })
    .populate({
      path: "reviewer",
      populate: {
        path: "role",
      },
    })
    .exec();
}

/**
 * Returns a JSON list of all of the reviews belonging to a application.
 * Can be filtered using options (e.g. to fetch only open reviews, etc.)
 */
async function getApplicationReviews(application_id, options) {
  return await Review.find({ application: application_id, ...options })
    .populate({
      path: "application",
      populate: {
        path: "role",
      },
    })
    .populate({
      path: "reviewer",
      populate: {
        path: "role",
      },
    })
    .exec();
}

/**
 * Returns a JSON object representing a review given an ID.
 */
async function getReview(review_id) {
  return await Review.findOne({ _id: review_id })
    .populate({
      path: "application",
      populate: {
        path: "role",
      },
    })
    .populate({
      path: "reviewer",
      populate: {
        path: "role",
      },
    })
    .exec();
}

module.exports = {
  updateReview,
  getUserReviews,
  getApplicationReviews,
  getReview,
};
