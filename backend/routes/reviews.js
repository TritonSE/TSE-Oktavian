const express = require("express");
const { body } = require("express-validator");

const { authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const {
  getApplicationReviews,
  getUserReviews,
  getReview,
  updateReview,
} = require("../services/reviews");

const router = express.Router();

router.get("/", authorizeUser(["recruitment"]), (req, res, next) => {
  let promise = null;
  if (req.query.application != null) {
    promise = getApplicationReviews(req.query.application, {});
  } else if (req.query.user != null) {
    promise = getUserReviews(req.query.user, {});
  }
  if (promise == null) {
    res.status(400).json({ message: "Query must specify either user or application" });
    return;
  }
  promise
    .then((reviews) => {
      res.status(200).json({
        reviews,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id", authorizeUser(["recruitment"]), (req, res, next) => {
  getReview(req.params.id)
    .then((review) => {
      res.status(200).json({
        review,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.put(
  "/:id",
  [
    authorizeUser(["recruitment"]),
    body("comments").optional().isString(),
    body("rating").optional().isFloat({ min: 0, max: 5 }),
    body("completed").optional().isBoolean(),
    body("accepted").optional().isBoolean(),
    validateRequest,
  ],
  (req, res, next) => {
    const review_update = { _id: req.params.id };
    if ("comments" in req.body) {
      review_update.comments = req.body.comments;
    }
    if ("rating" in req.body) {
      review_update.rating = req.body.rating;
    }
    if ("completed" in req.body) {
      review_update.completed = req.body.completed;
    }
    if ("accepted" in req.body) {
      review_update.accepted = req.body.accepted;
    }
    updateReview(review_update, req.user)
      .then((review) => {
        res.status(200).json({
          review,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
