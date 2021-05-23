const express = require("express");
const { param, body } = require("express-validator");

const { authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const { getAllUsers, editUser, deleteUser, activateUser } = require("../services/users");

const router = express.Router();

/**
 * Return a list of all users
 */
router.get("/", [authorizeUser(["roster"])], (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Edit user information
 */
router.put("/", [authorizeUser([])], (req, res, next) => {
  editUser(req.body, req.user)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete(
  "/:id",
  [param("id").notEmpty().isString(), validateRequest, authorizeUser(["account_activation"])],
  (req, res, next) => {
    deleteUser(req.params.id)
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        next(err);
      });
  }
);

/**
 * Activate a pending user
 */
router.put(
  "/activate",
  [
    body("user_id").notEmpty().isString(),
    body("role_id").notEmpty().isString(),
    validateRequest,
    authorizeUser(["account_activation"]),
  ],
  (req, res, next) => {
    activateUser(req.body.user_id, req.body.role_id)
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
