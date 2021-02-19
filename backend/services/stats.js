const mongoose = require('mongoose');

const config = require('../config');
const { Application, Review, UserCategory } = require('../models');
const { ServiceError } = require('./errors')

//Expecting type Date
async function getApplicationStats(startDate, endDate) {
  const stats = {};
  for (const role of config.roles) {
    stats[role] = {};
    for (const stage of config.stages) {
      stats[role][stage] = await Application.count({
        role: role,
        current_stage: stage,
        created_at: {
          $gte: startDate,
          $lte: endDate
        }
      }).exec();
    }
    stats[role]['ACCEPTED'] = await Application.count({
      role: role,
      completed: true,
      accepted: true,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
    stats[role]['REJECTED'] = await Application.count({
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
