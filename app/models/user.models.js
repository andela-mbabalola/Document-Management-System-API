var mongoose = require("mongoose"),
  Role = require("./role.models"),
  bcrypt = require("bcrypt"),
  SALT_WORK_FACTOR = 10,
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

User = new Schema({
  name: {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: function(name) {
          return /[a-zA-Z]/.test(name);
        },
        message: '{VALUE} is not a valid name!'
      }
    },

    lastName: {
      type: String,
      required: true,
      validate: {
        validator: function(name) {
          return /[a-zA-Z]/.test(name);
        },
        message: '{VALUE} is not a valid name!'
      }
    }
  },

  userName: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(name) {
        return /\w/.test(name);
      },
      message: '{VALUE} is not a valid userName!'
    }
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function(password) {
        return /\w/.test(password);
      },
      message: '{VALUE} is not a valid password!'
    }
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: function(email) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
      },
      message: '{VALUE} is not a valid email!'
    }
  },

  role: [{
    type: ObjectId,
    ref: 'Role',
    required: true
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


var User = mongoose.model('User', User);
module.exports = User;
// exports.User = User;
