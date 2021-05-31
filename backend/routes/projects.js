const express = require("express");

const { body } = require("express-validator");
const { authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const {
  getAllProjects,
  getUserProjects,
  getOneProject,
  addProject,
} = require("../services/projects");

const router = express.Router();

const validators = {
  name: body("name").notEmpty().isString(),
  description: body("description").isString(),
  client: body("client").notEmpty().isString(),
  phase: body("phase").isIn(["Outreach", "Design", "Development", "Post Development"]),
  timeline_quarter: body("timeline.*.quarter").isIn(["Fall", "Winter", "Spring", "Summer"]),
  timeline_year: body("timeline.*.year").isInt({ min: 1000, max: 9999 }),
  project_manager: body("project_manager").notEmpty().isString(),
  outreach: body("outreach").notEmpty().isString(),
  designers: body("designers.*").notEmpty().isString(),
  developers: body("developers.*").notEmpty().isString(),
  file_link: body("files.*.link").notEmpty().isString(),
  file_name: body("files.*.name").notEmpty().isString(),
};

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
 * Returns a specific project given its id.
 */
router.get("/:project_id", [authorizeUser(["roster"])], (req, res, next) => {
  getOneProject(req.params.project_id)
    .then((project) => {
      if (project === null)
        res.status(400).json({ message: "Project with the given id doesn't exist" });
      else res.status(200).json({ project });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Creates a new project given that the user has permissions to
 * create projects.
 */
router.post(
  "/",
  [
    validators.name,
    validators.description,
    validators.client,
    validators.phase,
    validators.timeline_quarter,
    validators.timeline_year,
    validators.project_manager,
    validators.outreach,
    validators.designers,
    validators.developers,
    validators.file_link,
    validators.file_name,
    validateRequest,
    authorizeUser(["roster", "project_create"]),
  ],
  (req, res, next) => {
    addProject({
      name: req.body.name,
      description: req.body.description,
      client: req.body.client,
      phase: req.body.phase,
      timeline: req.body.timeline,
      project_manager: req.body.project_manager,
      outreach: req.body.outreach,
      designers: req.body.designers,
      developers: req.body.developers,
      files: req.body.files,
    })
      .then((project) => {
        res.status(200).json({ project });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
