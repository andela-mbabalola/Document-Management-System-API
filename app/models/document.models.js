(function() {
  "Use strict";

  var mongoose = require("mongoose"),
    date = require("./../helpers/dateHelper"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

  var DocumentSchema = new Schema({

    ownerId: {
      ref: "User",
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
        message: "{VALUE} is not a valid name!"
      },
      ref: "Role"
    },

    content: {
      type: String,
      required: true,
      validate: {
        validator: function(name) {
          return /\w/.test(name);
        },
        message: "{VALUE} is not a valid name!"
      }
    },

    role: {
      ref: "Role",
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

  DocumentSchema.pre("save", function(next) {
    var doc = this;
    doc.createdAt = date;
    next();
  });

  var documents = mongoose.model("Documents", DocumentSchema);
  module.exports = documents;


})();
