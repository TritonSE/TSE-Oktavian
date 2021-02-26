const config = require("../config");
const { Application } = require("../models");

/**
 * Returns statistics related to the number of applications
 * between two dates. The dates refer to when the application
 * was created, not necessarily updated.
 */
async function getApplicationStats(start_date, end_date) {
  const stats = {};
  if (start_date == null) {
    start_date = new Date(628021800000); // The epoch: around 1970
  } else {
    start_date = new Date(start_date);
  }
  if (end_date == null) {
    end_date = new Date();
  } else {
    end_date = new Date(end_date);
  }
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
