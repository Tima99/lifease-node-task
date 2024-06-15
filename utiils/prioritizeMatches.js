// Function to calculate priority for a match
function calculatePriority(match) {
  const currentDate = new Date();
  const startDate = new Date(match.start_date);


  // Calculate venue importance based on ASCII value of first letter divided by 100
  let venueImportance = 1; // Default importance if venue is 'india'

  if (match.venue?.toLowerCase() !== "india") {
    const firstLetterAscii = match.venue.charCodeAt(0);
    venueImportance = firstLetterAscii / 100;
  }

  const teamsImportance = match.teams.a.name?.includes("India") || match.teams.b.name?.includes("India") ? 1 : 0.5;

  const formatImportance = match.format === "t20" ? 1 : 0.5;

  const genderImportance = match.gender === "men" ? 1 : 0.5;

  const timeDifference = Math.abs(startDate - currentDate);
  const msInOneDay = 1000 * 60 * 60 * 24;
  const daysDifference = Math.ceil(timeDifference / msInOneDay);
  const normalizedStartDate = daysDifference / 30; // Assuming matches are within 30 days

  const priority =
    0.4 * normalizedStartDate +
    0.4 * teamsImportance +
    0.1 * venueImportance +
    0.05 * formatImportance +
    0.05 * genderImportance;
  return priority;
}

module.exports = calculatePriority;
