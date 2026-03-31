// TODO:: use local svgs
// attribute_groups share icon links - mimicing same for now 

const OFF_STATIC = 'https://static.openfoodfacts.org/images/attributes/dist';

const VALID_GRADES = ['a', 'b', 'c', 'd', 'e'];
const VALID_NOVA   = ['1', '2', '3', '4'];

export const OFF_ICONS = {
  // known grades
  nutriScore:        (grade: string) => `${OFF_STATIC}/nutriscore-${grade.toLowerCase()}-new-en.svg`,
  ecoScore:          (grade: string) => `${OFF_STATIC}/green-score-${grade.toLowerCase()}.svg`,
  nova:              (group: string) => `${OFF_STATIC}/nova-group-${group}.svg`,

  // unknown fallbacks — OFF has these in the same dist folder
  nutriScoreUnknown: `${OFF_STATIC}/nutriscore-unknown-new-en.svg`,
  ecoScoreUnknown:   `${OFF_STATIC}/green-score-unknown.svg`,
  novaUnknown:       `${OFF_STATIC}/nova-group-unknown.svg`,

  // resolve to correct URL in one call — prefers icon_url from API if available
  resolveNutriScore: (grade: string | null | undefined, apiIconUrl?: string): string =>
    apiIconUrl ?? (grade && VALID_GRADES.includes(grade.toLowerCase())
      ? OFF_ICONS.nutriScore(grade)
      : OFF_ICONS.nutriScoreUnknown),

  resolveEcoScore: (grade: string | null | undefined, apiIconUrl?: string): string =>
    apiIconUrl ?? (grade && VALID_GRADES.includes(grade.toLowerCase())
      ? OFF_ICONS.ecoScore(grade)
      : OFF_ICONS.ecoScoreUnknown),

  resolveNova: (group: string | null | undefined, apiIconUrl?: string): string =>
    apiIconUrl ?? (group && VALID_NOVA.includes(group)
      ? OFF_ICONS.nova(group)
      : OFF_ICONS.novaUnknown),

  sugar: (level: string) => `${OFF_STATIC}/nutrient-level-sugars-${level === 'moderate' ? 'medium' : level}.svg`,
  fat: (level: string) => `${OFF_STATIC}/nutrient-level-fat-${level === 'moderate' ? 'medium' : level}.svg`,
  saturatedFat: (level: string) => `${OFF_STATIC}/nutrient-level-saturated-fat-${level === 'moderate' ? 'medium' : level}.svg`,
  salt: (level: string) => `${OFF_STATIC}/nutrient-level-salt-${level === 'moderate' ? 'medium' : level}.svg`,
};