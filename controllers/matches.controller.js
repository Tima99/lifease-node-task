const { isValidObjectId } = require("mongoose");
const Match = require("../models/match.model");
const calculatePriority = require("../utiils/prioritizeMatches");

async function getPriorityMatches(req, res) {
  // filter by showInApp must be `true`
  let matches = await Match.find({ showInApp: true });

  matches = matches
    // sort by prioritize matches :
    // calculatePriority fn returns priority
    // range between 0 to 1
    .sort((a, b) => calculatePriority(b) - calculatePriority(a))

    // Limit to top 6 matches
    .slice(0, 6);

  res.json({
    matches,
  });
}

async function updateMatch(req, res) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new Error("Invalid match id");
  }

  await Match.findByIdAndUpdate(id, req.body);

  res.json({
    message: "Match Updated",
  });
}

async function getMatchDetails(req, res) {
  const matches = await Match.find(req.query);

  res.json({
    matches,
  });
}

async function getMatchDetailsByString(req, res) {
  const queryArr = Object.entries(req.query);

  const query = queryArr.reduce((query, [key, value]) => {
    if (typeof value === "string")
      query[key] = {
        $regex: value,
        $options: "i",
      };

    return query;
  }, {});

  const matches = await Match.find(query);

  res.json({
    matches,
  });
}

async function createMatch(req, res) {
  const createdMatch = await Match.create(req.body);

  res.json({
    message: "Created successfully",
    createdMatch,
  });
}

module.exports = {
  getPriorityMatches,
  updateMatch,
  getMatchDetails,
  createMatch,
  getMatchDetailsByString,
};
