import { StorageService } from "../services/StorageService";
import { Settings } from "../services/SettingsService";

const STORAGE_KEY = "preference_table";

const storageService = new StorageService();

const IMPORTANCE_FACTOR: Record<string, number> = {
  not_important: 0,
  important: 1,
  very_important: 2,
  mandatory: 4,
};

const GRADE_SCORE: Record<string, number> = {
  "a-plus": 2,
  a: 2,
  b: 1,
  c: 0,
  d: -1,
  e: -2,
};

const PREF_KEY_MAP: Record<string, string> = {
  nutriScore: "nutriscore",
  novaScore: "nova",
  ecoScore: "ecoscore",
  low_fat: "low_fat",
  low_salt: "low_salt",
  low_sugar: "low_sugars",
  low_saturated_fat: "low_saturated_fat",
};

export interface PreferenceTable {
  factors: Record<string, number>; // attrId → importance factor
  levels: Record<string, string>; // attrId → raw level (for mandatory check)
  maxScore: number;
}

export interface PreferenceResult {
  score: number;
  percentage: number;
  compatible: "compatible" | "unknown_match" | "not_compatible";
  label: string;
  color: string;
}

// ── 1. Build & persist index table ──────────────────────────────────────────
// Call on: install, settings change
export async function buildPreferenceTable(
  preferences: Settings["preferences"],
): Promise<void> {
  const factors: Record<string, number> = {};
  const levels: Record<string, string> = {};
  let maxScore = 0;

  for (const [settingKey, attrId] of Object.entries(PREF_KEY_MAP)) {
    const level =
      preferences[settingKey as keyof typeof preferences] ?? "not_important";
    const factor = IMPORTANCE_FACTOR[level] ?? 0;
    factors[attrId] = factor;
    levels[attrId] = level;
    maxScore += 2 * factor;
  }

  const table: PreferenceTable = { factors, levels, maxScore };
  await storageService.set(STORAGE_KEY, table);
}

// ── 2. Calculate score from stored table ────────────────────────────────────
// Call on: product data received
export async function calculatePreferenceScore(
  productData: any,
): Promise<PreferenceResult> {
  const table = (await storageService.get(
    STORAGE_KEY,
  )) as PreferenceTable | null;

  if (!table || table.maxScore === 0) {
    return {
      score: 0,
      percentage: 0,
      compatible: "unknown_match",
      label: "Unknown match",
      color: getPreferenceLabelColor("unknown_match"),
    };
  }

  const grades = extractGrades(productData);
  let score = 0;
  let effectiveMaxScore = 0; // ← replaces table.maxScore in formula
  let compatible: PreferenceResult["compatible"] = "compatible";

  for (const [attrId, factor] of Object.entries(table.factors)) {
    if (factor === 0) continue;

    const grade = grades[attrId] ?? "";
    const gradeScore = GRADE_SCORE[grade] ?? null;
    const level = table.levels[attrId];

    if (level === "mandatory") {
      if (!grade || gradeScore === null) compatible = "unknown_match";
      else if (gradeScore < 0 && compatible !== "not_compatible")
        compatible = "not_compatible";
    }

    if (gradeScore !== null) {
      score += gradeScore * factor;
      effectiveMaxScore += 2 * factor; // ← only count attributes with known grades
    }
  }

  if (effectiveMaxScore === 0) {
    return {
      score: 0,
      percentage: 0,
      compatible: "unknown_match",
      label: "Unknown match",
      color: getPreferenceLabelColor("unknown_match"),
    };
  }

  const percentage = Math.round(
    ((score + effectiveMaxScore) / (2 * effectiveMaxScore)) * 100,
  );
  const label = getPreferenceLabel(percentage, compatible);
  const color = getPreferenceLabelColor(compatible, percentage);

  return { score, percentage, compatible, label, color };
}

// ── 3. Label + color helpers ─────────────────────────────────────────────────
function getPreferenceLabel(
  percentage: number,
  compatible: PreferenceResult["compatible"],
): string {
  if (compatible === "not_compatible") return "not_compatible";
  if (compatible === "unknown_match") return "unknown_match";
  if (percentage < 50) return "poor_match";
  if (percentage < 70) return "moderate_match";
  if (percentage < 90) return "good_match";
  return "very_good_match";
}

// Colors mirror OFF's personal search UI
export function getPreferenceLabelColor(
  compatible: PreferenceResult["compatible"] | string,
  percentage?: number,
): string {
  if (compatible === "not_compatible") return "#e63e11"; // OFF red
  if (compatible === "unknown_match") return "#a0a0a0"; // gray

  if (percentage === undefined) return "#a0a0a0";
  if (percentage < 50) return "#e63e11"; // red   — poor
  if (percentage < 70) return "#ff6f1e"; // orange — moderate
  if (percentage < 90) return "#80bb32"; // light green — good
  return "#008f44"; // OFF green  — very good
}

// ── Internal: map product fields → letter grades ─────────────────────────────
function extractGrades(data: any): Record<string, string> {
  const levelToGrade: Record<string, string> = {
    low: "a",
    moderate: "c",
    high: "e",
  };
  const novaToGrade: Record<string, string> = {
    1: "a",
    2: "a",
    3: "b",
    4: "e",
  };
  const toGrade = (val: string | undefined): string => {
    if (!val || val === "unknown" || val === "not-applicable") return "";
    return val.toLowerCase();
  };
  return {
    nutriscore: toGrade(data.nutriScore),
    nova: novaToGrade[data.novaGroup] ?? "",
    ecoscore: toGrade(data.ecoScore),
    low_fat: levelToGrade[data.nutrients?.fat] ?? "",
    low_salt: levelToGrade[data.nutrients?.salt] ?? "",
    low_sugars: levelToGrade[data.nutrients?.sugars] ?? "",
    low_saturated_fat: levelToGrade[data.nutrients?.saturated_fat] ?? "",
  };
}
