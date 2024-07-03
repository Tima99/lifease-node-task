const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rivalrySchema = new Schema({
  teamName: {
    type: String,
    index: true,
  },
  rank: Number,
  competenceTeams: [],
});

const Rivalry = mongoose.model("rivalry", rivalrySchema);

module.exports = Rivalry;
