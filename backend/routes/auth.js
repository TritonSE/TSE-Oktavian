const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');

const { User, UserCategory } = require('../models');
const { createUser, forgotPassword, resetPassword } = require('../services/users');
const { isValidated } = require('../middleware/validation');
const config = require('../config');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().isString(),
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString().isLength({ min: 6 }),
  body('roles').notEmpty().isArray(),
  body('secret').notEmpty().isString(),
  isValidated
], function (req, res, next) {
  createUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    roles: req.body.roles,
    secret: req.body.secret
  }).then((user) => {
    req.login(user, { session: false }, function (err) {
      if (err) {
        next(err);
      }
      else {
        res.status(200).json({ 
          user: req.user,
          token: jwt.sign(req.user.toJSON(), config.auth.jwt_secret)
        });
      }
    });
  }).catch((err) => {
    next(err);
  });
});

router.post('/login', [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  isValidated,
  passport.authenticate('local', { session: false })
], function (req, res, next) {
  res.status(200).json({ 
    user: req.user,
    token: jwt.sign(req.user.toJSON(), config.auth.jwt_secret)
  });
});

router.post('/forgot-password', [
  body('email').isEmail(),
  body('secret').notEmpty().isString(),
  isValidated
], function (req, res, next) {
  forgotPassword({
    email: req.body.email,
    secret: req.body.secret
  }).then(() => {
    res.status(200).json({});
  }).catch((err) => {
    next(err);
  });
});

router.post('/reset-password', [
  body('token').isUUID(4),
  body('password').isString().isLength({ min: 6 }),
  isValidated
], function (req, res, next) {
  resetPassword({
    token: req.body.token,
    password: req.body.password
  }).then(() => {
    res.status(200).json({});
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
