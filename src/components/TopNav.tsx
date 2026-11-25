import React from 'react';
import { Pause, Play } from 'lucide-react';
import { useSimulation } from '../engine/SimulationContext';
import { SectionId } from '../engine/types';

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'chromeos', label: 'Chrome OS' },
  { id: 'fuchsia', label: 'Fuchsia' },
  { id: 'rtos', label: 'RTOS Embebido' },
  { id: 'pruebas', label: 'Laboratorio de Pruebas' },
  { id: 'docs', label: 'Documentación' },
];

export const TopNav: React.FC = () => {
  const { activeSection, setActiveSection, state, toggleEngineRunning } = useSimulation();

  return (
    <header className="sticky top-0 z-50 h-14 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 lg:gap-8">
      {/* Zone 1: Single-line Brand Wordmark */}
      <button
        type="button"
        onClick={() => setActiveSection('inicio')}
        className="font-display text-sm lg:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-sky-700 transition-colors cursor-pointer"
      >
        Laboratorio de SO Emergentes
      </button>

      {/* Zone 2: Clean single-line navigation tabs */}
      <nav aria-label="Navegación principal" className="flex items-center gap-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                if (item.id === 'docs') {
                  window.dispatchEvent(new CustomEvent('docs:enter-presentation'));
                }
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary simulation action */}
      <div className="hidden md:flex items-center shrink-0">
        <button
          type="button"
          onClick={toggleEngineRunning}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
            state.running
              ? 'bg-sky-600 text-white hover:bg-sky-700'
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
          }`}
        >
          {state.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{state.running ? 'Pausar motor' : 'Reanudar motor'}</span>
        </button>
      </div>
    </header>
  );
};
