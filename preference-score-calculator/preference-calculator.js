const IMPORTANCE_FACTOR = {
  not_important: 0,
  important: 1,
  very_important: 2,
  mandatory: 4,
};

const GRADE_SCORE = {
  a: 2,
  b: 1,
  c: 0,
  d: -1,
  e: -2,
};

function buildPreferenceTable() {
  const attributes = [
    "nutriscore",
    "nova",
    "ecoscore",
    "low_salt",
    "low_sugars",
    "low_saturated_fat",
    "low_fat",
  ];

  const table = {};
  let maxScore = 0;

  for (const attr of attributes) {
    const el = document.getElementById(attr);
    const level = el?.value || "not_important";
    const factor = IMPORTANCE_FACTOR[level] ?? 0;
    table[attr] = factor;
    maxScore += 2 * factor;
  }

  console.log("Preference table:", table);
  console.log("Max score:", maxScore);

  // store in local storage
  localStorage.setItem("preferenceTable", JSON.stringify(table));
  localStorage.setItem("maxScore", maxScore);
}

function calculateScore(parsed) {

  const table = JSON.parse(localStorage.getItem("preferenceTable"));
  const maxScore = parseInt(localStorage.getItem("maxScore"));

  // when no options are selected
  if (maxScore == 0) {
    return {
      score: 0,
      percentage: 0,
      compatible: "unknown_match",
    };
  }

  // combine all attributes to a single object
  const grades = {};
  for (const group of Object.values(parsed)) {
    for (const attr of group) {
      grades[attr.id] = attr.grade;
    }
  }

  let score = 0;
  let compatible = "compatible";

  for (const [attrId, factor] of Object.entries(table)) {
    if (factor == 0) {
      continue;
    }

    const grade = grades[attrId] ?? "";
    const gradeScore = GRADE_SCORE[grade] ?? null;

    // Check mandatory attributes
    const el = document.getElementById(attrId);
    const level = el?.value || "not_important";

    if (level == "mandatory") {
      if (!grade || gradeScore == null) {
        compatible = "unknown_match";
      } else if (gradeScore < 0) {
        compatible = "not_compatible";
      }
    }

    if (gradeScore != null) {
      score += gradeScore * factor;
    }
  }

  const percentage = Math.round(((score + maxScore) / (2 * maxScore)) * 100);
  return { score, percentage, compatible };
}


function getPreferenceLabel(percentage, compatible) {
  if (compatible == "not_compatible") return "Not compatible";
  if (compatible == "unknown_match") return "Unknown match";
  
  if (percentage < 50) return "Poor match";
  if (percentage < 70) return "Moderate match";
  if (percentage < 90) return "Good match";
  
  return "Very good match";
}
