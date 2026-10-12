import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Compass,
  Check,
  ArrowRight,
} from 'lucide-react';
import type { TripPreferences, ExperienceType, BudgetTier } from '@/types';
import {
  EXPERIENCE_LABELS,
  BUDGET_BANDS,
  MONTH_NAMES,
  KARNATAKA_REGIONS,
} from '@/types';

interface PreferenceFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  onBack: () => void;
}

const ALL_EXPERIENCES = Object.keys(EXPERIENCE_LABELS) as ExperienceType[];

const EXPERIENCE_ICONS: Record<ExperienceType, string> = {
  adventure: '🏔',
  scenic: '🌿',
  beach: '🏖',
  heritage: '🏛',
  resort: '🏝',
  wildlife: '🦁',
  spiritual: '🛕',
};

export function PreferenceForm({ onSubmit, onBack }: PreferenceFormProps) {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState('Surprise me');
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState<BudgetTier>('medium');
  const [travelers, setTravelers] = useState(2);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [travelMonth, setTravelMonth] = useState(11);

  const totalSteps = 5;
  const canProceed = step === 0 || step === 1 || step === 2 || step === 3 || (step === 4 && experiences.length > 0 && travelMonth > 0);

  const handleToggleExperience = (exp: ExperienceType) => {
    setExperiences((prev) => {
      if (prev.includes(exp)) {
        return prev.filter((e) => e !== exp);
      }
      return [...prev, exp];
    });
  };

  const handleMoveExperience = (exp: ExperienceType, direction: 'up' | 'down') => {
    setExperiences((prev) => {
      const index = prev.indexOf(exp);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(prev.length - 1, index + 1);
      if (newIndex === index) return prev;
      const newArray = [...prev];
      [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
      return newArray;
    });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onSubmit({
        region,
        duration,
        budget,
        travelers,
        experiences,
        travelMonth,
      });
    }
  };

  const handlePrev = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  // Step validation
  const stepValid = (): boolean => {
    if (step === 4) return experiences.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f0] to-[#e8f5e9]">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[#4a5d52] hover:text-[#1b4332] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Home
        </button>
        <div className="text-sm font-medium text-[#4a5d52]">
          Step {step + 1} of {totalSteps}
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-[#2d6a4f]' : 'bg-[#d4e9d4]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-2xl mx-auto px-6 pb-32">
        {step === 0 && (
          <FormStep key="step-0" icon={<MapPin className="w-7 h-7" />} title="Where do you want to go?" subtitle="Pick a region within Karnataka, or let us surprise you.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KARNATAKA_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    region === r
                      ? 'border-[#2d6a4f] bg-[#d4e9d4] text-[#1b4332] shadow-sm'
                      : 'border-[#d4e9d4] bg-white/60 text-[#4a5d52] hover:border-[#95d5b2]'
                  }`}
                >
                  <span className="font-medium block">{r}</span>
                </button>
              ))}
            </div>
          </FormStep>
        )}

        {step === 1 && (
          <FormStep key="step-1" icon={<Calendar className="w-7 h-7" />} title="How long is your trip?" subtitle="Drag to set the number of days you'd like to travel.">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-8 border border-[#b7e4c7]/50">
              <div className="text-center mb-6">
                <span className="font-display text-5xl font-semibold text-[#2d6a4f]">{duration}</span>
                <span className="text-lg text-[#4a5d52] ml-2">{duration === 1 ? 'day' : 'days'}</span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-[#4a5d52]/60">
                <span>1 day</span>
                <span>7 days</span>
                <span>14 days</span>
              </div>
            </div>
          </FormStep>
        )}

        {step === 2 && (
          <FormStep key="step-2" icon={<Wallet className="w-7 h-7" />} title="What's your budget?" subtitle="Choose a spending tier per person, per day.">
            <div className="space-y-3">
              {(Object.keys(BUDGET_BANDS) as BudgetTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setBudget(tier)}
                  className={`w-full px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                    budget === tier
                      ? 'border-[#2d6a4f] bg-[#d4e9d4] shadow-sm'
                      : 'border-[#d4e9d4] bg-white/60 hover:border-[#95d5b2]'
                  }`}
                >
                  <div>
                    <span className="font-medium text-[#1b4332] block capitalize">{tier === 'low' ? 'Budget' : tier === 'medium' ? 'Mid-range' : 'Luxury'}</span>
                    <span className="text-sm text-[#4a5d52]">{BUDGET_BANDS[tier].label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    budget === tier ? 'border-[#2d6a4f] bg-[#2d6a4f]' : 'border-[#d4e9d4]'
                  }`}>
                    {budget === tier && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </FormStep>
        )}

        {step === 3 && (
          <FormStep key="step-3" icon={<Users className="w-7 h-7" />} title="How many travelers?" subtitle="Include yourself in the count.">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-8 border border-[#b7e4c7]/50">
              <div className="text-center mb-6">
                <span className="font-display text-5xl font-semibold text-[#2d6a4f]">{travelers}</span>
                <span className="text-lg text-[#4a5d52] ml-2">{travelers === 1 ? 'person' : 'people'}</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-[#4a5d52]/60">
                <span>Solo</span>
                <span>5</span>
                <span>10</span>
                <span>15+</span>
              </div>
            </div>
          </FormStep>
        )}

        {step === 4 && (
          <FormStep key="step-4" icon={<Compass className="w-7 h-7" />} title="What experiences are you after?" subtitle="Select all that appeal — then reorder by priority (top = most important). Also pick your travel month.">
            {/* Experience multi-select with priority */}
            <div className="space-y-2 mb-6">
              {ALL_EXPERIENCES.map((exp) => {
                const isSelected = experiences.includes(exp);
                const priorityIndex = experiences.indexOf(exp);
                return (
                  <div
                    key={exp}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#2d6a4f] bg-[#d4e9d4]'
                        : 'border-[#d4e9d4] bg-white/60 hover:border-[#95d5b2]'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleExperience(exp)}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#2d6a4f] bg-[#2d6a4f]' : 'border-[#d4e9d4]'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <span className="text-lg flex-shrink-0">{EXPERIENCE_ICONS[exp]}</span>
                    <span className={`font-medium flex-1 ${isSelected ? 'text-[#1b4332]' : 'text-[#4a5d52]'}`}>
                      {EXPERIENCE_LABELS[exp]}
                    </span>
                    {isSelected && (
                      <div className="flex items-center gap-1">
                        {priorityIndex > 0 && (
                          <button
                            onClick={() => handleMoveExperience(exp, 'up')}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-[#2d6a4f] hover:text-white text-[#2d6a4f] flex items-center justify-center transition-colors text-sm font-bold"
                          >
                            ↑
                          </button>
                        )}
                        {priorityIndex < experiences.length - 1 && (
                          <button
                            onClick={() => handleMoveExperience(exp, 'down')}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-[#2d6a4f] hover:text-white text-[#2d6a4f] flex items-center justify-center transition-colors text-sm font-bold"
                          >
                            ↓
                          </button>
                        )}
                        {priorityIndex >= 0 && (
                          <span className="ml-1 text-xs font-bold text-[#2d6a4f] bg-white px-2 py-1 rounded-full">
                            #{priorityIndex + 1}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Travel month */}
            <div className="bg-white/70 backdrop-blur rounded-2xl p-5 border border-[#b7e4c7]/50">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-[#2d6a4f]" />
                <h4 className="font-semibold text-[#1b4332]">Travel Month</h4>
              </div>
              <p className="text-sm text-[#4a5d52] mb-3">
                Selected: <span className="font-medium text-[#2d6a4f]">{MONTH_NAMES[travelMonth - 1]}</span> — used for crowd-pressure and seasonal relevance.
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {MONTH_NAMES.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setTravelMonth(i + 1)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      travelMonth === i + 1
                        ? 'bg-[#2d6a4f] text-white shadow-sm'
                        : 'bg-[#f0f7f0] text-[#4a5d52] hover:bg-[#d4e9d4]'
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </FormStep>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-[#b7e4c7]/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-5 py-2.5 text-sm font-medium text-[#4a5d52] hover:text-[#1b4332] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={!stepValid()}
            className="flex items-center gap-1.5 px-6 py-3 bg-[#2d6a4f] text-white font-medium rounded-full hover:bg-[#1b4332] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === totalSteps - 1 ? 'See Results' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FormStep({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-slide-in-right">
      <div className="w-14 h-14 bg-[#d4e9d4] rounded-2xl flex items-center justify-center text-[#2d6a4f] mb-5">
        {icon}
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1b4332] mb-2">{title}</h2>
      <p className="text-[#4a5d52] mb-6 leading-relaxed">{subtitle}</p>
      {children}
    </div>
  );
}
