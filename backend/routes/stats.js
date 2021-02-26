const express = require("express");

const { query } = require("express-validator");
const { isAuthenticated } = require("../middleware/auth");
const { isValidated } = require("../middleware/validation");
const { getApplicationStats } = require("../services/stats");

const router = express.Router();

router.get(
  "/",
  [
    isAuthenticated,
    query("start_date").notEmpty().isNumeric().toInt(),
    query("end_date").notEmpty().isNumeric().toInt(),
    isValidated,
  ],
  (req, res, next) => {
    getApplicationStats(
      new Date(req.query.start_date),
      new Date(req.query.end_date)
    )
      .then((stats) => {
        res.status(200).json({
          stats: stats,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
