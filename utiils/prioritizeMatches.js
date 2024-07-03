// Function to calculate priority for a match
function calculatePriority(match, setting, rivalries) {
  // Calculate venue importance based on ASCII value of first letter divided by 100
  let venueImportance = 1; // Default importance if venue is 'India'

  if (match.venue && match.venue.toLowerCase() !== "india") {
    const firstLetterAscii = match.venue.charCodeAt(0);
    venueImportance = firstLetterAscii / 100;
  }

  const teamAName = match.teams.a.name;
  const teamBName = match.teams.b.name;

  // Determine if any of the team include "India"
  const teamsIncludeIndia =
    teamAName?.toLowerCase().includes("india") ||
    teamBName?.toLowerCase().includes("india");

  // Fetch importance factors from setting object
  const formatImportance = setting.format[match.format] || 0.5; // Default to 0.5 if format not found
  const genderImportance = setting.gender[match.gender] || 0.5; // Default to 0.5 if gender not found

  // Calculate priority based on settings
  let priority =
    setting.teams.factor * (teamsIncludeIndia ? 1 : 0.5) +
    setting.venue.factor * venueImportance +
    setting.format.factor * formatImportance +
    setting.gender.factor * genderImportance;

  // Adjust priority based on specific conditions
  if (
    (teamAName?.toLowerCase().includes("india") ||
      teamBName?.toLowerCase().includes("india")) &&
    (teamAName?.toLowerCase().includes("pakistan") ||
      teamBName?.toLowerCase().includes("pakistan")) &&
    match.start_date
  ) {
    // Convert match start date to IST timezone
    const matchStartDateIST = new Date(match.start_date);
    matchStartDateIST.setHours(
      matchStartDateIST.getHours() + 5,
      matchStartDateIST.getMinutes() + 30
    );

    // Check if match is India vs Pakistan and after 12am IST
    if (matchStartDateIST.getHours() >= 0 && matchStartDateIST.getHours() < 5) {
      // Reduce priority if match is after 12am IST
      priority -= 0.1;
    }
  }

  const [totalRank, competenceTeams] = rivalries.reduce(
    (acc, rivalry) => {
      acc[0] = acc[0] + rivalry.rank;
      acc[1].push(rivalry.competenceTeams);
      return acc;
    },
    [0, []]
  );

  // Adjust priority based on rivalry ranks
  if (rivalries && rivalries.length > 0) {
    const rivalryRank = totalRank / 10;

    priority += rivalryRank;
  }

  // if their is match between competence team
  // Adjust priority if teams have competences
  if (
    rivalries &&
    rivalries.length > 0 &&
    competenceTeams.some((teamName) => {
      return teamAName === teamName || teamBName === teamName;
    })
  ) {
    priority += 0.2; // Increase priority if teams have competences
  }

  return priority;
}

module.exports = calculatePriority;
