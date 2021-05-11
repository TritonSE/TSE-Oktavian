const express = require("express");

const { authorizeUser } = require("../middleware/auth");
const { getAllProjects, getUserProjects } = require("../services/projects");

const router = express.Router();

/**
 * Return a list of all projects.
 *
 * If a User ID is provided in the query string, return all
 * projects the user has contributed to.
 */
router.get("/", [authorizeUser(["roster"])], (req, res, next) => {
  if (req.query.user)
    getUserProjects(req.query.user)
      .then((projects) => {
        res.status(200).json({ projects });
      })
      .catch((err) => {
        next(err);
      });
  else
    getAllProjects()
      .then((projects) => {
        res.status(200).json({ projects });
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;
