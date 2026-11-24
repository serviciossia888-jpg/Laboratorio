import React from 'react';
import { ArrowRight, Cpu, FlaskConical, Layers, Monitor, RotateCcw } from 'lucide-react';
import { useSimulation } from '../engine/SimulationContext';
import { SectionId } from '../engine/types';

export const OverviewScreen: React.FC = () => {
  const { state, setActiveSection, resetAll } = useSimulation();

  const chromeRamMb = state.chromeos.processes.reduce((acc, p) => acc + p.memoryMb, 0);
  const fuchsiaMemKb = state.fuchsia.components.reduce((acc, c) => acc + c.memoryKb, 0);
  const rtosStackBytes = state.rtos.tasks.reduce((acc, t) => acc + t.stackUsedBytes, 0);
  const passedCount = state.testResults.filter((t) => t.status === 'PASS').length;

  const osCards: {
    id: SectionId;
    name: string;
    kernel: string;
    paradigm: string;
    summary: string;
    metricLabel: string;
    metricValue: string;
    cta: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'chromeos',
      name: 'Chrome OS',
      kernel: 'Linux 6.6 + Verified Boot',
      paradigm: 'Escritorio centrado en web · Multi-proceso',
      summary:
        'Aislamiento estricto por pestaña en procesos Renderer independientes, estante inferior, ajustes rápidos y administración de tareas.',
      metricLabel: 'Procesos activos / RAM',
      metricValue: `${state.chromeos.processes.length} proc · ${chromeRamMb} MB`,
      cta: 'Abrir Chrome OS',
      icon: <Monitor className="w-5 h-5 text-sky-600" />,
    },
    {
      id: 'fuchsia',
      name: 'Google Fuchsia',
      kernel: 'Microkernel Zircon',
      paradigm: 'Workstation Stories · Capacidades y Handles',
      summary:
        'Sin ventanas flotantes clásicas ni permisos globales: módulos componibles en Stories que se comunican mediante canales FIDL y handles.',
      metricLabel: 'Componentes / Mensajes IPC',
      metricValue: `${state.fuchsia.components.length} comp · ${state.fuchsia.ipcTotalCount} IPC`,
      cta: 'Abrir Fuchsia',
      icon: <Layers className="w-5 h-5 text-rose-600" />,
    },
    {
      id: 'rtos',
      name: 'Sistema Embebido (RTOS)',
      kernel: 'FreeRTOS Tickless (Sin MMU)',
      paradigm: 'Planificación determinista · Hardware directo',
      summary:
        'Ejecución en placa MCU con LEDs reactivos, pantalla OLED 128x64, consola serial UART y monitor de pila por tarea en tiempo real.',
      metricLabel: 'Tareas / Pila asignada',
      metricValue: `${state.rtos.tasks.length} tareas · ${(rtosStackBytes / 1024).toFixed(1)} KB`,
      cta: 'Abrir RTOS Embebido',
      icon: <Cpu className="w-5 h-5 text-amber-600" />,
    },
  ];

  const comparisonRows = [
    {
      criterion: 'Tipo de Kernel',
      chrome: 'Monolítico endurecido (Linux)',
      fuchsia: 'Microkernel por capacidades (Zircon)',
      rtos: 'Núcleo en tiempo real (FreeRTOS)',
    },
    {
      criterion: 'Unidad de aislamiento',
      chrome: 'Proceso Linux + Sandbox seccomp',
      fuchsia: 'Componente + Zircon Handle (zx::channel)',
      rtos: 'Tarea con pila estática + MPU opcional',
    },
    {
      criterion: 'Paradigma de interfaz',
      chrome: 'Ventanas flotantes + Estante Material Design',
      fuchsia: 'Stories modulares + Overview + Árbol FIDL',
      rtos: 'Periféricos físicos (GPIO/OLED) + UART CLI',
    },
    {
      criterion: 'Huella de memoria típica',
      chrome: 'Centenas de MB – Varios GB',
      chromeColor: 'text-slate-700',
      fuchsia: 'Decenas de MB (VMOs compartidos)',
      rtos: 'Kilobytes de SRAM (sin MMU)',
    },
    {
      criterion: 'Determinismo temporal',
      chrome: 'Mejor esfuerzo (PREEMPT_DYNAMIC)',
      fuchsia: 'Baja latencia con prioridades IPC',
      rtos: 'Determinista estricto (Jitter < 10 µs)',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Hero section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            Entorno interactivo de arquitecturas operativas
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-[1.12]">
            Laboratorio de Sistemas Operativos Emergentes y de Nicho
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Explora tres filosofías radicalmente distintas de diseño operativo desde sus interfaces
            nativas hasta su motor de simulación compartido: escritorio multi-proceso, microkernel
            basado en capacidades y tiempo real sobre hardware embebido.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveSection('chromeos')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Explorar simuladores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('pruebas')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-sky-700" />
              <span>Ir al Laboratorio de Pruebas</span>
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar estado</span>
            </button>
          </div>
        </div>

        {/* Live Shared Engine Telemetry Summary */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Motor de simulación compartido
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Estado persistente sincronizado entre las 5 pantallas
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-sky-700">
              {state.running ? 'ACTIVO' : 'PAUSADO'} · Tick #{state.globalTick}
            </span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            <div className="p-3.5 bg-slate-50/60">
              <div className="text-xs text-slate-500">Chrome OS</div>
              <div className="font-mono tabular-nums text-lg font-semibold text-slate-900 mt-1">
                {state.chromeos.tabs.length} pestañas
              </div>
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                {chromeRamMb} MB asignados
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/60">
              <div className="text-xs text-slate-500">Fuchsia Zircon</div>
              <div className="font-mono tabular-nums text-lg font-semibold text-slate-900 mt-1">
                {state.fuchsia.stories.length} stories
              </div>
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                {(fuchsiaMemKb / 1024).toFixed(1)} MB VMOs
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/60">
              <div className="text-xs text-slate-500">RTOS Embebido</div>
              <div className="font-mono tabular-nums text-lg font-semibold text-slate-900 mt-1">
                {state.rtos.sensors.temperatureC.toFixed(1)} °C
              </div>
              <div className="text-xs text-slate-500 font-mono tabular-nums">
                Jitter: {state.rtos.jitterUs} µs
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/60">
              <div className="text-xs text-slate-500">Suite de Pruebas</div>
              <div className="font-mono tabular-nums text-lg font-semibold text-slate-900 mt-1">
                {passedCount}/{state.testResults.length} PASS
              </div>
              <div className="text-xs text-slate-500">Verificación arquitectónica</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 OS Launch Cards */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Pantallas de simulación interactiva
          </h2>
          <p className="text-sm text-slate-500">
            El estado de ventanas, componentes y tareas se conserva al cambiar de sección
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {osCards.map((card) => (
            <article
              key={card.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100">
                    {card.icon}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{card.kernel}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{card.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{card.paradigm}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{card.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-500">{card.metricLabel}</div>
                  <div className="text-xs font-mono tabular-nums font-semibold text-slate-900">
                    {card.metricValue}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection(card.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {card.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Comparative Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Comparativa rápida de arquitectura
            </h2>
            <p className="text-xs text-slate-500">
              Diferencias estructurales evaluadas en el Laboratorio de Pruebas
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('pruebas')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
          >
            Ejecutar pruebas comparativas →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">Dimensión</th>
                <th className="py-3 px-6">Chrome OS</th>
                <th className="py-3 px-6">Google Fuchsia</th>
                <th className="py-3 px-6">RTOS Embebido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row) => (
                <tr key={row.criterion} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-6 font-medium text-slate-900">{row.criterion}</td>
                  <td className="py-3.5 px-6 text-slate-600">{row.chrome}</td>
                  <td className="py-3.5 px-6 text-slate-600">{row.fuchsia}</td>
                  <td className="py-3.5 px-6 text-slate-600">{row.rtos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
