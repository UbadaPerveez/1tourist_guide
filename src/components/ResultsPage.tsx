import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Leaf,
  Users,
  TrendingUp,
  Eye,
  Gauge,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Info,
  Calendar,
  Wallet,
} from 'lucide-react';
import type { Destination, TripPreferences, RankedDestination, ScoreBreakdown } from '@/types';
import { rankDestinations, filterByRegion } from '@/lib/ranking';
import { EXPERIENCE_LABELS, MONTH_NAMES, BUDGET_BANDS } from '@/types';

interface ResultsPageProps {
  destinations: Destination[];
  preferences: TripPreferences;
  onSelectDestination: (id: string) => void;
  onStartOver: () => void;
}

export function ResultsPage({
  destinations,
  preferences,
  onSelectDestination,
  onStartOver,
}: ResultsPageProps) {
  const [showFormula, setShowFormula] = useState(false);

  const ranked = useMemo(() => {
    const filtered = filterByRegion(destinations, preferences.region);
    return rankDestinations(filtered, preferences);
  }, [destinations, preferences]);

  const topPick = ranked[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f0] to-[#e8f5e9]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-[#b7e4c7]/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onStartOver}
            className="flex items-center gap-1.5 text-sm font-medium text-[#4a5d52] hover:text-[#1b4332] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Start Over
          </button>
          <div className="text-sm text-[#4a5d52]">
            <span className="font-medium text-[#2d6a4f]">{ranked.length}</span> destinations ranked
          </div>
        </div>
      </header>

      {/* Preferences summary */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-[#b7e4c7]/50 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <PrefChip icon={<MapPin className="w-3.5 h-3.5" />} label={preferences.region} />
          <PrefChip icon={<Calendar className="w-3.5 h-3.5" />} label={`${preferences.duration} ${preferences.duration === 1 ? 'day' : 'days'}`} />
          <PrefChip icon={<Wallet className="w-3.5 h-3.5" />} label={BUDGET_BANDS[preferences.budget].label.split('(')[0].trim()} />
          <PrefChip icon={<Users className="w-3.5 h-3.5" />} label={`${preferences.travelers} ${preferences.travelers === 1 ? 'traveler' : 'travelers'}`} />
          <PrefChip icon={<Calendar className="w-3.5 h-3.5" />} label={MONTH_NAMES[preferences.travelMonth - 1]} />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#4a5d52]">Experiences:</span>
            {preferences.experiences.map((exp, i) => (
              <span key={exp} className="text-[#2d6a4f] font-medium">
                {EXPERIENCE_LABELS[exp]}{i < preferences.experiences.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="ml-auto flex items-center gap-1.5 text-[#2d6a4f] hover:text-[#1b4332] font-medium transition-colors"
          >
            <Info className="w-4 h-4" /> {showFormula ? 'Hide' : 'Show'} Formula
          </button>
        </div>
      </div>

      {/* Formula explanation */}
      {showFormula && (
        <div className="max-w-6xl mx-auto px-6 mt-3 animate-fade-in">
          <div className="bg-[#1b4332] text-white rounded-2xl p-5 font-mono text-sm">
            <div className="mb-2 text-[#95d5b2] font-sans font-semibold">Ranking Formula:</div>
            <div className="leading-relaxed">
              final_score = 0.35 × preference_match + 0.30 × appreciation_gap + 0.20 × sustainability_score − 0.15 × crowd_pressure
              <div className="mt-2 text-xs text-[#95d5b2]">
                appreciation_gap = quality_score − (popularity_score / 2) → normalized to 0–10
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top pick highlight */}
      {topPick && (
        <div className="max-w-6xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#2d6a4f]" />
            <h2 className="font-display text-xl font-semibold text-[#1b4332]">Your top pick</h2>
          </div>
          <TopPickCard ranked={topPick} onClick={() => onSelectDestination(topPick.destination.id)} />
        </div>
      )}

      {/* All results */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <h2 className="font-display text-xl font-semibold text-[#1b4332] mb-5">All recommendations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ranked.map((item, index) => (
            <DestinationCard
              key={item.destination.id}
              ranked={item}
              index={index}
              onClick={() => onSelectDestination(item.destination.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PrefChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[#4a5d52]">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function BadgePill({ badge }: { badge: ScoreBreakdown['badge'] }) {
  const styles: Record<ScoreBreakdown['badge'], string> = {
    'Hidden Gem': 'bg-[#b7e4c7] text-[#1b4332] border-[#2d6a4f]',
    'Popular Choice': 'bg-[#fef3c7] text-[#92400e] border-[#b45309]',
    'Balanced Pick': 'bg-[#e0e7ff] text-[#3730a3] border-[#4f46e5]',
  };
  const icons: Record<ScoreBreakdown['badge'], React.ReactNode> = {
    'Hidden Gem': <Eye className="w-3.5 h-3.5" />,
    'Popular Choice': <TrendingUp className="w-3.5 h-3.5" />,
    'Balanced Pick': <Sparkles className="w-3.5 h-3.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${styles[badge]}`}>
      {icons[badge]} {badge}
    </span>
  );
}

function CrowdIndicator({ level, score }: { level: ScoreBreakdown['crowd_level']; score: number }) {
  const styles: Record<ScoreBreakdown['crowd_level'], string> = {
    Low: 'bg-[#d4e9d4] text-[#2d6a4f]',
    Medium: 'bg-[#fef3c7] text-[#92400e]',
    High: 'bg-[#fee2e2] text-[#991b1b]',
  };
  return (
    <div className="flex items-center gap-1.5">
      <Gauge className="w-4 h-4 text-[#4a5d52]" />
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[level]}`}>
        Crowd: {level}
      </span>
      <span className="text-xs text-[#4a5d52]">({score.toFixed(1)}/10)</span>
    </div>
  );
}

function ScoreBar({ label, value, color, isNegative }: { label: string; value: number; color: string; isNegative?: boolean }) {
  const pct = Math.min(100, Math.max(0, value * 10));
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-[#4a5d52]">{label}{isNegative && ' (−)'}</span>
        <span className="font-semibold text-[#1b4332]">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-[#e8f5e9] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TopPickCard({ ranked, onClick }: { ranked: RankedDestination; onClick: () => void }) {
  const { destination: dest, scores } = ranked;
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] border border-[#b7e4c7]/40"
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
          <img
            src={dest.image_url}
            alt={dest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-[#2d6a4f] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            #{ranked.rank} Recommended
          </div>
          <div className="absolute top-4 right-4">
            <BadgePill badge={scores.badge} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col">
          <div className="flex items-center gap-2 text-sm text-[#4a5d52] mb-2">
            <MapPin className="w-4 h-4" /> {dest.district} · {dest.region}
          </div>
          <h3 className="font-display text-2xl font-semibold text-[#1b4332] mb-2">{dest.name}</h3>
          <p className="text-sm text-[#4a5d52] leading-relaxed mb-4 line-clamp-3">{dest.description}</p>

          {/* Score breakdown */}
          <div className="space-y-2.5 mb-4">
            <ScoreBar label="Preference Match" value={scores.preference_match} color="bg-[#2d6a4f]" />
            <ScoreBar label="Appreciation Gap" value={scores.appreciation_gap} color="bg-[#40916c]" />
            <ScoreBar label="Sustainability" value={scores.sustainability_score} color="bg-[#52b788]" />
            <ScoreBar label="Crowd Pressure" value={scores.crowd_pressure} color="bg-[#b76e2d]" isNegative />
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#e8f5e9]">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-[#2d6a4f]">{scores.final_score.toFixed(1)}</div>
                <div className="text-xs text-[#4a5d52]">Final Score</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <CrowdIndicator level={scores.crowd_level} score={scores.crowd_pressure} />
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#40916c]" />
                <span className="text-xs font-medium text-[#2d6a4f]">Sustainability: {scores.sustainability_score.toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          <button className="mt-4 flex items-center justify-center gap-1.5 w-full py-3 bg-[#2d6a4f] text-white font-medium rounded-xl hover:bg-[#1b4332] transition-colors">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DestinationCard({ ranked, index, onClick }: { ranked: RankedDestination; index: number; onClick: () => void }) {
  const { destination: dest, scores } = ranked;
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-[#b7e4c7]/40 animate-fade-in-up opacity-0-init"
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-[#1b4332]">
            #{ranked.rank}
          </span>
          <BadgePill badge={scores.badge} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-[#4a5d52] mb-1.5">
          <MapPin className="w-3.5 h-3.5" /> {dest.district}
        </div>
        <h3 className="font-display text-lg font-semibold text-[#1b4332] mb-2">{dest.name}</h3>

        {/* Experience tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {dest.experience_tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-[#f0f7f0] text-[#40916c] rounded-full font-medium">
              {EXPERIENCE_LABELS[tag as keyof typeof EXPERIENCE_LABELS]}
            </span>
          ))}
        </div>

        {/* Mini score breakdown */}
        <div className="space-y-1.5 mb-3">
          <MiniScoreBar label="Match" value={scores.preference_match} color="bg-[#2d6a4f]" />
          <MiniScoreBar label="Hidden Gem Score" value={scores.appreciation_gap} color="bg-[#40916c]" />
          <MiniScoreBar label="Sustainability" value={scores.sustainability_score} color="bg-[#52b788]" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#e8f5e9]">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-[#2d6a4f]">{scores.final_score.toFixed(1)}</span>
            <span className="text-xs text-[#4a5d52]">/10</span>
          </div>
          <CrowdIndicator level={scores.crowd_level} score={scores.crowd_pressure} />
        </div>
      </div>
    </div>
  );
}

function MiniScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value * 10));
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#4a5d52] w-24 flex-shrink-0">{label}</span>
      <div className="h-1.5 flex-1 bg-[#e8f5e9] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-[#1b4332] w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}
