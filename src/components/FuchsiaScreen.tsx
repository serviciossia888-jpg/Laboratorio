import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Box,
  CalendarCheck,
  Check,
  Cpu,
  FileText,
  KeyRound,
  LayoutGrid,
  Music,
  Pause,
  Play,
  Plus,
  Settings,
  SkipForward,
  Table2,
  Terminal,
  Trash2,
  X,
} from 'lucide-react';
import FUCHSIA_WALLPAPER from '../assets/images/fuchsia_bg_flat_1795462428234.jpg';
import { evaluateSheetCell } from '../engine/simulation';
import { useSimulation } from '../engine/SimulationContext';
import { FuchsiaModule, FuchsiaModuleType } from '../engine/types';

const MODULE_OPTIONS: { type: FuchsiaModuleType; label: string; icon: React.ReactNode }[] = [
  { type: 'doc-editor', label: 'Editor Docs VMO', icon: <FileText className="w-4 h-4" /> },
  { type: 'sheet-calc', label: 'Hojas de Cálculo', icon: <Table2 className="w-4 h-4" /> },
  { type: 'calendar-tasks', label: 'Agenda y Utilidades', icon: <CalendarCheck className="w-4 h-4" /> },
  { type: 'component-viewer', label: 'Visor de componentes', icon: <Box className="w-4 h-4" /> },
  { type: 'ipc-monitor', label: 'Monitor de canales IPC', icon: <Activity className="w-4 h-4" /> },
  { type: 'player', label: 'Reproductor', icon: <Music className="w-4 h-4" /> },
  { type: 'ffx-terminal', label: 'Terminal ffx', icon: <Terminal className="w-4 h-4" /> },
  { type: 'settings', label: 'Ajustes', icon: <Settings className="w-4 h-4" /> },
];

const TRACKS = [
  { title: 'Zircon Microkernel Suite', artist: 'Fuchsia Audio Core', duration: '03:34' },
  { title: 'Capability Channel Etude', artist: 'FIDL Async Stream', duration: '02:48' },
  { title: 'Flatland Scenic Waves', artist: 'Workstation Session', duration: '04:12' },
];

