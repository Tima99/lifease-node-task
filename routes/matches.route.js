const {
  getPriorityMatches,
  updateMatch,
  getMatchDetails,
  createMatch,
  getMatchDetailsByString
} = require("../controllers/matches.controller");

const router = require("express").Router();

router.post("/create", createMatch);

router.get("/read", getMatchDetails);
router.get("/read/by/names", getMatchDetailsByString);

router.get("/priority/matches", getPriorityMatches);

router.put("/update/:id", updateMatch);

module.exports = router;
