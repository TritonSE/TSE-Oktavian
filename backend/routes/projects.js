const express = require("express");

const { authorizeUser } = require("../middleware/auth");
const {
  getAllProjects,
  getUserProjects,
  updateProject,
  deleteProject,
} = require("../services/projects");

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

/**
 * updates a project with a given id
 */
router.put("/:project_id", [authorizeUser(["roster"])], (req, res, next) => {
  try {
    const projectExists = null; // getOneProject(req.params.project_id);
    if (projectExists == null) {
      res.status(400).json({ message: "Project with the given id doesn't exist" });
    } else {
      updateProject(req.params.project_id, req.body);
      res.status(200).json({});
    }
  } catch (err) {
    next(err);
  }
});

/**
 * deletes a specific project given its id
 */
router.delete("/:project_id", [authorizeUser(["roster"])], (req, res, next) => {
  try {
    const projectExists = null; // getOneProject(req.params.project_id);
    if (projectExists == null) {
      res.status(400).json({ message: "Project with the given id doesn't exist" });
    } else {
      deleteProject(req.params.project_id);
      res.status(200).json({});
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
