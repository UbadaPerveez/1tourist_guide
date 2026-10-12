import type { Destination, TripPreferences, RankedDestination, ScoreBreakdown, BudgetTier, ExperienceType } from '@/types';
import { BUDGET_BANDS } from '@/types';

/**
 * Normalizes a value from a given range to 0–10.
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 5;
  return ((value - min)) / (max - min) * 10;
}

/**
 * Maps a budget tier to a numeric scale (1–3) for comparison.
 */
function budgetToNumber(tier: BudgetTier): number {
  return tier === 'low' ? 1 : tier === 'medium' ? 2 : 3;
}

/**
 * Maps a destination's cost tier to the same numeric scale.
 */
function costTierToNumber(tier: string): number {
  return tier === 'budget' ? 1 : tier === 'mid' ? 2 : 3;
}

/**
 * COMPONENT 1: Preference Match (0–10)
 *
 * Measures how well a destination aligns with what the user asked for:
 * - Experience tag overlap (70% weight): how many of the user's selected
 *   experience types appear in the destination's tags, with priority
 *   ordering — the first experience the user picks counts more.
 * - Budget fit (20% weight): how closely the destination's cost tier
 *   matches the user's budget preference.
 * - Duration fit (10% weight): whether the destination has enough
 *   activities for the requested trip length (proxied by tag diversity).
 */
function calcPreferenceMatch(dest: Destination, prefs: TripPreferences): number {
  // --- Experience tag overlap with priority weighting ---
  const destTags = new Set(dest.experience_tags);
  let tagScore = 0;
  let maxPossible = 0;

  prefs.experiences.forEach((exp: ExperienceType, index: number) => {
    // First choice gets weight = number of selections, decreasing by 1 each step
    const weight = prefs.experiences.length - index;
    maxPossible += weight;
    if (destTags.has(exp)) {
      tagScore += weight;
    }
  });

  const tagOverlap = maxPossible > 0 ? tagScore / maxPossible : 0.5;

  // --- Budget fit ---
  const userBudgetNum = budgetToNumber(prefs.budget);
  const destCostNum = costTierToNumber(dest.cost_tier);
  const budgetDiff = Math.abs(userBudgetNum - destCostNum);
  const budgetFit = 1 - (budgetDiff / 2); // 0 if 2 tiers apart, 1 if exact match

  // --- Duration fit (tag diversity as proxy for activity volume) ---
  const tagDiversity = dest.experience_tags.length;
  const durationNeeded = prefs.duration;
  const durationFit = Math.min(tagDiversity / Math.max(durationNeeded, 1), 1);

  // --- Weighted combination ---
  const score = (tagOverlap * 0.70) + (budgetFit * 0.20) + (durationFit * 0.10);
  return Math.round(score * 10 * 10) / 10; // scale to 0–10, round to 1 decimal
}

/**
 * COMPONENT 2: Appreciation Gap (0–10)
 *
 * quality_score - (popularity_score / 2), then normalized to 0–10.
 *
 * A destination with high quality but low popularity has a large
 * appreciation gap — it's great but under-visited. This is the core
 * metric that surfaces hidden gems.
 *
 * Example: quality=9, popularity=3 → gap = 9 - 1.5 = 7.5 (high gap = hidden gem)
 *          quality=8, popularity=9 → gap = 8 - 4.5 = 3.5 (low gap = well-known)
 */
function calcAppreciationGap(dest: Destination): number {
  const rawGap = dest.quality_score - (dest.popularity_score / 2);
  // Raw gap ranges from -4 (low quality, very popular) to 9.5 (max quality, no popularity)
  // Normalize from [-4, 9.5] → [0, 10]
  return Math.round(normalize(rawGap, -4, 9.5) * 10) / 10;
}

/**
 * COMPONENT 3: Sustainability Score (0–10)
 *
 * Directly from the destination's sustainability_score (1–10 scale).
 * Already normalized — no further transformation needed.
 */
function calcSustainability(dest: Destination): number {
  return dest.sustainability_score;
}

