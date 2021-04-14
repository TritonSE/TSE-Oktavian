const express = require("express");

const { authorizeUser } = require("../middleware/auth");
const { getAllRoles } = require("../services/roles");

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

module.exports = router;
