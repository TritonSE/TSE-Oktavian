const express = require("express");
const { body, param } = require("express-validator");

const { authorizeUser } = require("../middleware/auth");
const { getRoles, getRole, editRole, createRole, deleteRole } = require("../services/roles");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

/**
 * Return a list of all roles
 * Optional parameters to specify query for specific roles
 *
 */
router.get("/", [authorizeUser(["roster"])], (req, res, next) => {
  getRoles(req.query)
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

/**
 * Edit an existing role
 */
router.put(
  "/",
  [body("_id").notEmpty().isString(), validateRequest, authorizeUser(["role_management"])],
  (req, res, next) => {
    editRole(req.body)
      .then((role) => {
        res.status(200).json({ role });
      })
      .catch((err) => {
        next(err);
      });
  }
);

/**
 * Create a new role
 */
router.post(
  "/",
  [body("name").notEmpty().isString(), validateRequest, authorizeUser(["role_management"])],
  (req, res, next) => {
    createRole(req.body)
      .then((role) => {
        res.status(200).json({ role });
      })
      .catch((err) => {
        next(err);
      });
  }
);

/**
 * Delete an existing role
 */
router.delete(
  "/:id",
  [param("id").notEmpty().isString(), validateRequest, authorizeUser(["role_management"])],
  (req, res, next) => {
    deleteRole(req.params.id)
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
