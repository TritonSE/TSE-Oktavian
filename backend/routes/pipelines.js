const express = require("express");

const { body } = require("express-validator");
const { authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const {
  getAllPipelines,
  createApplicationPipeline,
  updateApplicationPipeline,
  deleteApplicationPipeline,
} = require("../services/pipelines");

const router = express.Router();

router.get("/", [authorizeUser(["roster", "recruitment"])], (req, res, next) => {
  getAllPipelines()
    .then((pipelines) => {
      res.status(200).json({ pipelines });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/",
  [
    authorizeUser(["roster", "recruitment"]),
    body("role").notEmpty().isMongoId(),
    body("reviewers").custom((reviewers) => Array.isArray(reviewers) && reviewers.length > 0),
    validateRequest,
  ],
  (req, res, next) => {
    createApplicationPipeline(req.body.role, req.body.reviewers)
      .then((pipeline) => {
        res.status(200).json({ pipeline });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/",
  [authorizeUser(["roster", "recruitment"]), body("id").notEmpty().isMongoId(), validateRequest],
  (req, res, next) => {
    updateApplicationPipeline(req.body.id, req.body.role, req.body.reviewers)
      .then((pipeline) => {
        res.status(200).json({ pipeline });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/",
  [authorizeUser(["roster", "recruitment"]), body("id").notEmpty().isMongoId(), validateRequest],
  (req, res, next) => {
    deleteApplicationPipeline(req.body.id)
      .then((pipeline) => {
        res.status(200).json({ pipeline });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
