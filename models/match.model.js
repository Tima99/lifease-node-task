const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FORMAT_ENUMS = ["t20", "one-day"];
const STATUS_ENUMS = ["notstarted", "started", "completed"];
const GENDER_ENUMS = ["men", "women"];

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
      name: {
        type: String,
      },
    },
    b: {
      name: {
        type: String,
      },
    },
  },

  venue: String,
  format: {
    type: String,
    enum: FORMAT_ENUMS,
  },
  status: {
    type: String,
    enum: STATUS_ENUMS,
  },
  showInApp: Boolean,
  gender: {
    type: String,
    enum: GENDER_ENUMS,
  },
  key: String,
  priority: Number,
});

const Match = mongoose.model("matches", matchSchema);

module.exports = {
  Match: Match,
  FORMAT_ENUMS: FORMAT_ENUMS,
  STATUS_ENUMS: STATUS_ENUMS,
  GENDER_ENUMS: GENDER_ENUMS,
};
