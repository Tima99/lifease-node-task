const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const matchSchema = new Schema({
    format: {

    },
    gender: {
        
    }
});

const Match = mongoose.model("setting", matchSchema);

module.exports = Match;
