const express = require("express");
const rateLimit = require("express-rate-limit");

const { body, query } = require("express-validator");
const { authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const {
  getAllApplications,
  getApplication,
  createApplication,
} = require("../services/applications");

const router = express.Router();

router.get(
  "/",
  [
    authorizeUser(["recruitment"]),
    query("start_date").notEmpty().isNumeric().toInt(),
    query("end_date").notEmpty().isNumeric().toInt(),
    validateRequest,
  ],
  (req, res, next) => {
    if (req.query.final) {
      getAllApplications(
        new Date(req.query.start_date),
        new Date(req.query.end_date),
        req.query.final
      )
        .then((applications) => {
          res.status(200).json({
            applications,
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      getAllApplications(new Date(req.query.start_date), new Date(req.query.end_date))
        .then((applications) => {
          res.status(200).json({
            applications,
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  }
);

router.get("/:id", authorizeUser(["recruitment"]), (req, res, next) => {
  getApplication(req.params.id)
    .then((application) => {
      res.status(200).json({
        application,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/",
  [
    rateLimit({
      // One IP is only allowed 3 applications per minute
      windowMs: 60 * 1000,
      max: 3,
    }),
    body("name").notEmpty().isString(),
    body("email").notEmpty().isEmail(),
    body("role").notEmpty().isString(),
    body("start_year").notEmpty().isInt(),
    body("start_quarter").notEmpty().isString(),
    body("graduation_year").notEmpty().isInt(),
    body("graduation_quarter").notEmpty().isString(),
    body("resume").notEmpty().isURL(),
    body("about").notEmpty().isString(),
    body("why").notEmpty().isString(),
    validateRequest,
  ],
  (req, res, next) => {
    createApplication({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      start_quarter: req.body.start_quarter,
      start_year: req.body.start_year,
      graduation_quarter: req.body.graduation_quarter,
      graduation_year: req.body.graduation_year,
      resume: req.body.resume,
      about: req.body.about,
      why: req.body.why,
    })
      .then((application) => {
        res.status(200).json({
          application,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
