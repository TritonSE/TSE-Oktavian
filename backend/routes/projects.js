const express = require("express");

const { authorizeUser } = require("../middleware/auth");
const { getAllProjects, getUserProjects, updateProject } = require("../services/projects");

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

router.put("/editProject/:project_id", (req, res, next) => {
  if(req.query.project._id){
    if(updateProject(req.params.project_id, req.body)){
      res.status(200).json({projects});
      next;
    }
    else{
      res.status(500).json({});
      next;
    }
  }
  req.status(400).json({});;
});

router.delete("/deleteProject", (req,res, next) =>{
  if(req.query.project._id){
    if(deleteProject(req.params.project._id)){
      res.status(200).json({projects});
      next;
    }
    else{
      res.status(500).json({});
      next;
    }
  }
  req.status(400).json({});
});

module.exports = router;