export const FuchsiaScreen: React.FC = () => {
  const {
    state,
    selectFuchsiaStory,
    createStory,
    closeStory,
    toggleFuchsiaOverview,
    toggleFuchsiaComponentsPanel,
    selectFuchsiaComponent,
    addStoryModule,
    removeStoryModule,
    reorderStoryModule,
    toggleFuchsiaAudio,
    nextFuchsiaTrack,
    sendIpcBurst,
    restartFuchsiaComponent,
    toggleFuchsiaMicPrivacy,
    setFuchsiaUiScale,
    execFfx,
    updateFuchsiaDoc,
    commitFuchsiaDoc,
    updateFuchsiaSheetCell,
    addFuchsiaTask,
    toggleFuchsiaTask,
    deleteFuchsiaTask,
  } = useSimulation();

  const { fuchsia } = state;
  const [ffxInput, setFfxInput] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [docPreviewMode, setDocPreviewMode] = useState(false);
  const [vmoSynced, setVmoSynced] = useState(false);
  const [fuchsiaCell, setFuchsiaCell] = useState('B5');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('16:30');
  const [vmoPagesKb, setVmoPagesKb] = useState('16');

  const activeStory =
    fuchsia.stories.find((s) => s.id === fuchsia.activeStoryId) ?? fuchsia.stories[0] ?? null;
  const selectedComponent =
    fuchsia.components.find((c) => c.id === fuchsia.selectedComponentId) ?? fuchsia.components[0];

  const renderModuleBody = (mod: FuchsiaModule) => {
    switch (mod.type) {
      case 'component-viewer':
        return (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <div className="font-semibold text-slate-900">{selectedComponent.name}</div>
                <div className="font-mono text-[11px] text-slate-500">{selectedComponent.moniker}</div>
              </div>
              <button
                type="button"
                onClick={() => restartFuchsiaComponent(selectedComponent.id)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium cursor-pointer"
              >
                {selectedComponent.state === 'RUNNING' ? 'Pausar' : 'Reanudar'}
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 break-all">
              {selectedComponent.url}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-500">Protocolos expuestos</div>
                <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-slate-800">
                  {selectedComponent.exposedProtocols.map((p) => (
                    <li key={p} className="truncate">{p}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-500">Handles Zircon activos</div>
                <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-rose-700">
                  {selectedComponent.handles.map((h) => (
                    <li key={h.id} className="truncate">
                      {h.id} · {h.type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'ipc-monitor':
        return (
          <div className="flex flex-col h-full gap-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono tabular-nums text-[11px] text-slate-600">
                Total: <strong className="text-slate-900">{fuchsia.ipcTotalCount}</strong> · Perdidos:{' '}
                <strong className="text-rose-700">{fuchsia.ipcDroppedCount}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => sendIpcBurst(1, false)}
                  className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-medium hover:bg-rose-700 cursor-pointer"
                >
                  Enviar FIDL Ping
                </button>
                <button
                  type="button"
                  onClick={() => sendIpcBurst(5, true)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Simular ráfaga
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto os-scroll border border-slate-100 rounded-lg divide-y divide-slate-100 max-h-56">
              {fuchsia.ipcMessages.slice(0, 12).map((msg) => (
                <div key={msg.id} className="px-2.5 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                  <div className="min-w-0">
                    <div className="font-mono text-slate-900 truncate">
                      {msg.from} → {msg.to}
                    </div>
                    <div className="text-slate-500 truncate">
                      {msg.protocol}.{msg.method}
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0">
                    <div className={msg.status === 'OK' ? 'text-emerald-700' : 'text-rose-700'}>
                      {msg.status} · {msg.latencyUs}µs
                    </div>
                    <div className="text-slate-400">{msg.bytes} B</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'player': {
        const track = TRACKS[fuchsia.audioTrackIndex];
        const pct = Math.min(100, Math.round((fuchsia.audioProgressSec / 214) * 100));
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div>
                <div className="font-display font-semibold text-sm text-slate-900">{track.title}</div>
                <div className="text-slate-500">{track.artist} · VMO 0x0202</div>
              </div>
              <span className="font-mono tabular-nums text-slate-600">{track.duration}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between font-mono tabular-nums text-[11px] text-slate-500">
                <span>
                  {String(Math.floor(fuchsia.audioProgressSec / 60)).padStart(2, '0')}:
                  {String(fuchsia.audioProgressSec % 60).padStart(2, '0')}
                </span>
                <span>{fuchsia.audioPlaying ? 'Transmitiendo FIDL Audio' : 'En pausa'}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleFuchsiaAudio}
                aria-label={fuchsia.audioPlaying ? 'Pausar reproducción' : 'Iniciar reproducción'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 cursor-pointer"
              >
                {fuchsia.audioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{fuchsia.audioPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>
              <button
                type="button"
                onClick={nextFuchsiaTrack}
                aria-label="Siguiente pista"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      }

      case 'ffx-terminal':
        return (
          <div className="flex flex-col h-56 bg-slate-900 text-slate-100 rounded-lg overflow-hidden font-mono text-[11px]">
            <div className="px-2.5 py-1.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
              {['ffx component list', 'ffx log', 'zx_ps', 'help'].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => execFfx(cmd)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded shrink-0 cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>
            <div className="flex-1 p-2.5 overflow-y-auto os-scroll space-y-1">
              {fuchsia.ffxHistory.map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-rose-400' : 'text-slate-300'}>
                  {line}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                execFfx(ffxInput);
                setFfxInput('');
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 border-t border-slate-800"
            >
              <span className="text-rose-400">$</span>
              <input
                type="text"
                aria-label="Comando en terminal ffx"
                value={ffxInput}
                onChange={(e) => setFfxInput(e.target.value)}
                placeholder="ffx component show core..."
                className="flex-1 bg-transparent outline-none text-slate-100"
              />
            </form>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">Capacidad de micrófono global</div>
                <div className="text-slate-500">Concede zx::channel hacia audio_input</div>
              </div>
              <button
                type="button"
                onClick={toggleFuchsiaMicPrivacy}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                  fuchsia.privacyMicAllowed
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {fuchsia.privacyMicAllowed ? 'Permitido' : 'Revocado'}
              </button>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg space-y-1.5">
              <div className="flex justify-between font-medium text-slate-900">
                <label htmlFor="fuchsia-ui-scale">Densidad Flatland UI</label>
                <span className="font-mono tabular-nums">{fuchsia.uiScale}%</span>
              </div>
              <input
                id="fuchsia-ui-scale"
                type="range"
                min={90}
                max={115}
                value={fuchsia.uiScale}
                onChange={(e) => setFuchsiaUiScale(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Kernel: Zircon SMP · Sin POSIX raíz · Aislamiento basado en handles
            </div>
          </div>
        );

      case 'doc-editor': {
        const words = fuchsia.docContent.trim() ? fuchsia.docContent.trim().split(/\s+/).length : 0;
        return (
          <div className="space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                VMO 0x0310 · {words} palabras
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDocPreviewMode((v) => !v)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium whitespace-nowrap cursor-pointer"
                >
                  {docPreviewMode ? 'Editar' : 'Vista previa'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    commitFuchsiaDoc(fuchsia.docContent);
                    setVmoSynced(true);
                    window.setTimeout(() => setVmoSynced(false), 1800);
                  }}
                  className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold whitespace-nowrap cursor-pointer"
                >
                  {vmoSynced ? 'VMO Sincronizado' : 'Sincronizar VMO (FIDL)'}
                </button>
              </div>
            </div>
            {docPreviewMode ? (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 min-h-[150px] whitespace-pre-wrap text-slate-800 leading-relaxed">
                {fuchsia.docContent}
              </div>
            ) : (
              <textarea
                aria-label="Editor de documento Fuchsia VMO"
                value={fuchsia.docContent}
                onChange={(e) => updateFuchsiaDoc(e.target.value)}
                rows={6}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-rose-500 outline-none text-slate-800 leading-relaxed resize-none"
              />
            )}
          </div>
        );
      }

      case 'sheet-calc': {
        const cols = ['A', 'B', 'C'];
        const rows = [1, 2, 3, 4, 5];
        const currentRaw = fuchsia.sheetCells[fuchsiaCell] ?? '';
        return (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold px-2 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 w-9 text-center shrink-0">
                {fuchsiaCell}
              </span>
              <input
                type="text"
                aria-label={`Fórmula Fuchsia celda ${fuchsiaCell}`}
                value={currentRaw}
                onChange={(e) => updateFuchsiaSheetCell(fuchsiaCell, e.target.value)}
                placeholder="Valor o =SUM(B2:B4)"
                className="flex-1 px-2.5 py-1 rounded border border-slate-200 font-mono text-[11px] outline-none focus:border-rose-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono">
                    <th className="w-6 border border-slate-200 py-1">#</th>
                    {cols.map((c) => (
                      <th key={c} className="border border-slate-200 py-1 px-2 text-center">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r}>
                      <td className="bg-slate-50 border border-slate-200 text-center font-mono text-slate-500">
                        {r}
                      </td>
                      {cols.map((c) => {
                        const ref = `${c}${r}`;
                        const evaluated = evaluateSheetCell(fuchsia.sheetCells, ref);
                        const isFormula = (fuchsia.sheetCells[ref] ?? '').startsWith('=');
                        return (
                          <td
                            key={ref}
                            className={`border p-0 ${
                              fuchsiaCell === ref
                                ? 'border-rose-600 ring-1 ring-rose-500'
                                : 'border-slate-200'
                            } ${r === 1 ? 'bg-slate-50 font-semibold' : 'bg-white'}`}
                          >
                            <button
                              type="button"
                              onClick={() => setFuchsiaCell(ref)}
                              aria-label={`Celda Fuchsia ${ref}: ${evaluated || 'vacía'}`}
                              className={`w-full text-left px-2 py-1.5 tabular-nums cursor-pointer ${
                                isFormula ? 'font-mono font-semibold text-rose-700' : 'text-slate-800'
                              }`}
                            >
                              {evaluated || '\u00A0'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'calendar-tasks': {
        const kbVal = Math.max(0, Number(vmoPagesKb) || 0);
        const pages4k = Math.ceil(kbVal / 4);
        const mbVal = (kbVal / 1024).toFixed(3);
        return (
          <div className="space-y-3 text-xs">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!taskTitle.trim()) return;
                addFuchsiaTask(taskTitle, taskTime);
                setTaskTitle('');
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                aria-label="Nueva tarea en agenda Fuchsia"
                placeholder="Nueva tarea o revisión..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-rose-500"
              />
              <input
                type="text"
                aria-label="Hora de la tarea"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className="w-14 px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-center outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold whitespace-nowrap cursor-pointer"
              >
                Agregar
              </button>
            </form>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg max-h-36 overflow-y-auto os-scroll">
              {fuchsia.tasks.map((task) => (
                <div key={task.id} className="px-2.5 py-1.5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFuchsiaTask(task.id)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        task.done
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {task.done && <Check className="w-3 h-3" />}
                    </span>
                    <span className={`truncate ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">{task.time}</span>
                    <button
                      type="button"
                      onClick={() => deleteFuchsiaTask(task.id)}
                      aria-label={`Eliminar tarea ${task.title}`}
                      className="p-0.5 text-slate-400 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="vmo-kb-input" className="font-medium text-slate-700 whitespace-nowrap">
                  Conversor VMO (KB):
                </label>
                <input
                  id="vmo-kb-input"
                  type="number"
                  min={0}
                  value={vmoPagesKb}
                  onChange={(e) => setVmoPagesKb(e.target.value)}
                  className="w-20 px-2 py-1 rounded border border-slate-200 bg-white font-mono tabular-nums outline-none"
                />
              </div>
              <div className="font-mono tabular-nums text-[11px] text-slate-700">
                {pages4k} págs (4 KB) · {mbVal} MB
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <section
      aria-label="Simulador de Google Fuchsia Workstation"
      className="h-[calc(100vh-3.5rem)] w-full bg-slate-200 p-2 sm:p-4 flex flex-col items-center justify-center"
    >
      {/* Workstation Frame */}
      <div className="w-full h-full max-w-[1400px] bg-neutral-900 rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col border border-neutral-800">
        <div className="flex items-center justify-between px-3 pb-1.5 text-[11px] text-neutral-400">
          <span>Fuchsia Workstation · Zircon Microkernel</span>
          <span className="font-mono">Stories componibles · Capacidades FIDL</span>
        </div>

        {/* Fuchsia Canvas */}
        <div className="relative flex-1 rounded-xl overflow-hidden bg-stone-50 flex flex-col">
          <img
            src={FUCHSIA_WALLPAPER}
            alt="Fondo de Fuchsia Workstation"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none"
          />

          {/* Main Workspace + Optional Components Panel */}
          <div className="relative z-10 flex-1 flex min-h-0 overflow-hidden">
            {/* Stories Stage */}
            <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 overflow-y-auto os-scroll">
              {fuchsia.overviewMode ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900">
                        Overview de Stories abiertas
                      </h2>
                      <p className="text-xs text-slate-600">
                        Cada Story agrupa módulos aislados sin ventanas superpuestas
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => createStory(`Story ${fuchsia.stories.length + 1}`, 'component-viewer')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Story</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fuchsia.stories.map((story) => (
                      <div
                        key={story.id}
                        className={`bg-white/95 backdrop-blur rounded-2xl p-4 border shadow-sm flex flex-col justify-between gap-4 ${
                          story.id === activeStory?.id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-bold text-slate-900">{story.title}</h3>
                            <button
                              type="button"
                              onClick={() => closeStory(story.id)}
                              aria-label={`Cerrar ${story.title}`}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500">{story.subtitle}</p>
                          <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                            {story.modules.map((m) => (
                              <span key={m.id} className="bg-slate-100 px-2 py-0.5 rounded">
                                {m.title}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectFuchsiaStory(story.id)}
                          className="w-full py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                        >
                          Enfocar Story
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeStory ? (
                <div className="space-y-4">
                  {/* Active Story Header */}
                  <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                      <h2 className="font-display text-lg font-bold text-slate-900">
                        {activeStory.title}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {activeStory.subtitle} · {activeStory.modules.length} módulos activos
                      </p>
                    </div>

                    <div className="relative flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAddMenuOpen((v) => !v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar módulo</span>
                      </button>

                      {addMenuOpen && (
                        <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                          {MODULE_OPTIONS.map((opt) => (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => {
                                addStoryModule(activeStory.id, opt.type);
                                setAddMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-900 rounded-lg cursor-pointer"
                            >
                              {opt.icon}
                              <span>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Story Modules Tiled Grid */}
                  {activeStory.modules.length === 0 ? (
                    <div className="bg-white/90 rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                      <p className="text-sm text-slate-600">
                        Esta Story no tiene módulos activos actualmente.
                      </p>
                      <button
                        type="button"
                        onClick={() => addStoryModule(activeStory.id, 'component-viewer')}
                        className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg cursor-pointer"
                      >
                        Agregar Visor de componentes
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{ fontSize: `${fuchsia.uiScale}%` }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >
                      {activeStory.modules.map((mod, idx) => (
                        <article
                          key={mod.id}
                          className="bg-white/95 backdrop-blur rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-display font-bold text-slate-900 truncate">
                                {mod.title}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 truncate">
                                {mod.componentId}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => reorderStoryModule(activeStory.id, mod.id, 'left')}
                                aria-label={`Mover ${mod.title} atrás`}
                                className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === activeStory.modules.length - 1}
                                onClick={() => reorderStoryModule(activeStory.id, mod.id, 'right')}
                                aria-label={`Mover ${mod.title} adelante`}
                                className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeStoryModule(activeStory.id, mod.id)}
                                aria-label={`Cerrar módulo ${mod.title}`}
                                className="p-1 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-700 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>{renderModuleBody(mod)}</div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <p className="text-sm text-slate-700">No hay Stories abiertas.</p>
                  <button
                    type="button"
                    onClick={() => createStory('Story Principal', 'component-viewer')}
                    className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg cursor-pointer"
                  >
                    Crear Story
                  </button>
                </div>
              )}
            </div>

            {/* Components Tree & Handles Panel */}
            {fuchsia.componentsPanelOpen && (
              <aside
                aria-label="Panel de Componentes Zircon"
                className="w-80 lg:w-96 bg-white/95 backdrop-blur border-l border-slate-200 flex flex-col shrink-0"
              >
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900">
                      Árbol de Componentes
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Handles de kernel Zircon y estado en vivo
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFuchsiaComponentsPanel(false)}
                    aria-label="Ocultar panel de componentes"
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto os-scroll p-3 space-y-2">
                  {fuchsia.components.map((comp) => {
                    const isSelected = comp.id === selectedComponent.id;
                    const depth = comp.moniker === '/' ? 0 : comp.moniker.split('/').length - 1;
                    return (
                      <div
                        key={comp.id}
                        style={{ marginLeft: `${Math.min(depth * 10, 24)}px` }}
                        className={`rounded-xl border p-2.5 transition-colors ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectFuchsiaComponent(comp.id)}
                          className="w-full text-left cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {comp.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-semibold ${
                                comp.state === 'RUNNING' ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {comp.state}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                            {comp.moniker}
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-600">
                            <span>{(comp.memoryKb / 1024).toFixed(1)} MB</span>
                            <span>{comp.cpuPct.toFixed(1)}% CPU</span>
                            <span className="inline-flex items-center gap-1 text-rose-700">
                              <KeyRound className="w-3 h-3" />
                              {comp.handles.length} {comp.handles.length === 1 ? 'handle' : 'handles'}
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}
          </div>

          {/* Fuchsia Bottom Navigation Bar */}
          <div className="relative z-20 h-14 bg-white/95 backdrop-blur border-t border-slate-200 px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => toggleFuchsiaOverview()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                  fuchsia.overviewMode
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Overview ({fuchsia.stories.length})</span>
              </button>

              {fuchsia.stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => selectFuchsiaStory(story.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    !fuchsia.overviewMode && activeStory?.id === story.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {story.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleFuchsiaComponentsPanel()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  fuchsia.componentsPanelOpen
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Componentes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
