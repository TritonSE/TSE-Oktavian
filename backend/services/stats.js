const config = require("../config");
const { Application } = require("../models");

/**
 * Returns statistics related to the number of applications
 * between two dates. The dates refer to when the application
 * was created, not necessarily updated.
 */
async function getApplicationStats(start_date, end_date) {
  const stats = {};
  for (const role of config.roles) {
    stats[role] = {};
    for (const stage of config.stages) {
      stats[role][stage] = await Application.countDocuments({
        role: role,
        completed: false,
        current_stage: stage,
        created_at: {
          $gte: start_date,
          $lte: end_date,
        },
      }).exec();
    }
    stats[role]["ACCEPTED"] = await Application.countDocuments({
      role: role,
      completed: true,
      accepted: true,
      created_at: {
        $gte: start_date,
        $lte: end_date,
      },
    }).exec();
    stats[role]["REJECTED"] = await Application.countDocuments({
      role: role,
      completed: true,
      accepted: false,
      created_at: {
        $gte: start_date,
        $lte: end_date,
      },
    }).exec();
  }
  return stats;
}

module.exports = {
  getApplicationStats,
};
