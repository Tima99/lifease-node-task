const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const matchSchema = new Schema({
    teamId: {
        type: mongoose.Schema.ObjectId
    },
    rank: Number,
    competenceTeams: []
});

const Match = mongoose.model("rivalry", matchSchema);

module.exports = Match;
