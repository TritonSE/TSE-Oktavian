const express = require("express");

const { query } = require("express-validator");
const { authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const { getApplicationStats, getApplicationStatsForReviewers } = require("../services/stats");

const router = express.Router();

router.get(
  "/applications",
  [
    authorizeUser(["recruitment"]),
    query("start_date").notEmpty().isNumeric().toInt(),
    query("end_date").notEmpty().isNumeric().toInt(),
    validateRequest,
  ],
  (req, res, next) => {
    getApplicationStats(new Date(req.query.start_date), new Date(req.query.end_date))
      .then((stats) => {
        getApplicationStatsForReviewers(new Date(req.query.start_date), new Date(req.query.end_date))
          .then((statsForReviewer) => {
            res.status(200).json({
              stats,
              statsForReviewer,
            });
          })
        
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
