const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('./config')
const Schema = mongoose.Schema;

/*
 * Some documentation:
 *  - User = standard user object representing a board member
 *  - UserCategory = a mapping from user role to a list of users that can review those application types
 *  - Application = represents a single application submitted by a student & the corresponding acceptance decision
 *  - Review = an (Application, User) pairing; a user is reviewing this applicant at some stage
 *  - PasswordReset = information (token, etc.) used to reset the password for a user
 */

const ApplicationSchema = new Schema({
  // Immutable
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  graduation: { // Graduation year
    type: Number,
    required: true
  },
  resume: { // Link to resume
    type: String,
    required: true
  },
  about: { // Answer to "Describe yourself"
    type: String,
    required: true
  },
  why: { // Answer to "Why TSE?"
    type: String,
    required: true
  },
  // Mutable
  current_stage: {
    type: String,
    required: true,
    default: config.stages[0]
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const ReviewSchema = new Schema({
  // Immutable
  application: {
    type: mongoose.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  reviewer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stage: {
    type: String,
    required: true
  },
  // Mutable
  comments: {
    type: String,
    default: '' 
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const UserCategorySchema = new Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  users: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }]
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  } 
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  return next(); 
});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    return {
      _id: ret._id,
      email: ret.email,
      name: ret.name
    };
  }
});

const PasswordResetSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const UserCategory = mongoose.model('UserCategory', UserCategorySchema);
const Application = mongoose.model('Application', ApplicationSchema);
const Review = mongoose.model('Review', ReviewSchema);
const User = mongoose.model('User', UserSchema);
const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

module.exports = {
  UserCategory,
  Application,
  Review,
  User,
  PasswordReset
};
