const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

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
      (email, password, next) => {
        User.findOne({ email })
          .populate("role")
          .exec()
          .then((user) => {
            if (!user) {
              return next(null, false);
            }
            if (!user.verifyPassword(password)) {
              return next(null, false);
            }
            return next(null, user);
          })
          .catch((err) => next(err));
      }
    )
  );
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id })
          .populate("role")
          .exec()
          .then((user) => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch((err) => done(err, false));
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
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
const wrappedAuthenticate = (type, options, authorization) => (req, res, next) => {
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
    const authorized = await authorization(req);
    if (!authorized) {
      return res.status(403).json({
        message: "You do not have the necessary permissions",
      });
    }
    return next();
  })(req, res, next);
};

/**
 * Middleware for the login route. Attempts to convert the username, password fields
 * in the body of the request to a user object.
 */
const authenticateUser = wrappedAuthenticate(
  "local",
  { session: false },
  (req) =>
    new Promise((resolve) => {
      resolve(req.user.active);
    })
);

/**
 * Middleware for any protected routes. Decodes the Authorization header token
 * and converts into a user object.
 *
 * Permissions is a list of fields that must be true with respect to the user's role
 * in order for them to be able to access the protected route. For example, you could
 * enforce that permissions = ['roster'] to view the roster, permissions = ['recruitment']
 * for them to be able to access any recruitment information, etc. If this is an empty
 * list, that means no permissions are required.
 */
const authorizeUser = (permissions) =>
  wrappedAuthenticate(
    "jwt",
    { session: false },
    (req) =>
      new Promise((resolve) => {
        if (!req.user.active) {
          resolve(false);
          return;
        }
        for (const permission of permissions) {
          if (!req.user.role.permissions[permission]) {
            resolve(false);
            return;
          }
        }
        resolve(true);
      })
  );

module.exports = {
  initializePassport,
  authenticateUser,
  authorizeUser,
};
