const { STAGES } = require("../constants");
const { Application, ApplicationPipeline, Review } = require("../models");

/**
 * Returns statistics related to the number of applications
 * between two dates. The dates refer to when the application
 * was created, not necessarily updated.
 */
async function getApplicationStats(start_date, end_date) {
  const pipelines = await ApplicationPipeline.find().populate("role").exec();
  const roles = pipelines.map((pipeline) => pipeline.role);
  const stats = {};
  /* eslint-disable no-await-in-loop */
  for (const role of roles) {
    const criteria = {
      role,
      created_at: {
        $gte: start_date,
        $lte: end_date,
      },
    };
    stats[role.name] = {};
    for (const stage of STAGES) {
      stats[role.name][stage] = await Application.countDocuments({
        ...criteria,
        completed: false,
        current_stage: stage,
      }).exec();
    }
    stats[role.name].Accepted = await Application.countDocuments({
      ...criteria,
      completed: true,
      accepted: true,
    }).exec();
    stats[role.name].Rejected = await Application.countDocuments({
      ...criteria,
      completed: true,
      accepted: false,
    }).exec();
  }
  /* eslint-enable no-await-in-loop */
  return stats;
}

/**
 * Returns statistics related to the reviewers of applications
 * between two dates. The dates refer to when the application
 * was created, not necessarily updated.
 */
 async function getApplicationStatsForReviewers(start_date, end_date) {
  const stats = {};
  // gets all the reviews whose application was created within the specified date
  const reviews = await Review.find().populate("reviewer").populate({
    path: "application", 
    match: {
      created_at:{
        $gte: start_date,
        $lte: end_date
      }
    }
  }).exec();

  
  // looks through all the reviews to categorize them by reviewer name
  for (const review of reviews) {
    // skips through the reviews outside of the specified dates
    if (review.application !== null) {
      const reviewer = review.reviewer.name;
      // add this reviewer to the 'stats' dictionary if we haven't seen them yet
      if (!(reviewer in stats)) {
        // creates the object with all the stages (resume, phone, interview, final) for each reviewer
        stats[reviewer] = STAGES.concat(["Accepted", "Rejected"]).reduce((accumulator, currValue) => {
          accumulator[currValue] = 0;
          return accumulator;
        }, {});
        stats[reviewer].name = reviewer;
      }

      // updates the number of reviews for this reviewer
      console.log("THIS IS review", review);
      const {stage, completed, accepted} = review;
      stats[reviewer][stage]++;

      // updates accepted/rejected if the review is completed
      if (completed) {
        if (accepted) {
          stats[reviewer]["Accepted"]++;
        }
        else {
          stats[reviewer]["Rejected"]++;
        }
      }
    }
     
  }

  return stats
}

module.exports = {
  getApplicationStats,
  getApplicationStatsForReviewers,
};
