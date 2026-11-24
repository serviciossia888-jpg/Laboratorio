import React from 'react';
import { SimulationProvider, useSimulation } from './engine/SimulationContext';
import { TopNav } from './components/TopNav';
import { OverviewScreen } from './components/OverviewScreen';
import { ChromeOSScreen } from './components/ChromeOSScreen';
import { FuchsiaScreen } from './components/FuchsiaScreen';
import { RTOSScreen } from './components/RTOSScreen';
import { TestLabScreen } from './components/TestLabScreen';
import { DocsManualScreen } from './components/DocsManualScreen';

const LabShell: React.FC = () => {
  const { activeSection } = useSimulation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNav />
      <div className="flex-1">
        {activeSection === 'inicio' && <OverviewScreen />}
        {activeSection === 'chromeos' && <ChromeOSScreen />}
        {activeSection === 'fuchsia' && <FuchsiaScreen />}
        {activeSection === 'rtos' && <RTOSScreen />}
        {activeSection === 'pruebas' && <TestLabScreen />}
        {activeSection === 'docs' && <DocsManualScreen />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <LabShell />
    </SimulationProvider>
  );
}
