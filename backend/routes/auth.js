const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { createUser, forgotPassword, resetPassword, changePassword } = require("../services/users");
const { authenticateUser, authorizeUser } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");
const { JWT_SECRET } = require("../constants");
const { User } = require("../models");

const router = express.Router();

const TOKEN_EXPIRE_SEC = 3600;

function makeAccessToken(user) {
  return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_SEC });
}

const validators = {
  name: body("name").notEmpty().isString(),
  email: body("email").isEmail(),
  password: body("password").isString().isLength({ min: 6 }),
  secret: body("secret").notEmpty().isString(),
  token: body("token").isUUID(4),
};

router.post(
  "/register",
  [validators.name, validators.email, validators.password, validators.secret, validateRequest],
  (req, res, next) => {
    createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      secret: req.body.secret,
      refreshToken: uuidv4(),
      active: true,
    })
      .then((user) => {
        req.login(user, { session: false }, (err) => {
          if (err) {
            next(err);
          } else {
            res
              .status(200)
              .cookie("refreshToken", user.refreshToken, { httpOnly: true })
              .json({
                user: req.user,
                token: makeAccessToken(user),
              });
          }
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

async function ensureRefreshTokenExists(user) {
  if (user.refreshToken === undefined) {
    user.refreshToken = uuidv4();
    await user.save();
  }

  return user;
}

router.post(
  "/login",
  [validators.email, validators.password, validateRequest, authenticateUser],
  (req, res) => {
    ensureRefreshTokenExists(req.user).then((user) => {
      res
        .status(200)
        .cookie("refreshToken", user.refreshToken, { httpOnly: true })
        .json({
          user,
          token: makeAccessToken(user),
        });
    });
  }
);

router.get("/me", [authorizeUser([])], (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

router.post(
  "/forgot-password",
  [validators.email, validators.secret, validateRequest],
  (req, res, next) => {
    forgotPassword({
      email: req.body.email,
      secret: req.body.secret,
    })
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/reset-password",
  [validators.token, validators.password, validateRequest],
  (req, res, next) => {
    resetPassword({
      token: req.body.token,
      password: req.body.password,
    })
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/change-password",
  [validators.password, validateRequest, authorizeUser([])],
  (req, res, next) => {
    changePassword({
      user: req.user,
      password: req.body.password,
    })
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.cookies;
  User.findOne({ refreshToken })
    .populate("role")
    .then((user) => {
      const accessTokenUser = jwt.verify(req.body.token, JWT_SECRET, { ignoreExpiration: true });
      if (user._id.equals(accessTokenUser._id)) {
        res.status(200).json({
          user,
          token: makeAccessToken(user),
        });
      } else {
        throw new Error("Access token does not match refresh token");
      }
    })
    .catch((err) => {
      res.status(401).json({ message: err.message });
    });
});

module.exports = router;
