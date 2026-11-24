import React from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Flame,
  FlaskConical,
  Layers,
  Monitor,
  Play,
  RotateCcw,
  WifiOff,
  XCircle,
  Zap,
} from 'lucide-react';
import { useSimulation } from '../engine/SimulationContext';

export const TestLabScreen: React.FC = () => {
  const {
    state,
    setActiveSection,
    runAllTests,
    runSingleTest,
    addTab,
    toggleQuickSetting,
    sendIpcBurst,
    updateRtosSensor,
    panicRtosBoard,
    logStressEvent,
    resetAll,
  } = useSimulation();

  const passedCount = state.testResults.filter((t) => t.status === 'PASS').length;
  const failedCount = state.testResults.filter((t) => t.status === 'FAIL').length;

  const chromeRamMb = state.chromeos.processes.reduce((acc, p) => acc + p.memoryMb, 0);
  const fuchsiaMemMb = (
    state.fuchsia.components.reduce((acc, c) => acc + c.memoryKb, 0) / 1024
  ).toFixed(1);
  const rtosStackKb = (
    state.rtos.tasks.reduce((acc, t) => acc + t.stackUsedBytes, 0) / 1024
  ).toFixed(2);

  const handleChromeHeavyBurst = () => {
    addTab('WebGPU Shader Heavy #1', 'https://webgpu-lab.local/heavy-1', true);
    addTab('WebGPU Shader Heavy #2', 'https://webgpu-lab.local/heavy-2', true);
    addTab('WASM Compiler Worker', 'https://wasm-studio.local/build', true);
    logStressEvent('Chrome OS: inyectadas 3 pestañas pesadas (+3 procesos Renderer).');
  };

  const handleFuchsiaIpcFlood = () => {
    sendIpcBurst(25, true);
    logStressEvent('Fuchsia: ráfaga de 25 mensajes FIDL por zx_channel (con simulación de descartes).');
  };

  const handleRtosThermalSpike = () => {
    updateRtosSensor('temperatureC', 68.5);
    logStressEvent('RTOS: inyectado pico térmico de 68.5 °C -> LED_ALARM activo.');
  };

  const handleRtosWatchdogPanic = () => {
    panicRtosBoard();
    logStressEvent('RTOS: provocado Stack Overflow -> recuperación automática vía Hardware Watchdog.');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold tracking-wide text-sky-700">
            Verificación unificada sobre el motor compartido
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Laboratorio de Pruebas y Benchmarks
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Ejecuta la suite de validación arquitectónica, inyecta fallos o carga sintética en cada
            sistema operativo y observa el impacto en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar simuladores</span>
          </button>
          <button
            type="button"
            onClick={runAllTests}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Ejecutar toda la suite</span>
          </button>
        </div>
      </section>

      {/* Summary KPI Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Pruebas aprobadas</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            {passedCount} / {state.testResults.length}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            {failedCount === 0 ? 'Sin regresiones detectadas' : `${failedCount} fallidas`}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Chrome OS · Procesos</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            {state.chromeos.processes.length} PIDs
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums mt-1">
            RAM: {chromeRamMb} MB · Wi-Fi: {state.chromeos.quickSettings.wifi ? 'ON' : 'OFF'}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Fuchsia · Canales FIDL</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            {state.fuchsia.ipcTotalCount} msg
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums mt-1">
            Descartados: {state.fuchsia.ipcDroppedCount} · {fuchsiaMemMb} MB
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">RTOS · Determinismo</div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-1">
            {state.rtos.maxJitterUs} µs
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums mt-1">
            Pila: {rtosStackKb} KB · WDT: {state.rtos.watchdogResets}
          </div>
        </div>
      </section>

      {/* Automated Verification Suite */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-sky-700" />
            <span>Suite de Verificación Arquitectónica</span>
          </h2>
          <span className="text-xs text-slate-500">
            Cada prueba ejecuta transiciones reales sobre el motor compartido
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.testResults.map((testItem) => (
            <article
              key={testItem.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">{testItem.os}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-mono font-semibold ${
                      testItem.status === 'PASS'
                        ? 'text-emerald-700'
                        : testItem.status === 'FAIL'
                          ? 'text-rose-700'
                          : 'text-slate-500'
                    }`}
                  >
                    {testItem.status === 'PASS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {testItem.status === 'FAIL' && <XCircle className="w-3.5 h-3.5" />}
                    <span>
                      {testItem.status === 'IDLE'
                        ? 'PENDIENTE'
                        : `${testItem.status} · ${testItem.durationMs.toFixed(1)} ms`}
                    </span>
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-slate-900">{testItem.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{testItem.description}</p>

                {testItem.assertions.length > 0 && (
                  <ul className="pt-2 space-y-1.5 border-t border-slate-100">
                    {testItem.assertions.map((a, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <span
                          className={`font-mono font-bold shrink-0 ${
                            a.passed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {a.passed ? '[OK]' : '[ERR]'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-slate-800 font-medium">{a.label}</div>
                          <div className="text-[11px] font-mono text-slate-500">{a.detail}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {testItem.lastRunTick !== null
                    ? `Última ejecución: Tick #${testItem.lastRunTick}`
                    : 'Sin ejecutar aún'}
                </span>
                <button
                  type="button"
                  onClick={() => runSingleTest(testItem.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Ejecutar prueba
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Stress & Fault Injection + Live Event Log */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Pruebas de Estrés e Inyección de Fallos
            </h2>
            <p className="text-xs text-slate-500">
              Modifica el estado vivo de los simuladores y comprueba los cambios directamente en cada pantalla
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleChromeHeavyBurst}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-left cursor-pointer transition-colors"
            >
              <Monitor className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Chrome OS: Inyectar 3 pestañas pesadas
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Aumenta procesos Renderer y consumo de RAM
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                toggleQuickSetting('wifi');
                logStressEvent(
                  `Chrome OS: Wi-Fi conmutado a ${!state.chromeos.quickSettings.wifi ? 'ON' : 'OFF'}.`
                );
              }}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-left cursor-pointer transition-colors"
            >
              <WifiOff className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Chrome OS: Alternar corte de red Wi-Fi
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Estado actual: {state.chromeos.quickSettings.wifi ? 'Conectado' : 'Sin conexión'}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleFuchsiaIpcFlood}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 text-left cursor-pointer transition-colors"
            >
              <Layers className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Fuchsia: Ráfaga FIDL (25 mensajes)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Satura canales zx::channel y simula descartes
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleRtosThermalSpike}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-left cursor-pointer transition-colors"
            >
              <Flame className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  RTOS: Inyectar pico térmico (68.5 °C)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Dispara LED_ALARM GPIO15 y evento ISR en UART
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleRtosWatchdogPanic}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 text-left cursor-pointer transition-colors sm:col-span-2"
            >
              <Zap className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  RTOS: Provocar Stack Overflow + Watchdog Reset
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Simula desbordamiento de pila en Task_Display y recuperación automática de la placa
                </div>
              </div>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('chromeos')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-slate-800 cursor-pointer"
            >
              Inspeccionar en Chrome OS →
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('fuchsia')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-slate-800 cursor-pointer"
            >
              Inspeccionar en Fuchsia →
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('rtos')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-slate-800 cursor-pointer"
            >
              Inspeccionar en RTOS →
            </button>
          </div>
        </div>

        {/* Fault & Stress Event Log */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Bitácora de Inyecciones</span>
            </h2>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              Tick #{state.globalTick}
            </span>
          </div>
          <div className="flex-1 font-mono text-xs space-y-2 overflow-y-auto os-scroll max-h-64">
            {state.stressEvents.length === 0 ? (
              <p className="text-slate-400">
                Aún no se han inyectado pruebas de estrés. Usa los controles de la izquierda para
                observar la reacción del motor compartido.
              </p>
            ) : (
              state.stressEvents.map((ev, i) => (
                <div key={i} className="text-sky-300 border-b border-slate-800/70 pb-1.5">
                  {ev}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Live Telemetry Comparison Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <span>Telemetría comparada en vivo</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">Actualización continua</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">Métrica en vivo</th>
                <th className="py-3 px-6">Chrome OS</th>
                <th className="py-3 px-6">Google Fuchsia</th>
                <th className="py-3 px-6">RTOS Embebido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs tabular-nums">
              <tr>
                <td className="py-3 px-6 font-sans font-medium text-slate-900">
                  Unidades de ejecución activas
                </td>
                <td className="py-3 px-6 text-slate-700">
                  {state.chromeos.processes.length} procesos ({state.chromeos.tabs.length} pestañas)
                </td>
                <td className="py-3 px-6 text-slate-700">
                  {state.fuchsia.components.filter((c) => c.state === 'RUNNING').length}/
                  {state.fuchsia.components.length} componentes
                </td>
                <td className="py-3 px-6 text-slate-700">
                  {state.rtos.tasks.filter((t) => t.state !== 'SUSPENDED').length}/
                  {state.rtos.tasks.length} tareas
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-sans font-medium text-slate-900">
                  Consumo de memoria reportado
                </td>
                <td className="py-3 px-6 text-slate-700">{chromeRamMb} MB RAM</td>
                <td className="py-3 px-6 text-slate-700">{fuchsiaMemMb} MB VMOs</td>
                <td className="py-3 px-6 text-slate-700">{rtosStackKb} KB SRAM (pilas)</td>
              </tr>
              <tr>
                <td className="py-3 px-6 font-sans font-medium text-slate-900">
                  Estado de aislamiento / alertas
                </td>
                <td className="py-3 px-6 text-slate-700">
                  Red Wi-Fi: {state.chromeos.quickSettings.wifi ? 'Activa' : 'Cortada'}
                </td>
                <td className="py-3 px-6 text-slate-700">
                  IPC FIDL: {state.fuchsia.ipcTotalCount} ok / {state.fuchsia.ipcDroppedCount} drop
                </td>
                <td className="py-3 px-6 text-slate-700">
                  Temp: {state.rtos.sensors.temperatureC.toFixed(1)}°C · Alarma:{' '}
                  {state.rtos.leds.alarm ? 'ON' : 'OFF'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
