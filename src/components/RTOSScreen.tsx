import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Terminal,
  Zap,
} from 'lucide-react';
import { useSimulation } from '../engine/SimulationContext';

export const RTOSScreen: React.FC = () => {
  const {
    state,
    updateRtosSensor,
    toggleRtosTask,
    boostRtosTaskPriority,
    resetRtosBoard,
    panicRtosBoard,
    execRtosUart,
  } = useSimulation();

  const { rtos } = state;
  const [uartInput, setUartInput] = useState('');
  const uartLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uartLogRef.current) {
      uartLogRef.current.scrollTop = uartLogRef.current.scrollHeight;
    }
  }, [rtos.uartLogs.length]);

  const displayTask = rtos.tasks.find((t) => t.id === 't-display');
  const displayFrozen = displayTask?.state === 'SUSPENDED';

  // Sparkline points for 128x64 OLED
  const minVal = 0;
  const maxVal = 85;
  const sparkPoints = rtos.oledHistory
    .map((v, idx) => {
      const x = (idx / Math.max(1, rtos.oledHistory.length - 1)) * 120 + 4;
      const clamped = Math.max(minVal, Math.min(maxVal, v));
      const y = 58 - ((clamped - minVal) / (maxVal - minVal)) * 22;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const leftPins = ['3V3', 'EN/RST', 'ADC0 (TEMP)', 'ADC3 (LUX)', 'GPIO4 (PWM)', 'GND'];
  const rightPins = ['VIN (5V)', 'GPIO17 (TX)', 'GPIO16 (RX)', 'GPIO15 (ALM)', 'GPIO2 (LED)', 'GND'];

  const pwmIntensity = Math.max(0.12, Math.min(1, rtos.sensors.lightLux / 1000));

  return (
    <section
      aria-label="Simulador de Sistema Embebido RTOS"
      className="min-h-[calc(100vh-3.5rem)] w-full bg-slate-950 text-slate-100 p-3 sm:p-5"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: Physical PCB + OLED + Sensor Sliders */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Development Board Enclosure */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h2 className="font-mono text-sm font-bold text-slate-100">
                  Placa MCU-32S · FreeRTOS Tickless
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-xs text-cyan-300">
                  {rtos.bootPhase === 'BOOTING'
                    ? 'BOOTING...'
                    : `Tick #${rtos.tickCount}`}
                </span>
                <button
                  type="button"
                  onClick={panicRtosBoard}
                  className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-800 rounded hover:bg-rose-900 cursor-pointer"
                >
                  Simular Panic
                </button>
              </div>
            </div>

            {/* Interactive PCB Visual */}
            <div className="relative bg-emerald-950/90 border-2 border-emerald-700/80 rounded-xl p-4 shadow-inner">
              {/* Top mounting holes & USB-C */}
              <div className="flex items-center justify-between mb-3">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-300/80 border-2 border-amber-500" />
                <div className="px-4 py-1 bg-slate-400 text-slate-950 font-mono text-[10px] font-bold rounded-b border border-slate-300 tracking-wider">
                  USB-C UART 115200
                </div>
                <span className="w-3.5 h-3.5 rounded-full bg-amber-300/80 border-2 border-amber-500" />
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Left GPIO Header */}
                <div className="col-span-3 space-y-1.5">
                  {leftPins.map((pin) => (
                    <div key={pin} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-200 shrink-0" />
                      <span className="font-mono text-[10px] text-emerald-100 truncate">
                        {pin}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Center MCU + OLED 128x64 + LEDs + Reset */}
                <div className="col-span-6 flex flex-col items-center gap-3">
                  {/* 128x64 OLED Display */}
                  <div className="w-full bg-slate-950 border-2 border-slate-700 rounded-lg p-2">
                    <div className="flex items-center justify-between text-[9px] font-mono text-cyan-500/80 mb-1">
                      <span>SSD1306 128×64 I2C</span>
                      <span>{displayFrozen ? 'FROZEN' : 'LIVE'}</span>
                    </div>
                    <svg
                      viewBox="0 0 128 64"
                      className="w-full h-24 bg-[#031318] rounded border border-cyan-950"
                      role="img"
                      aria-label="Pantalla OLED 128 por 64 del sistema embebido"
                    >
                      {rtos.bootPhase === 'BOOTING' ? (
                        <text
                          x="64"
                          y="35"
                          textAnchor="middle"
                          fill="#22d3ee"
                          fontSize="8"
                          fontFamily="monospace"
                        >
                          BOOTING FREERTOS...
                        </text>
                      ) : (
                        <>
                          <text x="4" y="11" fill="#67e8f9" fontSize="7.5" fontFamily="monospace">
                            TEMP:{rtos.sensors.temperatureC.toFixed(1)}C
                          </text>
                          <text x="68" y="11" fill="#67e8f9" fontSize="7.5" fontFamily="monospace">
                            VDD:{rtos.sensors.voltageV.toFixed(2)}V
                          </text>
                          <text x="4" y="21" fill="#a5f3fc" fontSize="7" fontFamily="monospace">
                            LUX:{rtos.sensors.lightLux}
                          </text>
                          <text x="68" y="21" fill="#a5f3fc" fontSize="7" fontFamily="monospace">
                            JIT:{rtos.jitterUs}us
                          </text>
                          <line x1="2" y1="26" x2="126" y2="26" stroke="#164e63" strokeWidth="0.7" />
                          <polyline
                            fill="none"
                            stroke={rtos.leds.alarm ? '#fb7185' : '#22d3ee'}
                            strokeWidth="1.4"
                            points={sparkPoints}
                          />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Physical LED Array */}
                  <div className="w-full grid grid-cols-5 gap-1.5 bg-emerald-900/70 p-2 rounded-lg border border-emerald-700/60 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          rtos.leds.pwr
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                            : 'bg-slate-700'
                        }`}
                      />
                      <span className="font-mono text-[9px] text-emerald-100">PWR</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        data-testid="rtos-led-heartbeat"
                        className={`w-3 h-3 rounded-full transition-colors ${
                          rtos.leds.heartbeat
                            ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                            : 'bg-slate-800'
                        }`}
                      />
                      <span className="font-mono text-[9px] text-emerald-100">GPIO2</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        data-testid="rtos-led-alarm"
                        className={`w-3 h-3 rounded-full transition-colors ${
                          rtos.leds.alarm
                            ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                            : 'bg-slate-800'
                        }`}
                      />
                      <span className="font-mono text-[9px] text-emerald-100">ALARM</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        style={{ opacity: pwmIntensity }}
                        className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]"
                      />
                      <span className="font-mono text-[9px] text-emerald-100">PWM4</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          rtos.leds.uartTx || rtos.leds.uartRx
                            ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                            : 'bg-slate-800'
                        }`}
                      />
                      <span className="font-mono text-[9px] text-emerald-100">UART</span>
                    </div>
                  </div>

                  {/* Physical Reset Button */}
                  <button
                    type="button"
                    onClick={resetRtosBoard}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-500 text-xs font-mono font-semibold text-white cursor-pointer active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Botón EN / RST</span>
                  </button>
                </div>

                {/* Right GPIO Header */}
                <div className="col-span-3 space-y-1.5 text-right">
                  {rightPins.map((pin) => (
                    <div key={pin} className="flex items-center justify-end gap-1.5">
                      <span className="font-mono text-[10px] text-emerald-100 truncate">
                        {pin}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-200 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sensor & Actuator Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Sensores y Actuadores ADC / PWM</span>
              </h3>
              {rtos.leds.alarm && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ALARMA ACTIVA</span>
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="rtos-temp" className="text-slate-300">
                    Temperatura ADC0 (umbral alarma ≥ 50 °C)
                  </label>
                  <span className="tabular-nums font-semibold text-cyan-300">
                    {rtos.sensors.temperatureC.toFixed(1)} °C
                  </span>
                </div>
                <input
                  id="rtos-temp"
                  type="range"
                  min={-10}
                  max={85}
                  step={0.5}
                  value={rtos.sensors.temperatureC}
                  onChange={(e) => updateRtosSensor('temperatureC', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="rtos-lux" className="text-slate-300">
                    Sensor de luz LDR ADC3 (controla LED PWM4)
                  </label>
                  <span className="tabular-nums font-semibold text-amber-300">
                    {rtos.sensors.lightLux} lux
                  </span>
                </div>
                <input
                  id="rtos-lux"
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={rtos.sensors.lightLux}
                  onChange={(e) => updateRtosSensor('lightLux', Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="rtos-volt" className="text-slate-300">
                    Voltaje VDD (Brownout &lt; 2.80 V)
                  </label>
                  <span className="tabular-nums font-semibold text-emerald-300">
                    {rtos.sensors.voltageV.toFixed(2)} V
                  </span>
                </div>
                <input
                  id="rtos-volt"
                  type="range"
                  min={2.4}
                  max={5.0}
                  step={0.05}
                  value={rtos.sensors.voltageV}
                  onChange={(e) => updateRtosSensor('voltageV', Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="rtos-blink" className="text-slate-300">
                    Periodo Task_Blink (GPIO2)
                  </label>
                  <span className="tabular-nums font-semibold text-cyan-300">
                    {rtos.sensors.blinkPeriodMs} ms
                  </span>
                </div>
                <input
                  id="rtos-blink"
                  type="range"
                  min={100}
                  max={2000}
                  step={50}
                  value={rtos.sensors.blinkPeriodMs}
                  onChange={(e) => updateRtosSensor('blinkPeriodMs', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: htop Task Monitor + UART Serial Console */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {/* RTOS htop Task Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-mono text-sm font-bold text-slate-100">
                  Monitor de Tareas RTOS (htop en tiempo real)
                </h2>
                <p className="font-mono text-[11px] text-slate-400">
                  Uptime: {(rtos.uptimeMs / 1000).toFixed(1)}s · Jitter máx: {rtos.maxJitterUs} µs · WDT Resets: {rtos.watchdogResets}
                </p>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">
                Planificador: Preemptive Priority
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Tarea</th>
                    <th className="py-2.5 px-3">Prio</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3">Uso de pila</th>
                    <th className="py-2.5 px-3 text-right">CPU %</th>
                    <th className="py-2.5 px-3 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {rtos.tasks.map((task) => {
                    const stackPct = Math.round((task.stackUsedBytes / task.stackTotalBytes) * 100);
                    return (
                      <tr key={task.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-100">
                          {task.name}
                          <div className="text-[10px] font-normal text-slate-400">
                            Periodo: {task.periodMs} ms
                          </div>
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          <button
                            type="button"
                            onClick={() => boostRtosTaskPriority(task.id)}
                            title="Rotar prioridad (2-5)"
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
                          >
                            P{task.priority}
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[11px] font-semibold ${
                              task.state === 'RUNNING'
                                ? 'text-emerald-400'
                                : task.state === 'READY'
                                  ? 'text-cyan-300'
                                  : task.state === 'BLOCKED'
                                    ? 'text-amber-300'
                                    : 'text-rose-400'
                            }`}
                          >
                            {task.state}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 min-w-[140px]">
                          <div className="flex justify-between text-[10px] tabular-nums text-slate-300 mb-1">
                            <span>
                              {task.stackUsedBytes}/{task.stackTotalBytes}B
                            </span>
                            <span>{stackPct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                stackPct > 80 ? 'bg-rose-500' : 'bg-cyan-400'
                              }`}
                              style={{ width: `${stackPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-200">
                          {task.cpuPct.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {task.id === 't-idle' ? (
                            <span className="text-[10px] text-slate-500">Sistema</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleRtosTask(task.id)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                                task.state === 'SUSPENDED'
                                  ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900'
                                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                              }`}
                            >
                              {task.state === 'SUSPENDED' ? (
                                <>
                                  <PlayCircle className="w-3 h-3" />
                                  <span>Reanudar</span>
                                </>
                              ) : (
                                <>
                                  <PauseCircle className="w-3 h-3" />
                                  <span>Suspender</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* UART Serial Console */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden min-h-[290px]">
            <div className="px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-100">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Consola Serial UART0 (115200 8N1)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                {['help', 'tasks', 'blink 200', 'reboot'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => execRtosUart(cmd)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={uartLogRef}
              data-testid="rtos-uart-log"
              className="flex-1 p-3.5 overflow-y-auto os-scroll font-mono text-xs space-y-1 bg-slate-950/70 max-h-72"
            >
              {rtos.uartLogs.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.includes('[ALERTA]') ||
                    line.includes('[PANIC]') ||
                    line.includes('[ISR_THERMAL]') ||
                    line.includes('[ERR]')
                      ? 'text-rose-400'
                      : line.includes('[BOOT]') || line.includes('[KERNEL]')
                        ? 'text-amber-300'
                        : 'text-emerald-300'
                  }
                >
                  {line}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                execRtosUart(uartInput);
                setUartInput('');
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 border-t border-slate-800 bg-slate-900 font-mono text-xs"
            >
              <span className="text-emerald-400 font-bold">uart&gt;</span>
              <input
                type="text"
                aria-label="Entrada de comandos UART"
                value={uartInput}
                onChange={(e) => setUartInput(e.target.value)}
                placeholder="Comando UART (ej. tasks, suspend Task_Blink, blink 250)..."
                className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold cursor-pointer"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
