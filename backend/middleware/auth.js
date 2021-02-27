const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const { User } = require("../models");
const { JWT_SECRET } = require("../constants");

/**
 * Passport initialization is responsible for setting up strategies
 * and serialization/deserialization of user objects. It returns an initialized
 * version of passport that can hook into the Express application using `app.use`.
 *
 * There are two types of strategies, each performing a different function:
 *  1. The local strategy handles login attempts and converts a username and password
 *     (presumably passed in through a POST request) into a token if the pair is valid.
 *  2. The JWT strategy handles token verification attempts (for example, as part of an
 *     authentication/authorization routine in a protected route) by parsing the token
 *     from the Authorization header, validating it, and converting it to an actual MongoDB
 *     User object.
 */
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
        secretOrKey: JWT_SECRET,
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

/**
 * This is a wrapper around `passport.authenticate` that
 * implements a custom callback. This callback is designed to properly format
 * JSON messages in the event of an authentication failure, and it also can
 * perform authorization once the authentication step is complete.
 */
const wrappedAuthenticate = (type, options, authorization) => (
  req,
  res,
  next
) => {
  passport.authenticate(type, options, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: "Your credentials are invalid",
      });
    }
    req.user = user;
    let authorized = await authorization(req);
    if (!authorized) {
      return res.status(403).json({
        message: "You do not have the necessary permissions",
      });
    }
    next();
  })(req, res, next);
};

/**
 * Middleware for the login route. Attempts to convert the username, password fields
 * in the body of the request to a user object.
 *
 * Note how the authorization callback always returns true. This is because no
 * authorization needs to be done on login.
 */
const authenticateUser = wrappedAuthenticate(
  "local",
  { session: false },
  () => {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
);

/**
 * Middleware for any protected routes. Decodes the Authorization header token
 * and converts into a user object.
 *
 * Currently, no actual authorization is performed: users are all assumed to be
 * completely trustworthy. This is likely to change in the future.
 */
const authorizeUser = wrappedAuthenticate("jwt", { session: false }, () => {
  return new Promise((resolve) => {
    resolve(true);
  });
});

module.exports = {
  initializePassport,
  authenticateUser,
  authorizeUser,
};