/**
 * COMPONENT 4: Crowd Pressure (0–10)
 *
 * Uses the destination's monthly_crowd_pressure for the user's selected
 * travel month. Falls back to the average if the month isn't available.
 *
 * Lower crowd pressure = better (fewer people, more sustainable visit).
 */
function calcCrowdPressure(dest: Destination, travelMonth: number): number {
  const monthKey = String(travelMonth);
  const monthly = dest.monthly_crowd_pressure;

  if (monthly && monthly[monthKey] !== undefined) {
    return monthly[monthKey];
  }

  // Fallback: average across all months
  const values = Object.values(monthly || {});
  if (values.length > 0) {
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  }
  return 5; // neutral fallback
}

/**
 * Determine the badge for a destination based on its appreciation gap.
 */
function getBadge(appreciationGap: number, popularity: number): ScoreBreakdown['badge'] {
  if (appreciationGap >= 6.5 && popularity < 6) return 'Hidden Gem';
  if (popularity >= 7) return 'Popular Choice';
  return 'Balanced Pick';
}

/**
 * Map a crowd pressure score to a qualitative level.
 */
function getCrowdLevel(pressure: number): ScoreBreakdown['crowd_level'] {
  if (pressure <= 4) return 'Low';
  if (pressure <= 7) return 'Medium';
  return 'High';
}

/**
 * Check if the destination's daily cost fits within the user's budget band.
 */
function getCostFit(dest: Destination, prefs: TripPreferences): boolean {
  const band = BUDGET_BANDS[prefs.budget];
  return dest.estimated_daily_cost >= band.min && dest.estimated_daily_cost <= band.max;
}

/**
 * MAIN RANKING FUNCTION
 *
 * Combines all four components into a final score using the formula:
 *
 *   final_score = (0.35 × preference_match)
 *               + (0.30 × appreciation_gap)
 *               + (0.20 × sustainability_score)
 *               - (0.15 × crowd_pressure)
 *
 * All components are normalized to 0–10 before combining.
 * The crowd_pressure term is SUBTRACTED because higher crowd pressure
 * means a worse experience and less sustainable visit.
 */
export function rankDestinations(
  destinations: Destination[],
  prefs: TripPreferences
): RankedDestination[] {
  const scored = destinations.map((dest) => {
    const preferenceMatch = calcPreferenceMatch(dest, prefs);
    const appreciationGap = calcAppreciationGap(dest);
    const sustainability = calcSustainability(dest);
    const crowdPressure = calcCrowdPressure(dest, prefs.travelMonth);

    const finalScore =
      (0.35 * preferenceMatch) +
      (0.30 * appreciationGap) +
      (0.20 * sustainability) -
      (0.15 * crowdPressure);

    const scores: ScoreBreakdown = {
      preference_match: preferenceMatch,
      appreciation_gap: appreciationGap,
      sustainability_score: sustainability,
      crowd_pressure: crowdPressure,
      final_score: Math.round(Math.max(0, finalScore) * 10) / 10,
      badge: getBadge(appreciationGap, dest.popularity_score),
      crowd_level: getCrowdLevel(crowdPressure),
      cost_fit: getCostFit(dest, prefs),
    };

    return { destination: dest, scores };
  });

  // Sort by final score descending
  scored.sort((a, b) => b.scores.final_score - a.scores.final_score);

  // Assign ranks
  return scored.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Filter destinations by region preference.
 * "Surprise me" returns all regions.
 */
export function filterByRegion(
  destinations: Destination[],
  region: string
): Destination[] {
  if (region === 'Surprise me' || region === '') return destinations;

  // Map the UI region label to the database region values
  const regionMap: Record<string, string[]> = {
    'Malnad (Western Ghats)': ['Malnad'],
    'Coastal': ['Coastal'],
    'Northern': ['Northern'],
    'Southern': ['Southern'],
  };

  const targetRegions = regionMap[region] || [region];
  return destinations.filter((d) => targetRegions.includes(d.region));
}
