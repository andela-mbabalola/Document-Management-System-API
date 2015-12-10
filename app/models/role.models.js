var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

RoleSchema = new Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: function(title) {
        return /\w/.test(title);
      },
      message: '{VALUE} is not a valid title!'
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

var Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
