const express = require("express");

const { isAuthenticated } = require("../middleware/auth");
const { getApplicationStats } = require("../services/stats");

const router = express.Router();

router.get("/", isAuthenticated, (req, res, next) => {
  getApplicationStats(req.body.start_date, req.body.end_date)
    .then((stats) => {
      res.status(200).json({
        stats: stats,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
