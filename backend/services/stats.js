const mongoose = require('mongoose');

const config = require('../config');
const { Application, Review, UserCategory } = require('../models');
const { ServiceError } = require('./errors')

/**
 * Returns statistics related to the number of applications
 * between two dates. The dates refer to when the application
 * was created, not necessarily updated.
 */
async function getApplicationStats(startDate, endDate) {
  const stats = {};
  if (startDate == null) {
    startDate = new Date(628021800000); // The epoch: around 1970
  }
  if (endDate == null) {
    endDate = new Date();
  }
  for (const role of config.roles) {
    stats[role] = {};
    for (const stage of config.stages) {
      stats[role][stage] = await Application.countDocuments({
        role: role,
        completed: false,
        current_stage: stage,
        created_at: {
          $gte: startDate,
          $lte: endDate
        }
      }).exec();
    }
    stats[role]['ACCEPTED'] = await Application.countDocuments({
      role: role,
      completed: true,
      accepted: true,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
    stats[role]['REJECTED'] = await Application.countDocuments({
      role: role,
      completed: true,
      accepted: false,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
  }
  return stats;
}

module.exports = {
  getApplicationStats
};
