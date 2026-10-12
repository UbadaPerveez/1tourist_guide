export interface Destination {
  id: string;
  name: string;
  district: string;
  region: string;
  description: string;
  image_url: string;
  experience_tags: string[];
  cost_tier: 'budget' | 'mid' | 'luxury';
  popularity_score: number;
  quality_score: number;
  sustainability_score: number;
  monthly_crowd_pressure: Record<string, number>;
  best_months: string[];
  latitude: number | null;
  longitude: number | null;
  estimated_daily_cost: number;
  nearby_alternatives: { name: string; reason: string }[];
  created_at: string;
}

export type ExperienceType =
  | 'adventure'
  | 'scenic'
  | 'beach'
  | 'heritage'
  | 'resort'
  | 'wildlife'
  | 'spiritual';

export type BudgetTier = 'low' | 'medium' | 'high';

export interface TripPreferences {
  region: string;
  duration: number;
  budget: BudgetTier;
  travelers: number;
  experiences: ExperienceType[];
  travelMonth: number;
}

export interface ScoreBreakdown {
  preference_match: number;
  appreciation_gap: number;
  sustainability_score: number;
  crowd_pressure: number;
  final_score: number;
  badge: 'Hidden Gem' | 'Popular Choice' | 'Balanced Pick';
  crowd_level: 'Low' | 'Medium' | 'High';
  cost_fit: boolean;
}

export interface RankedDestination {
  destination: Destination;
  scores: ScoreBreakdown;
  rank: number;
}

export const EXPERIENCE_LABELS: Record<ExperienceType, string> = {
  adventure: 'Adventure',
  scenic: 'Scenic / Nature',
  beach: 'Beaches',
  heritage: 'Heritage / Culture',
  resort: 'Resort / Relaxation',
  wildlife: 'Wildlife',
  spiritual: 'Spiritual',
};

export const BUDGET_BANDS: Record<BudgetTier, { label: string; min: number; max: number }> = {
  low: { label: 'Budget (₹500–1,500/day)', min: 500, max: 1500 },
  medium: { label: 'Mid-range (₹1,500–3,500/day)', min: 1500, max: 3500 },
  high: { label: 'Luxury (₹3,500+/day)', min: 3500, max: 100000 },
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const KARNATAKA_REGIONS = [
  'Surprise me',
  'Malnad (Western Ghats)',
  'Coastal',
  'Northern',
  'Southern',
];
