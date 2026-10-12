import { useEffect, useState } from 'react';
import type { Destination } from '@/types';
import { supabase } from '@/lib/supabase';
import { LandingPage } from '@/components/LandingPage';
import { PreferenceForm } from '@/components/PreferenceForm';
import { ResultsPage } from '@/components/ResultsPage';
import { DetailPage } from '@/components/DetailPage';
import type { TripPreferences } from '@/types';

type Screen = 'landing' | 'form' | 'results' | 'detail';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Failed to load destinations:', error);
      } else if (data) {
        setDestinations(data as Destination[]);
      }
      setLoading(false);
    }
    fetchDestinations();
  }, []);

  const selectedDestination = destinations.find((d) => d.id === selectedDestId) || null;

  const handleFormSubmit = (prefs: TripPreferences) => {
    setPreferences(prefs);
    setScreen('results');
  };

  const handleSelectDestination = (id: string) => {
    setSelectedDestId(id);
    setScreen('detail');
  };

  const handleBackToResults = () => {
    setScreen('results');
  };

  const handleStartOver = () => {
    setPreferences(null);
    setSelectedDestId(null);
    setScreen('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f7f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2d6a4f] font-medium">Loading destinations…</p>
        </div>
      </div>
    );
  }

  if (screen === 'landing') {
    return <LandingPage onStart={() => setScreen('form')} />;
  }

  if (screen === 'form') {
    return (
      <PreferenceForm
        onSubmit={handleFormSubmit}
        onBack={() => setScreen('landing')}
      />
    );
  }

  if (screen === 'results' && preferences) {
    return (
      <ResultsPage
        destinations={destinations}
        preferences={preferences}
        onSelectDestination={handleSelectDestination}
        onStartOver={handleStartOver}
      />
    );
  }

  if (screen === 'detail' && selectedDestination && preferences) {
    return (
      <DetailPage
        destination={selectedDestination}
        allDestinations={destinations}
        preferences={preferences}
        onBack={handleBackToResults}
        onSelectDestination={handleSelectDestination}
        onStartOver={handleStartOver}
      />
    );
  }

  return <LandingPage onStart={() => setScreen('form')} />;
}
