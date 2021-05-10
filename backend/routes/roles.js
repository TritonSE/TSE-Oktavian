const express = require("express");

const { authorizeUser } = require("../middleware/auth");
const { getAllRoles, getRole } = require("../services/roles");

const router = express.Router();

/**
 * Return a list of all roles
 */
router.get("/", [authorizeUser(["roster"])], (req, res, next) => {
  getAllRoles()
    .then((roles) => {
      res.status(200).json({ roles });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Reaturn a specific role that matches role_id
 */
router.get("/:role_id", [authorizeUser(["roster"])], (req, res, next) => {
  getRole(req.params.role_id)
    .then((roles) => {
      res.status(200).json({ roles });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
