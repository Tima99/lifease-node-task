const { isValidObjectId } = require("mongoose");
const { Match } = require("../models/match.model");
const calculatePriority = require("../utiils/prioritizeMatches");
const Settings = require("../models/settings.model");
const Rivalry = require("../models/rivalry.model");

async function getPriorityMatches(req, res) {
  // filter by showInApp must be `true`
  let matches = await Match.find({ showInApp: true }).lean();

  matches = matches
    // sort by prioritize matches :
    // calculatePriority fn returns priority
    // range between 0 to 1
    .sort((a, b) => {
      const pB = calculatePriority(b);
      const pA = calculatePriority(a);

      return pB - pA;
    })
    .map((a) => {
      const p = calculatePriority(a);

      return {
        ...a,
        priority: p,
      };
    })

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
  const setting = await Settings.findOne({ status: "Active" });

  if (!setting) throw new Error("No setting found or currently active");

  // Convert team names to lowercase
  const teamAName = req.body.teams?.a?.name?.toLowerCase();
  const teamBName = req.body.teams?.b?.name?.toLowerCase();

  // Find rivalry based on lowercase team names
  const rivalry = await Rivalry.find({
    $expr: {
      $or: [
        { $eq: [{ $toLower: "$teamName" }, teamAName] },
        { $eq: [{ $toLower: "$teamName" }, teamBName] },
      ],
    },
  });
  const priority = calculatePriority(req.body, setting, rivalry);

  const createdMatch = await Match.create({
    ...req.body,
    priority,
  });

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
