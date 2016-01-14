(function() {
  'Use strict';

  var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

  var DocumentSchema = new Schema({
    ownerId: {
      ref: 'User',
      type: ObjectId,
      required: true
    },

    title: {
      type: String,
      required: true,
      validate: {
        validator: function(name) {
          return /\w/.test(name);
        },
        message: '{VALUE} is not a valid name!'
      },
      ref: 'Role'
    },

    content: {
      type: String,
      required: true,
      validate: {
        validator: function(name) {
          return /\w/.test(name);
        },
        message: '{VALUE} is not a valid name!'
      }
    },

    role: {
      ref: 'Role',
      type: ObjectId,
      required: true
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

  var documents = mongoose.model('Documents', DocumentSchema);
  module.exports = documents;
})();
