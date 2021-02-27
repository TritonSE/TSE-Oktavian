const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const { User } = require("../models");
const config = require("../config");

const initializePassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, next) {
        User.findOne({ email: email })
          .exec()
          .then((user) => {
            if (!user) {
              return next(null, false);
            } else if (!user.verifyPassword(password)) {
              return next(null, false);
            } else {
              return next(null, user);
            }
          })
          .catch((err) => {
            return next(err);
          });
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.auth.jwt_secret,
      },
      function (jwt_payload, done) {
        User.findOne({ _id: jwt_payload._id }, function (err, user) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  return passport.initialize();
};

const authenticateUser = passport.authenticate("local", { session: false });

const authorizeUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: "User is not authorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  initializePassport,
  authenticateUser,
  authorizeUser,
};
