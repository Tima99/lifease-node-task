const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const matchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  season: {
    name: String,
  },
  start_date: {
    type: Date,
    validate: {
      validator: (value) => {
        if (value <= Date.now()) return false;
        return true;
      },
      message: "Start Date must be greater than current date",
    },
  },

  teams: {
    a: {
      name: String,
    },
    b: {
      name: String,
    },
  },

  venue: String,
  format: {
    type: String,
    enum: ["t20", "one-day"],
  },
  status: {
    type: String,
    enum: ["notstarted", "started", "completed"],
  },
  showInApp: Boolean,
  gender: {
    type: String,
    enum: ["men", "women"],
  },
  key: String,
});

const Match = mongoose.model("matches", matchSchema);

module.exports = Match;
