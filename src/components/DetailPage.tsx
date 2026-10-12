import {
  ArrowLeft,
  MapPin,
  Leaf,
  Gauge,
  Eye,
  TrendingUp,
  Sparkles,
  Compass,
  Calendar,
  IndianRupee,
  ChevronRight,
  RotateCcw,
  Navigation,
} from 'lucide-react';
import type { Destination, TripPreferences, RankedDestination, ScoreBreakdown } from '@/types';
import { rankDestinations } from '@/lib/ranking';
import { EXPERIENCE_LABELS, MONTH_NAMES } from '@/types';

interface DetailPageProps {
  destination: Destination;
  allDestinations: Destination[];
  preferences: TripPreferences;
  onBack: () => void;
  onSelectDestination: (id: string) => void;
  onStartOver: () => void;
}

export function DetailPage({
  destination: dest,
  allDestinations,
  preferences,
  onBack,
  onSelectDestination,
  onStartOver,
}: DetailPageProps) {
  // Re-rank to get the scores for this destination
  const ranked = rankDestinations(allDestinations, preferences);
  const currentRanked = ranked.find((r) => r.destination.id === dest.id);

  if (!currentRanked) return null;

  const { scores } = currentRanked;

  // Find nearby alternatives (from the destination's nearby_alternatives field)
  const alternatives = dest.nearby_alternatives || [];

  // Also find similar-scored destinations from other regions
  const similarDestinations = ranked
    .filter(
      (r) =>
        r.destination.id !== dest.id &&
        r.destination.experience_tags.some((t) => dest.experience_tags.includes(t))
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f0] to-[#e8f5e9]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-[#b7e4c7]/40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-[#4a5d52] hover:text-[#1b4332] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>
          <button
            onClick={onStartOver}
            className="flex items-center gap-1.5 text-sm font-medium text-[#4a5d52] hover:text-[#1b4332] transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Start Over
          </button>
        </div>
      </header>

      {/* Hero image */}
      <div className="relative h-72 sm:h-96 max-h-[480px] overflow-hidden">
        <img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <BadgePill badge={scores.badge} />
              <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-[#1b4332]">
                Rank #{currentRanked.rank} for you
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-1.5">{dest.name}</h1>
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <MapPin className="w-4 h-4" /> {dest.district} · {dest.region} · Karnataka
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Score summary card */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#b7e4c7]/40 mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-[#1b4332]">Score Breakdown</h2>
            <div className="text-center">
              <div className="font-display text-4xl font-bold text-[#2d6a4f]">{scores.final_score.toFixed(1)}</div>
              <div className="text-xs text-[#4a5d52]">Final Score</div>
            </div>
          </div>

          {/* Formula display */}
          <div className="bg-[#f0f7f0] rounded-xl p-4 mb-5 font-mono text-xs text-[#4a5d52]">
            {scores.final_score.toFixed(1)} = (0.35 × {scores.preference_match.toFixed(1)}) + (0.30 × {scores.appreciation_gap.toFixed(1)}) + (0.20 × {scores.sustainability_score.toFixed(1)}) − (0.15 × {scores.crowd_pressure.toFixed(1)})
          </div>

          {/* Component bars */}
          <div className="grid sm:grid-cols-2 gap-4">
            <BigScoreBar
              label="Preference Match"
              value={scores.preference_match}
              color="bg-[#2d6a4f]"
              icon={<Compass className="w-4 h-4" />}
              weight="35%"
              description="How well this matches your selected experiences, budget, and duration"
            />
            <BigScoreBar
              label="Appreciation Gap"
              value={scores.appreciation_gap}
              color="bg-[#40916c]"
              icon={<Eye className="w-4 h-4" />}
              weight="30%"
              description={`Quality ${dest.quality_score} − (Popularity ${dest.popularity_score} / 2), normalized`}
            />
            <BigScoreBar
              label="Sustainability"
              value={scores.sustainability_score}
              color="bg-[#52b788]"
              icon={<Leaf className="w-4 h-4" />}
              weight="20%"
              description="Eco-infrastructure, community involvement, carrying capacity"
            />
            <BigScoreBar
              label="Crowd Pressure"
              value={scores.crowd_pressure}
              color="bg-[#b76e2d]"
              icon={<Gauge className="w-4 h-4" />}
              weight="−15%"
              description={`Visitor load for ${MONTH_NAMES[preferences.travelMonth - 1]} — subtracted from score`}
              isNegative
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#b7e4c7]/40 mb-6 animate-fade-in-up delay-100">
          <h2 className="font-display text-lg font-semibold text-[#1b4332] mb-3">About this destination</h2>
          <p className="text-[#4a5d52] leading-relaxed">{dest.description}</p>
        </div>

        {/* Quick facts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FactCard
            icon={<Calendar className="w-5 h-5" />}
            label="Best Time to Visit"
            value={dest.best_months.map((m) => MONTH_NAMES[Number(m) - 1].slice(0, 3)).join(', ')}
          />
          <FactCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Est. Daily Cost"
            value={`₹${dest.estimated_daily_cost.toLocaleString('en-IN')}/person`}
          />
          <FactCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Popularity"
            value={`${dest.popularity_score}/10`}
          />
          <FactCard
            icon={<Sparkles className="w-5 h-5" />}
            label="Quality Score"
            value={`${dest.quality_score}/10`}
          />
        </div>

        {/* Experience tags */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#b7e4c7]/40 mb-6 animate-fade-in-up delay-200">
          <h2 className="font-display text-lg font-semibold text-[#1b4332] mb-3">Experience Types</h2>
          <div className="flex flex-wrap gap-2">
            {dest.experience_tags.map((tag) => {
              const isSelected = preferences.experiences.includes(tag as any);
              return (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    isSelected
                      ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                      : 'bg-[#f0f7f0] text-[#40916c] border-[#b7e4c7]'
                  }`}
                >
                  {EXPERIENCE_LABELS[tag as keyof typeof EXPERIENCE_LABELS]}
                  {isSelected && ' ✓'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Why recommended */}
        <div className="bg-gradient-to-br from-[#d4e9d4] to-[#b7e4c7] rounded-2xl p-6 mb-6 animate-fade-in-up delay-300">
          <h2 className="font-display text-lg font-semibold text-[#1b4332] mb-3">Why we recommended this for you</h2>
          <RecommendationReason dest={dest} scores={scores} prefs={preferences} />
        </div>

        {/* Lower-crowd alternatives nearby */}
        {alternatives.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#b7e4c7]/40 mb-6 animate-fade-in-up delay-400">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-5 h-5 text-[#2d6a4f]" />
              <h2 className="font-display text-lg font-semibold text-[#1b4332]">Lower-crowd alternatives nearby</h2>
            </div>
            <div className="space-y-3">
              {alternatives.map((alt, i) => {
                const altDest = allDestinations.find((d) => d.name === alt.name);
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-4 rounded-xl ${
                      altDest ? 'bg-[#f0f7f0] cursor-pointer hover:bg-[#d4e9d4] transition-colors' : 'bg-[#f0f7f0]'
                    }`}
                    onClick={() => altDest && onSelectDestination(altDest.id)}
                  >
                    <div className="w-8 h-8 bg-[#2d6a4f] rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1b4332] flex items-center gap-1">
                        {alt.name}
                        {altDest && <ChevronRight className="w-4 h-4 text-[#2d6a4f]" />}
                      </h4>
                      <p className="text-sm text-[#4a5d52] mt-0.5">{alt.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Similar destinations */}
        {similarDestinations.length > 0 && (
          <div className="mb-8 animate-fade-in-up delay-500">
            <h2 className="font-display text-lg font-semibold text-[#1b4332] mb-4">Similar experiences you might like</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {similarDestinations.map((item) => (
                <div
                  key={item.destination.id}
                  onClick={() => onSelectDestination(item.destination.id)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-[#b7e4c7]/40"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={item.destination.image_url}
                      alt={item.destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold text-[#2d6a4f]">
                      {item.scores.final_score.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-[#1b4332] text-sm">{item.destination.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#4a5d52] mt-0.5">
                      <MapPin className="w-3 h-3" /> {item.destination.district}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-white text-[#2d6a4f] font-medium rounded-xl border-2 border-[#2d6a4f] hover:bg-[#f0f7f0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>
          <button
            onClick={onStartOver}
            className="flex items-center justify-center gap-1.5 py-3 px-5 bg-[#2d6a4f] text-white font-medium rounded-xl hover:bg-[#1b4332] transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> New Search
          </button>
        </div>
      </div>
    </div>
  );
}

function BadgePill({ badge }: { badge: ScoreBreakdown['badge'] }) {
  const styles: Record<ScoreBreakdown['badge'], string> = {
    'Hidden Gem': 'bg-[#b7e4c7] text-[#1b4332]',
    'Popular Choice': 'bg-[#fef3c7] text-[#92400e]',
    'Balanced Pick': 'bg-[#e0e7ff] text-[#3730a3]',
  };
  const icons: Record<ScoreBreakdown['badge'], React.ReactNode> = {
    'Hidden Gem': <Eye className="w-3.5 h-3.5" />,
    'Popular Choice': <TrendingUp className="w-3.5 h-3.5" />,
    'Balanced Pick': <Sparkles className="w-3.5 h-3.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[badge]}`}>
      {icons[badge]} {badge}
    </span>
  );
}

function BigScoreBar({
  label,
  value,
  color,
  icon,
  weight,
  description,
  isNegative,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  weight: string;
  description: string;
  isNegative?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, value * 10));
  return (
    <div className="bg-[#f0f7f0] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
          <span className="font-semibold text-[#1b4332] text-sm">{label}</span>
        </div>
        <span className="text-xs font-bold text-[#4a5d52]">{weight}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2.5 flex-1 bg-white rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
        <span className="font-bold text-[#1b4332] text-sm w-10 text-right">{value.toFixed(1)}</span>
      </div>
      <p className="text-xs text-[#4a5d52] leading-relaxed">{description}</p>
    </div>
  );
}

function FactCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#b7e4c7]/40">
      <div className="w-9 h-9 bg-[#d4e9d4] rounded-lg flex items-center justify-center text-[#2d6a4f] mb-2">
        {icon}
      </div>
      <div className="text-xs text-[#4a5d52] mb-0.5">{label}</div>
      <div className="font-semibold text-[#1b4332] text-sm">{value}</div>
    </div>
  );
}

function RecommendationReason({
  dest,
  scores,
  prefs,
}: {
  dest: Destination;
  scores: ScoreBreakdown;
  prefs: TripPreferences;
}) {
  const reasons: string[] = [];

  // Preference match
  const matchedExperiences = dest.experience_tags.filter((t) => prefs.experiences.includes(t as any));
  if (matchedExperiences.length > 0) {
    reasons.push(
      `Matches ${matchedExperiences.length} of your ${prefs.experiences.length} selected experience types: ${matchedExperiences.map((t) => EXPERIENCE_LABELS[t as keyof typeof EXPERIENCE_LABELS]).join(', ')}.`
    );
  }

  // Budget fit
  if (scores.cost_fit) {
    reasons.push(`The estimated daily cost (₹${dest.estimated_daily_cost.toLocaleString('en-IN')}) fits within your ${prefs.budget} budget band.`);
  } else {
    reasons.push(`The estimated daily cost (₹${dest.estimated_daily_cost.toLocaleString('en-IN')}) is outside your selected budget band, but other factors compensate.`);
  }

  // Appreciation gap
  if (scores.appreciation_gap >= 6.5) {
    reasons.push(`This is a hidden gem — quality score of ${dest.quality_score}/10 with relatively low popularity (${dest.popularity_score}/10), meaning you'll get an exceptional experience without the crowds.`);
  } else if (dest.popularity_score >= 7) {
    reasons.push(`A well-known destination with good reason — quality score of ${dest.quality_score}/10. Popular, but the crowds are factored into the final score.`);
  } else {
    reasons.push(`A balanced pick with a quality score of ${dest.quality_score}/10 and moderate popularity (${dest.popularity_score}/10).`);
  }

  // Sustainability
  if (scores.sustainability_score >= 7) {
    reasons.push(`Strong sustainability profile (${scores.sustainability_score}/10) — eco-conscious infrastructure and community involvement make this a responsible choice.`);
  }

  // Crowd pressure
  if (scores.crowd_level === 'Low') {
    reasons.push(`Crowd pressure in ${MONTH_NAMES[prefs.travelMonth - 1]} is low (${scores.crowd_pressure.toFixed(1)}/10) — an ideal time to visit.`);
  } else if (scores.crowd_level === 'High') {
    reasons.push(`Crowd pressure in ${MONTH_NAMES[prefs.travelMonth - 1]} is high (${scores.crowd_pressure.toFixed(1)}/10) — consider the lower-crowd alternatives listed below.`);
  }

  return (
    <ul className="space-y-2">
      {reasons.map((reason, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-[#1b4332] leading-relaxed">
          <div className="w-5 h-5 bg-[#2d6a4f] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">
            {i + 1}
          </div>
          <span>{reason}</span>
        </li>
      ))}
    </ul>
  );
}
