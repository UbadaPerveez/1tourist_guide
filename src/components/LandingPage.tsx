import { Mountain, ArrowRight, Compass, Leaf, TrendingDown, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f0] via-[#e8f5e9] to-[#d4e9d4]">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#2d6a4f] rounded-xl flex items-center justify-center shadow-sm">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-[#1b4332]">Tourist Guide</span>
        </div>
        <button
          onClick={onStart}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#2d6a4f] hover:text-[#1b4332] transition-colors"
        >
          Start Planning <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur rounded-full border border-[#b7e4c7] mb-6 animate-fade-in opacity-0-init">
          <Leaf className="w-4 h-4 text-[#40916c]" />
          <span className="text-sm font-medium text-[#40916c]">Sustainable Tourism for Karnataka</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-[#1b4332] leading-[1.15] mb-5 animate-fade-in-up opacity-0-init delay-100">
          Discover the places<br />
          <span className="text-[#40916c]">other apps miss.</span>
        </h1>

        <p className="text-lg text-[#4a5d52] max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up opacity-0-init delay-200">
          Most travel apps rank by popularity, sending everyone to the same crowded spots.
          We surface under-recognized destinations by balancing your preferences with
          appreciation gaps, sustainability, and crowd pressure — so Karnataka's hidden gems
          finally get their moment.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2d6a4f] text-white font-medium rounded-full hover:bg-[#1b4332] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up opacity-0-init delay-300"
        >
          <Sparkles className="w-5 h-5" />
          Plan My Trip
        </button>
      </section>

      {/* Problem section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-5">
          <ProblemCard
            icon={<TrendingDown className="w-6 h-6" />}
            title="The Overtourism Problem"
            description="Coorg, Hampi, and Mysore receive the lion's share of visitors. Popular apps amplify this — ranking by ratings pushes everyone to the same 5 spots."
            delay="delay-400"
          />
          <ProblemCard
            icon={<Mountain className="w-6 h-6" />}
            title="Hidden Gems Buried"
            description="Yana Caves, Kudremukh, and the Sirsi region offer world-class experiences but rank low on popularity. Quality ≠ visibility in most algorithms."
            delay="delay-500"
          />
          <ProblemCard
            icon={<Leaf className="w-6 h-6" />}
            title="Our Approach"
            description="We score destinations on preference match, appreciation gap, sustainability, and crowd pressure — then show you the full breakdown transparently."
            delay="delay-600"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-display text-2xl font-semibold text-[#1b4332] text-center mb-8">
          How the ranking works
        </h2>
        <div className="space-y-4">
          <FormulaRow
            weight="35%"
            label="Preference Match"
            color="bg-[#2d6a4f]"
            description="How well the destination matches your chosen experiences, budget, and trip duration"
          />
          <FormulaRow
            weight="30%"
            label="Appreciation Gap"
            color="bg-[#40916c]"
            description="Quality score minus popularity — surfaces places that are great but under-visited"
          />
          <FormulaRow
            weight="20%"
            label="Sustainability"
            color="bg-[#52b788]"
            description="Eco-infrastructure, local community involvement, and carrying capacity vs. footfall"
          />
          <FormulaRow
            weight="−15%"
            label="Crowd Pressure"
            color="bg-[#b76e2d]"
            description="Seasonal visitor load for your travel month — subtracted because fewer crowds means a better visit"
          />
        </div>
      </section>

      {/* CTA footer */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-white/60 backdrop-blur rounded-3xl p-10 border border-[#b7e4c7]">
          <h3 className="font-display text-2xl font-semibold text-[#1b4332] mb-3">
            Ready to find your next destination?
          </h3>
          <p className="text-[#4a5d52] mb-6">
            Answer a few quick questions and we'll rank 18 Karnataka destinations for you.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2d6a4f] text-white font-medium rounded-full hover:bg-[#1b4332] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Plan My Trip <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-[#4a5d52]/60">
        Sustainable Tourism Recommendation · Karnataka, India
      </footer>
    </div>
  );
}

function ProblemCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className={`bg-white/70 backdrop-blur rounded-2xl p-6 border border-[#b7e4c7]/60 animate-fade-in-up opacity-0-init ${delay}`}
    >
      <div className="w-12 h-12 bg-[#d4e9d4] rounded-xl flex items-center justify-center text-[#2d6a4f] mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-[#1b4332] mb-2">{title}</h3>
      <p className="text-sm text-[#4a5d52] leading-relaxed">{description}</p>
    </div>
  );
}

function FormulaRow({
  weight,
  label,
  color,
  description,
}: {
  weight: string;
  label: string;
  color: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/60 backdrop-blur rounded-xl p-4 border border-[#b7e4c7]/50">
      <div className={`flex-shrink-0 w-16 h-16 ${color} rounded-xl flex flex-col items-center justify-center text-white`}>
        <span className="text-lg font-bold">{weight}</span>
      </div>
      <div>
        <h4 className="font-semibold text-[#1b4332]">{label}</h4>
        <p className="text-sm text-[#4a5d52]">{description}</p>
      </div>
    </div>
  );
}
