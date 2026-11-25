import { useEffect, useState } from 'react';
import { useShazhok } from './store';
import { applyTheme } from './theme';
import { initTelegram } from './telegram';
import { detectTimezone } from './utils';
import BottomNav, { type Tab } from './components/BottomNav';
import Toast from './components/Toast';
import Onboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import ScenariosScreen from './screens/ScenariosScreen';
import MyTasksScreen from './screens/MyTasksScreen';
import WinsScreen from './screens/WinsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ScenarioDetailScreen from './screens/ScenarioDetailScreen';
import StartHereScreen from './screens/StartHereScreen';
import RecoveryScreen from './screens/RecoveryScreen';
import SurpriseScreen from './screens/SurpriseScreen';
import CreateScenarioScreen from './screens/CreateScenarioScreen';

type Overlay =
  | { kind: 'scenario'; scenarioId: string }
  | { kind: 'startHere' }
  | { kind: 'recover' }
  | { kind: 'surprise' }
  | { kind: 'create' };

export default function App() {
  const onboardingDone = useShazhok((s) => s.onboardingDone);
  const settings = useShazhok((s) => s.settings);
  const hydrateFromRemote = useShazhok((s) => s.hydrateFromRemote);

  const [tab, setTab] = useState<Tab>('home');
  const [scenariosCategory, setScenariosCategory] = useState<string>('kitchen');
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  useEffect(() => {
    initTelegram();
    void hydrateFromRemote();
  }, [hydrateFromRemote]);

  useEffect(() => {
    // Однократно: заменяем дефолтную зону на реальную (для корректных напоминаний).
    const tz = detectTimezone();
    const current = useShazhok.getState().settings.reminders.timezone;
    if (current === 'Europe/Moscow' && tz && tz !== 'Europe/Moscow') {
      useShazhok.getState().setReminders({ timezone: tz });
    }
  }, []);

  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  if (!onboardingDone) {
    return (
      <>
        <Onboarding />
        <Toast />
      </>
    );
  }

  const openCategory = (categoryId: string) => {
    setScenariosCategory(categoryId);
    setTab('scenarios');
    setOverlay(null);
  };

  const openScenario = (scenarioId: string) => setOverlay({ kind: 'scenario', scenarioId });

  return (
    <>
      <div className="app">
        {tab === 'home' && (
          <HomeScreen
            onOpenCategory={openCategory}
            onSurprise={() => setOverlay({ kind: 'surprise' })}
            onStartHere={() => setOverlay({ kind: 'startHere' })}
            onRecover={() => setOverlay({ kind: 'recover' })}
          />
        )}
        {tab === 'scenarios' && (
          <ScenariosScreen
            categoryId={scenariosCategory}
            onCategoryChange={setScenariosCategory}
            onOpenScenario={openScenario}
          />
        )}
        {tab === 'tasks' && (
          <MyTasksScreen
            onOpenScenario={openScenario}
            onCreate={() => setOverlay({ kind: 'create' })}
          />
        )}
        {tab === 'wins' && <WinsScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </div>

      {!overlay ? <BottomNav active={tab} onChange={setTab} /> : null}

      {overlay?.kind === 'scenario' && (
        <ScenarioDetailScreen
          scenarioId={overlay.scenarioId}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.kind === 'startHere' && (
        <StartHereScreen
          onClose={() => setOverlay(null)}
          onOpenScenario={openScenario}
        />
      )}
      {overlay?.kind === 'recover' && (
        <RecoveryScreen
          onClose={() => setOverlay(null)}
          onOpenScenario={openScenario}
        />
      )}
      {overlay?.kind === 'surprise' && (
        <SurpriseScreen
          onClose={() => setOverlay(null)}
          onOpenScenario={openScenario}
        />
      )}
      {overlay?.kind === 'create' && (
        <CreateScenarioScreen onClose={() => setOverlay(null)} />
      )}

      <Toast />
    </>
  );
}
