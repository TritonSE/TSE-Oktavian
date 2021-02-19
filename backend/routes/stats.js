const express = require('express');
const passport = require('passport');

const { isAuthenticated } = require("../middleware/auth");
const { getApplicationStats } = require("../services/stats");

const router = express.Router();

router.get('/', isAuthenticated, (req, res, next) => {
  getApplicationStats(req.body.startDate, req.body.endDate).then((stats) => {
    res.status(200).json({ 
      stats: stats
    });
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
