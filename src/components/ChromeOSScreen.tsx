import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  BatteryCharging,
  BellOff,
  Bluetooth,
  Calculator,
  ChevronRight,
  CircleDot,
  Clock,
  FileText,
  Folder,
  Globe,
  HardDrive,
  Maximize2,
  Minimize2,
  Minus,
  Moon,
  Pin,
  Plus,
  Save,
  Search,
  Settings,
  StickyNote,
  Sun,
  Table2,
  Terminal,
  Trash2,
  Volume2,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { evaluateSheetCell } from '../engine/simulation';
import { useSimulation } from '../engine/SimulationContext';
import { ChromeAppId, ChromeNoteItem, ChromeWindow } from '../engine/types';

const CHROME_WALLPAPER = '/src/assets/images/chromeos_wallpaper_1795462416369.jpg';

const APP_ITEMS: { id: ChromeAppId; label: string; color: string; icon: React.ReactNode }[] = [
  { id: 'browser', label: 'Navegador', color: 'bg-sky-600 text-white', icon: <Globe className="w-5 h-5" /> },
  { id: 'docs', label: 'Documentos', color: 'bg-blue-600 text-white', icon: <FileText className="w-5 h-5" /> },
  { id: 'sheets', label: 'Hojas de Cálculo', color: 'bg-emerald-600 text-white', icon: <Table2 className="w-5 h-5" /> },
  { id: 'notes', label: 'Notas rápidas', color: 'bg-amber-500 text-white', icon: <StickyNote className="w-5 h-5" /> },
  { id: 'files', label: 'Archivos', color: 'bg-sky-500 text-white', icon: <Folder className="w-5 h-5" /> },
  { id: 'terminal', label: 'Terminal', color: 'bg-slate-800 text-emerald-400', icon: <Terminal className="w-5 h-5" /> },
  { id: 'taskmanager', label: 'Monitor de tareas', color: 'bg-indigo-600 text-white', icon: <Activity className="w-5 h-5" /> },
  { id: 'calculator', label: 'Calculadora', color: 'bg-teal-600 text-white', icon: <Calculator className="w-5 h-5" /> },
  { id: 'clock', label: 'Reloj', color: 'bg-cyan-700 text-white', icon: <Clock className="w-5 h-5" /> },
  { id: 'settings', label: 'Ajustes', color: 'bg-slate-600 text-white', icon: <Settings className="w-5 h-5" /> },
];

const BOOKMARKS = [
  { title: 'Arquitectura Chrome OS', url: 'chrome://system/architecture' },
  { title: 'Chromium Sandbox Docs', url: 'https://chromium.org/developers/design-documents/sandbox' },
  { title: 'Linux Kernel 6.6', url: 'https://kernel.org/doc/html/latest' },
  { title: 'WebGPU Benchmark', url: 'https://webgpu-lab.local/render' },
];

export const ChromeOSScreen: React.FC = () => {
  const {
    state,
    openChromeApp,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    toggleLauncher,
    toggleQuickSettings,
    toggleQuickSetting,
    setQuickSlider,
    addTab,
    closeTab,
    selectTab,
    navigateTab,
    killProcess,
    selectChromeFolder,
    createChromeFile,
    deleteChromeFile,
    execCrosh,
    updateChromeDoc,
    saveChromeDoc,
    updateChromeSheetCell,
    addChromeNote,
    togglePinChromeNote,
    deleteChromeNote,
  } = useSimulation();

  const { chromeos } = state;
  const desktopRef = useRef<HTMLDivElement>(null);
  const [launcherSearch, setLauncherSearch] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [croshInput, setCroshInput] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string>('f-1');
  const [newFileName, setNewFileName] = useState('');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcResetNext, setCalcResetNext] = useState(false);

  // Office & utilities local UI state
  const [docSavedMsg, setDocSavedMsg] = useState(false);
  const [selectedCell, setSelectedCell] = useState('B5');
  const [noteTitleInput, setNoteTitleInput] = useState('');
  const [noteContentInput, setNoteContentInput] = useState('');
  const [noteColorInput, setNoteColorInput] = useState<ChromeNoteItem['color']>('amber');
  const [clockTab, setClockTab] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [swRunning, setSwRunning] = useState(false);
  const [swMs, setSwMs] = useState(0);
  const [swLaps, setSwLaps] = useState<number[]>([]);
  const [timerSec, setTimerSec] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  const dragRef = useRef<{
    type: 'move' | 'resize';
    windowId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const activeTab = chromeos.tabs.find((t) => t.id === chromeos.activeTabId) ?? chromeos.tabs[0];

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTab?.id, activeTab?.url]);

  // Shift+Esc shortcut for Chrome OS Task Manager
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        openChromeApp('taskmanager');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openChromeApp]);

  // Stopwatch interval
  useEffect(() => {
    if (!swRunning) return;
    const id = window.setInterval(() => setSwMs((ms) => ms + 100), 100);
    return () => window.clearInterval(id);
  }, [swRunning]);

  // Countdown timer interval
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerSec((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current || !desktopRef.current) return;
      const d = dragRef.current;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const bounds = desktopRef.current.getBoundingClientRect();

      if (d.type === 'move') {
        const clampedX = Math.max(0, Math.min(bounds.width - 180, d.origX + dx));
        const clampedY = Math.max(0, Math.min(bounds.height - 100, d.origY + dy));
        moveWindow(d.windowId, clampedX, clampedY);
      } else {
        const nextW = Math.max(290, Math.min(bounds.width - d.origX, d.origW + dx));
        const nextH = Math.max(240, Math.min(bounds.height - d.origY - 56, d.origH + dy));
        resizeWindow(d.windowId, nextW, nextH);
      }
    };

    const onPointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [moveWindow, resizeWindow]);

  const startDrag = (e: React.PointerEvent, win: ChromeWindow) => {
    if (win.maximized) return;
    focusWindow(win.id);
    dragRef.current = {
      type: 'move',
      windowId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      origW: win.width,
      origH: win.height,
    };
  };

  const startResize = (e: React.PointerEvent, win: ChromeWindow) => {
    e.stopPropagation();
    if (win.maximized) return;
    focusWindow(win.id);
    dragRef.current = {
      type: 'resize',
      windowId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      origW: win.width,
      origH: win.height,
    };
  };

  const handleCalcDigit = (digit: string) => {
    if (calcResetNext || calcDisplay === '0') {
      setCalcDisplay(digit);
      setCalcResetNext(false);
    } else {
      setCalcDisplay(calcDisplay + digit);
    }
  };

  const handleCalcOp = (op: string) => {
    const current = parseFloat(calcDisplay);
    if (calcPrev !== null && calcOp && !calcResetNext) {
      const result = computeCalc(calcPrev, current, calcOp);
      setCalcDisplay(String(result));
      setCalcPrev(result);
    } else {
      setCalcPrev(current);
    }
    setCalcOp(op);
    setCalcResetNext(true);
  };

  const computeCalc = (a: number, b: number, op: string) => {
    if (op === '+') return Number((a + b).toFixed(6));
    if (op === '-') return Number((a - b).toFixed(6));
    if (op === '×') return Number((a * b).toFixed(6));
    if (op === '÷') return b === 0 ? 0 : Number((a / b).toFixed(6));
    return b;
  };

  const handleCalcEquals = () => {
    if (calcPrev === null || !calcOp) return;
    const result = computeCalc(calcPrev, parseFloat(calcDisplay), calcOp);
    setCalcDisplay(String(result));
    setCalcPrev(null);
    setCalcOp(null);
    setCalcResetNext(true);
  };

  const renderAppContent = (win: ChromeWindow) => {
    switch (win.appId) {
      case 'browser':
        return (
          <div className="flex flex-col h-full bg-white text-slate-900">
            {/* Browser Tab Strip */}
            <div className="flex items-center gap-1 px-2 pt-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
              {chromeos.tabs.map((tab) => {
                const isActive = activeTab?.id === tab.id;
                return (
                  <div
                    key={tab.id}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[190px] shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white text-slate-900 font-medium shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectTab(tab.id)}
                      className="truncate text-left flex-1 cursor-pointer"
                    >
                      {tab.title}
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {tab.pid}
                    </span>
                    <button
                      type="button"
                      onClick={() => closeTab(tab.id)}
                      aria-label={`Cerrar pestaña ${tab.title}`}
                      className="p-0.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => addTab(`Pestaña ${chromeos.tabs.length + 1}`, 'chrome://newtab')}
                aria-label="Nueva pestaña"
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Omnibox */}
            {activeTab && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const clean = urlInput.trim() || 'chrome://newtab';
                  const title = clean.replace(/^https?:\/\//, '').split('/')[0] || 'Nueva pestaña';
                  navigateTab(activeTab.id, clean, title);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border-b border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => openChromeApp('taskmanager')}
                  className="px-2 py-1 text-[11px] font-medium bg-sky-50 text-sky-700 rounded hover:bg-sky-100 whitespace-nowrap shrink-0 cursor-pointer"
                  title="Ver proceso en Monitor de tareas (Shift+Esc)"
                >
                  PID {activeTab.pid}
                </button>
                <input
                  type="text"
                  aria-label="Barra de direcciones del navegador"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-100 rounded-full border border-transparent focus:border-sky-500 focus:bg-white outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-sky-600 text-white rounded-full hover:bg-sky-700 cursor-pointer"
                >
                  Ir
                </button>
              </form>
            )}

            {/* Quick bookmarks bar */}
            {activeTab && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border-b border-slate-200 overflow-x-auto text-[11px]">
                {BOOKMARKS.map((bm) => (
                  <button
                    key={bm.url}
                    type="button"
                    onClick={() => navigateTab(activeTab.id, bm.url, bm.title)}
                    className="px-2 py-0.5 rounded hover:bg-slate-200 text-slate-600 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {bm.title}
                  </button>
                ))}
              </div>
            )}

            {/* Viewport */}
            <div className="flex-1 p-5 overflow-y-auto os-scroll">
              {!activeTab ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <p className="text-sm text-slate-600">No hay pestañas abiertas en el navegador.</p>
                  <button
                    type="button"
                    onClick={() => addTab('Nueva pestaña', 'chrome://system/architecture')}
                    className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg cursor-pointer"
                  >
                    Abrir nueva pestaña
                  </button>
                </div>
              ) : !chromeos.quickSettings.wifi && !activeTab.url.startsWith('chrome://') ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3">
                  <WifiOff className="w-10 h-10 text-slate-400" />
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Sin conexión a Internet
                  </h3>
                  <p className="text-xs text-slate-500">
                    El Wi-Fi está desactivado desde el panel de ajustes rápidos de Chrome OS.
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleQuickSetting('wifi')}
                    className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer"
                  >
                    Activar Wi-Fi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900">
                        {activeTab.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">{activeTab.url}</p>
                    </div>
                    <div className="text-right text-xs font-mono tabular-nums text-slate-600">
                      <div>Renderer PID: {activeTab.pid}</div>
                      <div>
                        CPU {activeTab.cpu.toFixed(1)}% · RAM {activeTab.memoryMb} MB
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Esta pestaña se ejecuta en su propio proceso sandboxed dentro de Chrome OS.
                    Si finalizas el PID <span className="font-mono font-semibold">{activeTab.pid}</span> en
                    el Monitor de tareas (<kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Shift+Esc</kbd>),
                    esta pestaña se cerrará sin afectar al navegador principal ni a otras pestañas.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-xs font-semibold text-slate-900">Aislamiento de sitio</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Strict Site Isolation activo · seccomp-bpf habilitado
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-xs font-semibold text-slate-900">Estado de red</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {chromeos.quickSettings.wifi ? 'Conectado vía WLAN0' : 'Solo páginas chrome://'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'taskmanager': {
        const totalRam = chromeos.processes.reduce((acc, p) => acc + p.memoryMb, 0);
        return (
          <div className="flex flex-col h-full bg-white text-slate-900">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                Procesos activos: <span className="font-mono tabular-nums">{chromeos.processes.length}</span>
              </span>
              <span className="font-mono tabular-nums text-slate-600">
                Memoria total asignada: {totalRam} MB
              </span>
            </div>
            <div className="flex-1 overflow-auto os-scroll">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 sticky top-0 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Tarea / Proceso</th>
                    <th className="py-2 px-3">PID</th>
                    <th className="py-2 px-3 text-right whitespace-nowrap">CPU %</th>
                    <th className="py-2 px-3 text-right whitespace-nowrap">Memoria</th>
                    <th className="py-2 px-3 text-right whitespace-nowrap">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chromeos.processes.map((proc) => (
                    <tr key={proc.pid} className="hover:bg-sky-50/50">
                      <td className="py-2 px-3">
                        <div className="font-medium text-slate-900">{proc.name}</div>
                        <div className="text-[11px] text-slate-500">{proc.type}</div>
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-slate-600 whitespace-nowrap">{proc.pid}</td>
                      <td className="py-2 px-3 font-mono tabular-nums text-right text-slate-800 whitespace-nowrap">
                        {proc.cpu.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-right text-slate-800 whitespace-nowrap">
                        {proc.memoryMb} MB
                      </td>
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        {proc.type === 'Kernel/Browser' ? (
                          <span className="text-[11px] text-slate-400">Protegido</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => killProcess(proc.pid)}
                            className="px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded whitespace-nowrap cursor-pointer"
                          >
                            Finalizar proceso
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'files': {
        const folderFiles = chromeos.files.filter((f) => f.folder === chromeos.selectedFolder);
        const currentFile =
          folderFiles.find((f) => f.id === selectedFileId) ?? folderFiles[0] ?? null;
        return (
          <div className="flex h-full bg-white text-slate-900">
            <aside className="w-44 bg-slate-50 border-r border-slate-200 p-2 space-y-1 shrink-0">
              {(['Descargas', 'Google Drive', 'Archivos de Linux'] as const).map((folder) => (
                <button
                  key={folder}
                  type="button"
                  onClick={() => selectChromeFolder(folder)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-left cursor-pointer ${
                    chromeos.selectedFolder === folder
                      ? 'bg-sky-100 text-sky-900'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{folder}</span>
                </button>
              ))}
            </aside>
            <div className="flex-1 flex flex-col min-w-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newFileName.trim()) return;
                  createChromeFile(
                    newFileName.trim(),
                    `Archivo creado en ${chromeos.selectedFolder} desde Chrome OS Files.`
                  );
                  setNewFileName('');
                }}
                className="flex items-center gap-2 p-2.5 border-b border-slate-200"
              >
                <input
                  type="text"
                  aria-label="Nombre de nuevo archivo"
                  placeholder="Nuevo archivo (ej. informe.txt)..."
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs bg-slate-100 rounded-md outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs font-medium bg-sky-600 text-white rounded-md hover:bg-sky-700 cursor-pointer"
                >
                  Crear
                </button>
              </form>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 min-h-0">
                <div className="border-r border-slate-100 overflow-y-auto os-scroll divide-y divide-slate-100">
                  {folderFiles.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500">Carpeta vacía.</div>
                  ) : (
                    folderFiles.map((f) => (
                      <div
                        key={f.id}
                        className={`flex items-center justify-between px-3 py-2 text-xs ${
                          currentFile?.id === f.id ? 'bg-sky-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedFileId(f.id)}
                          className="text-left flex-1 truncate font-medium text-slate-800 cursor-pointer"
                        >
                          {f.name}
                          <div className="text-[10px] text-slate-400 font-mono">
                            {f.sizeKb} KB · {f.updatedAt}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteChromeFile(f.id)}
                          aria-label={`Eliminar ${f.name}`}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 bg-slate-50/50 overflow-y-auto os-scroll">
                  {currentFile ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-900">{currentFile.name}</div>
                      <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap bg-white p-2.5 rounded border border-slate-200">
                        {currentFile.preview}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Selecciona un archivo para previsualizar.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'terminal':
        return (
          <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-mono text-xs">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              {['help', 'ps', 'free -m', 'ping 8.8.8.8', 'top'].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => execCrosh(quick)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 shrink-0 cursor-pointer"
                >
                  {quick}
                </button>
              ))}
            </div>
            <div className="flex-1 p-3 overflow-y-auto os-scroll space-y-1">
              {chromeos.terminalHistory.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith('crosh>') ? 'text-emerald-400' : 'text-slate-300'}
                >
                  {line}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                execCrosh(croshInput);
                setCroshInput('');
              }}
              className="flex items-center gap-2 px-3 py-2 border-t border-slate-800 bg-slate-900"
            >
              <span className="text-emerald-400">crosh&gt;</span>
              <input
                type="text"
                aria-label="Comando en Terminal Crosh"
                value={croshInput}
                onChange={(e) => setCroshInput(e.target.value)}
                placeholder="Escribe comando..."
                className="flex-1 bg-transparent outline-none text-slate-100"
              />
            </form>
          </div>
        );

      case 'calculator': {
        const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'];
        return (
          <div className="flex flex-col h-full bg-slate-50 p-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-right">
              <div className="text-[11px] font-mono text-slate-400 h-4">
                {calcPrev !== null && calcOp ? `${calcPrev} ${calcOp}` : ''}
              </div>
              <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 truncate">
                {calcDisplay}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
              <button
                type="button"
                onClick={() => {
                  setCalcDisplay('0');
                  setCalcPrev(null);
                  setCalcOp(null);
                }}
                className="col-span-4 py-2 rounded-lg bg-rose-100 text-rose-800 font-semibold text-xs hover:bg-rose-200 cursor-pointer"
              >
                Limpiar (C)
              </button>
              {keys.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === '=') handleCalcEquals();
                    else if (['+', '-', '×', '÷'].includes(k)) handleCalcOp(k);
                    else handleCalcDigit(k);
                  }}
                  className={`rounded-lg font-mono font-semibold text-sm cursor-pointer transition-colors ${
                    k === '='
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : ['+', '-', '×', '÷'].includes(k)
                        ? 'bg-sky-100 text-sky-900 hover:bg-sky-200'
                        : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'settings':
        return (
          <div className="p-5 space-y-5 bg-white text-slate-900 h-full overflow-y-auto os-scroll">
            <div>
              <h3 className="font-display text-base font-bold">Ajustes de Chrome OS</h3>
              <p className="text-xs text-slate-500">
                Sincronizado con el panel de ajustes rápidos del estante
              </p>
            </div>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5">
                <div>
                  <div className="text-sm font-medium">Red Wi-Fi</div>
                  <div className="text-xs text-slate-500">
                    {chromeos.quickSettings.wifi ? 'Conectado a Lab_5GHz' : 'Desconectado'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleQuickSetting('wifi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    chromeos.quickSettings.wifi
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {chromeos.quickSettings.wifi ? 'Activado' : 'Desactivado'}
                </button>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div>
                  <div className="text-sm font-medium">Bluetooth</div>
                  <div className="text-xs text-slate-500">
                    {chromeos.quickSettings.bluetooth ? 'Visible para dispositivos' : 'Apagado'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleQuickSetting('bluetooth')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    chromeos.quickSettings.bluetooth
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {chromeos.quickSettings.bluetooth ? 'Activado' : 'Desactivado'}
                </button>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div>
                  <div className="text-sm font-medium">Modo No molestar</div>
                  <div className="text-xs text-slate-500">Silencia notificaciones de apps</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleQuickSetting('dnd')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    chromeos.quickSettings.dnd
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {chromeos.quickSettings.dnd ? 'Activo' : 'Inactivo'}
                </button>
              </div>
              <div className="p-3.5 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label htmlFor="chrome-settings-brightness">Brillo de pantalla</label>
                  <span className="font-mono tabular-nums">{chromeos.quickSettings.brightness}%</span>
                </div>
                <input
                  id="chrome-settings-brightness"
                  type="range"
                  min={40}
                  max={110}
                  value={chromeos.quickSettings.brightness}
                  onChange={(e) => setQuickSlider('brightness', Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            </div>
          </div>
        );

      case 'docs': {
        const wordCount = chromeos.docContent.trim()
          ? chromeos.docContent.trim().split(/\s+/).length
          : 0;
        const insertSnippet = (snippet: string) => {
          updateChromeDoc(
            chromeos.docTitle,
            `${chromeos.docContent}${chromeos.docContent.endsWith('\n') ? '' : '\n'}${snippet}`
          );
        };
        return (
          <div className="flex flex-col h-full bg-white text-slate-900">
            <div className="px-3.5 py-2.5 bg-blue-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <input
                type="text"
                aria-label="Título del documento"
                value={chromeos.docTitle}
                onChange={(e) => updateChromeDoc(e.target.value, chromeos.docContent)}
                className="font-display font-bold text-sm text-slate-900 bg-transparent border-b border-transparent focus:border-blue-500 outline-none flex-1 min-w-[180px]"
              />
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono tabular-nums text-slate-500 whitespace-nowrap">
                  {wordCount} palabras · {chromeos.docContent.length} car.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    saveChromeDoc(chromeos.docTitle, chromeos.docContent);
                    setDocSavedMsg(true);
                    window.setTimeout(() => setDocSavedMsg(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{docSavedMsg ? 'Guardado en Drive' : 'Guardar en Google Drive'}</span>
                </button>
              </div>
            </div>
            <div className="px-3.5 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => insertSnippet('## Nueva sección')}
                className="px-2 py-1 rounded hover:bg-slate-200 font-semibold text-slate-700 cursor-pointer"
              >
                + Título H2
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('**Punto clave:** ')}
                className="px-2 py-1 rounded hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
              >
                Negrita
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('- Elemento de lista')}
                className="px-2 py-1 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                • Lista
              </button>
              <span className="ml-auto text-[11px] text-slate-500 whitespace-nowrap">
                {chromeos.quickSettings.wifi ? 'Drive en línea' : 'Edición offline local'}
              </span>
            </div>
            <div className="flex-1 p-4 bg-slate-100/70 overflow-y-auto os-scroll">
              <textarea
                aria-label="Contenido del documento"
                value={chromeos.docContent}
                onChange={(e) => updateChromeDoc(chromeos.docTitle, e.target.value)}
                className="w-full h-full min-h-[250px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-800 leading-relaxed font-sans outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        );
      }

      case 'sheets': {
        const cols = ['A', 'B', 'C', 'D'];
        const rows = [1, 2, 3, 4, 5, 6];
        const rawFormula = chromeos.sheetCells[selectedCell] ?? '';
        return (
          <div className="flex flex-col h-full bg-white text-slate-900">
            <div className="px-3.5 py-2 bg-emerald-50/70 border-b border-slate-200 flex items-center gap-2 text-xs">
              <span className="font-mono font-bold px-2 py-1 rounded bg-white border border-emerald-200 text-emerald-800 w-10 text-center shrink-0">
                {selectedCell}
              </span>
              <span className="font-mono text-slate-400">fx</span>
              <input
                type="text"
                aria-label={`Fórmula o valor de la celda ${selectedCell}`}
                value={rawFormula}
                onChange={(e) => updateChromeSheetCell(selectedCell, e.target.value)}
                placeholder="Valor o fórmula (=SUM(B2:B4), =AVG(C2:C4), =B2-B3)..."
                className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded font-mono text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1 overflow-auto os-scroll p-3">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-mono">
                    <th className="w-8 border border-slate-200 py-1.5 text-center">#</th>
                    {cols.map((col) => (
                      <th key={col} className="border border-slate-200 py-1.5 px-2 text-center">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row}>
                      <td className="bg-slate-50 border border-slate-200 text-center font-mono text-slate-500 py-1.5">
                        {row}
                      </td>
                      {cols.map((col) => {
                        const ref = `${col}${row}`;
                        const isSelected = selectedCell === ref;
                        const evaluated = evaluateSheetCell(chromeos.sheetCells, ref);
                        const isHeader = row === 1;
                        const isFormula = (chromeos.sheetCells[ref] ?? '').startsWith('=');
                        return (
                          <td
                            key={ref}
                            className={`border p-0 ${
                              isSelected ? 'border-emerald-600 ring-1 ring-emerald-500' : 'border-slate-200'
                            } ${isHeader ? 'bg-slate-50 font-semibold' : 'bg-white'}`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedCell(ref)}
                              aria-label={`Celda ${ref}: ${evaluated || 'vacía'}`}
                              className={`w-full h-full text-left px-2.5 py-2 tabular-nums cursor-pointer ${
                                isFormula ? 'font-mono font-semibold text-emerald-800' : 'text-slate-800'
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
              <p className="mt-2.5 text-[11px] text-slate-500">
                Soporta rangos <code className="font-mono bg-slate-100 px-1 rounded">=SUM(B2:B4)</code>,{' '}
                <code className="font-mono bg-slate-100 px-1 rounded">=AVG(B2:B4)</code>,{' '}
                <code className="font-mono bg-slate-100 px-1 rounded">=MIN</code>,{' '}
                <code className="font-mono bg-slate-100 px-1 rounded">=MAX</code> y aritmética básica.
              </p>
            </div>
          </div>
        );
      }

      case 'notes': {
        const sortedNotes = [...chromeos.notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));
        const colorStyles: Record<ChromeNoteItem['color'], string> = {
          amber: 'bg-amber-50 border-amber-200',
          sky: 'bg-sky-50 border-sky-200',
          emerald: 'bg-emerald-50 border-emerald-200',
          rose: 'bg-rose-50 border-rose-200',
        };
        return (
          <div className="flex flex-col h-full bg-white text-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!noteTitleInput.trim() && !noteContentInput.trim()) return;
                addChromeNote(noteTitleInput, noteContentInput, noteColorInput);
                setNoteTitleInput('');
                setNoteContentInput('');
              }}
              className="p-3 bg-slate-50 border-b border-slate-200 space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  aria-label="Título de nueva nota"
                  placeholder="Título de la nota..."
                  value={noteTitleInput}
                  onChange={(e) => setNoteTitleInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-500"
                />
                <div className="flex items-center gap-1">
                  {(['amber', 'sky', 'emerald', 'rose'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNoteColorInput(c)}
                      aria-label={`Color ${c}`}
                      className={`w-5 h-5 rounded-full border cursor-pointer ${
                        c === 'amber'
                          ? 'bg-amber-300'
                          : c === 'sky'
                            ? 'bg-sky-300'
                            : c === 'emerald'
                              ? 'bg-emerald-300'
                              : 'bg-rose-300'
                      } ${noteColorInput === c ? 'ring-2 ring-slate-900' : 'border-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  aria-label="Contenido de nueva nota"
                  placeholder="Escribe un recordatorio rápido..."
                  value={noteContentInput}
                  onChange={(e) => setNoteContentInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer"
                >
                  Añadir nota
                </button>
              </div>
            </form>
            <div className="flex-1 p-3 overflow-y-auto os-scroll grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-xl border p-3 flex flex-col justify-between gap-2 ${colorStyles[note.color]}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{note.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => togglePinChromeNote(note.id)}
                          aria-label={`${note.pinned ? 'Desfijar' : 'Fijar'} ${note.title}`}
                          className={`p-1 rounded cursor-pointer ${
                            note.pinned ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-white/70'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteChromeNote(note.id)}
                          aria-label={`Eliminar nota ${note.title}`}
                          className="p-1 rounded text-slate-500 hover:text-rose-700 hover:bg-white/70 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'clock': {
        const mins = Math.floor(swMs / 60000);
        const secs = Math.floor((swMs % 60000) / 1000);
        const tenths = Math.floor((swMs % 1000) / 100);
        const tMins = Math.floor(timerSec / 60);
        const tSecs = timerSec % 60;
        return (
          <div className="flex flex-col h-full bg-white text-slate-900 p-4 gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <div className="text-xs text-slate-500">Hora del sistema (UTC-5)</div>
                <div className="font-mono tabular-nums text-lg font-bold text-slate-900">11:32 · Lab</div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setClockTab('stopwatch')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                    clockTab === 'stopwatch' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Cronómetro
                </button>
                <button
                  type="button"
                  onClick={() => setClockTab('timer')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                    clockTab === 'timer' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Temporizador
                </button>
              </div>
            </div>

            {clockTab === 'stopwatch' ? (
              <div className="flex-1 flex flex-col justify-between gap-3">
                <div className="py-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono tabular-nums text-3xl font-bold text-slate-900">
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}.{tenths}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSwRunning((r) => !r)}
                    className="px-4 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    {swRunning ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSwLaps((prev) => [swMs, ...prev].slice(0, 5))}
                    disabled={swMs === 0}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium disabled:opacity-40 cursor-pointer"
                  >
                    Vuelta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSwRunning(false);
                      setSwMs(0);
                      setSwLaps([]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Reiniciar
                  </button>
                </div>
                {swLaps.length > 0 && (
                  <div className="border-t border-slate-100 pt-2 space-y-1 text-xs font-mono tabular-nums text-slate-600">
                    {swLaps.map((lap, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>Vuelta {swLaps.length - idx}</span>
                        <span>{(lap / 1000).toFixed(1)} s</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between gap-3">
                <div className="py-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono tabular-nums text-3xl font-bold text-slate-900">
                  {String(tMins).padStart(2, '0')}:{String(tSecs).padStart(2, '0')}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {[60, 300, 1500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSec(preset);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 cursor-pointer"
                    >
                      {preset / 60} min
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    disabled={timerSec === 0}
                    className="px-4 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    {timerRunning ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSec(300);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
  };

  const filteredApps = APP_ITEMS.filter((a) =>
    a.label.toLowerCase().includes(launcherSearch.toLowerCase())
  );

  return (
    <section
      aria-label="Simulador de Chrome OS"
      className="h-[calc(100vh-3.5rem)] w-full bg-slate-200 p-2 sm:p-4 flex flex-col items-center justify-center"
    >
      {/* Chromebook / Monitor Bezel */}
      <div className="w-full h-full max-w-[1400px] bg-slate-900 rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col border border-slate-800">
        <div className="flex items-center justify-between px-3 pb-1.5 text-[11px] text-slate-400">
          <span>Chromebook Lab Display · Material Design</span>
          <span className="font-mono">Atajo: Shift+Esc → Monitor de tareas</span>
        </div>

        {/* Screen Canvas */}
        <div
          ref={desktopRef}
          style={{ filter: `brightness(${chromeos.quickSettings.brightness / 100})` }}
          className="relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200 select-none"
        >
          {/* Wallpaper Image */}
          <img
            src={CHROME_WALLPAPER}
            alt="Fondo de escritorio de Chrome OS"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Desktop Quick Shortcuts */}
          <div className="relative z-0 p-4 flex flex-col gap-2 w-fit">
            {APP_ITEMS.slice(0, 4).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openChromeApp(app.id)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/40 backdrop-blur-xs transition-colors w-20 cursor-pointer"
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${app.color}`}>
                  {app.icon}
                </span>
                <span className="text-[11px] font-medium text-slate-900 bg-white/75 px-1.5 py-0.5 rounded truncate max-w-full">
                  {app.label}
                </span>
              </button>
            ))}
          </div>

          {/* Open Windows */}
          {chromeos.windows
            .filter((w) => !w.minimized)
            .map((win) => (
              <div
                key={win.id}
                onPointerDown={() => focusWindow(win.id)}
                style={
                  win.maximized
                    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 52px)', zIndex: win.zIndex }
                    : {
                        left: `${win.x}px`,
                        top: `${win.y}px`,
                        width: `${win.width}px`,
                        height: `${win.height}px`,
                        zIndex: win.zIndex,
                      }
                }
                className="absolute bg-white rounded-xl shadow-xl border border-slate-300/80 flex flex-col overflow-hidden"
              >
                {/* Titlebar */}
                <div
                  onPointerDown={(e) => startDrag(e, win)}
                  className="h-9 px-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between cursor-move shrink-0"
                >
                  <span className="text-xs font-semibold text-slate-800 truncate">{win.title}</span>
                  <div
                    className="flex items-center gap-1"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => minimizeWindow(win.id)}
                      aria-label={`Minimizar ${win.title}`}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleMaximizeWindow(win.id)}
                      aria-label={`Maximizar ${win.title}`}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      {win.maximized ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => closeWindow(win.id)}
                      aria-label={`Cerrar ${win.title}`}
                      className="p-1 rounded hover:bg-rose-100 text-slate-600 hover:text-rose-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Window Body */}
                <div className="flex-1 min-h-0 overflow-hidden">{renderAppContent(win)}</div>

                {/* Resize Handle */}
                {!win.maximized && (
                  <div
                    onPointerDown={(e) => startResize(e, win)}
                    aria-hidden="true"
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 text-slate-400"
                  >
                    <ChevronRight className="w-3 h-3 rotate-45" />
                  </div>
                )}
              </div>
            ))}

          {/* App Launcher Drawer */}
          {chromeos.launcherOpen && (
            <div
              role="dialog"
              aria-label="Lanzador de aplicaciones"
              className="absolute bottom-14 left-3 w-80 sm:w-[420px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 space-y-4"
            >
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  aria-label="Buscar aplicación"
                  placeholder="Buscar aplicaciones de Chrome OS..."
                  value={launcherSearch}
                  onChange={(e) => setLauncherSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 rounded-full outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => openChromeApp(app.id)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${app.color}`}>
                      {app.icon}
                    </span>
                    <span className="text-xs font-medium text-slate-800 text-center leading-tight">
                      {app.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Settings Panel */}
          {chromeos.quickSettingsOpen && (
            <div
              role="dialog"
              aria-label="Ajustes rápidos"
              className="absolute bottom-14 right-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 space-y-4 text-slate-900"
            >
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => toggleQuickSetting('wifi')}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    chromeos.quickSettings.wifi
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {chromeos.quickSettings.wifi ? (
                    <Wifi className="w-4 h-4" />
                  ) : (
                    <WifiOff className="w-4 h-4" />
                  )}
                  <span>Wi-Fi</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleQuickSetting('bluetooth')}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    chromeos.quickSettings.bluetooth
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Bluetooth className="w-4 h-4" />
                  <span>Bluetooth</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleQuickSetting('dnd')}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    chromeos.quickSettings.dnd
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {chromeos.quickSettings.dnd ? (
                    <BellOff className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span>No molestar</span>
                </button>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-slate-600 shrink-0" />
                  <input
                    type="range"
                    aria-label="Brillo"
                    min={40}
                    max={110}
                    value={chromeos.quickSettings.brightness}
                    onChange={(e) => setQuickSlider('brightness', Number(e.target.value))}
                    className="flex-1 accent-sky-600"
                  />
                  <span className="text-xs font-mono tabular-nums w-9 text-right">
                    {chromeos.quickSettings.brightness}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <input
                    type="range"
                    aria-label="Volumen"
                    min={0}
                    max={100}
                    value={chromeos.quickSettings.volume}
                    onChange={(e) => setQuickSlider('volume', Number(e.target.value))}
                    className="flex-1 accent-sky-600"
                  />
                  <span className="text-xs font-mono tabular-nums w-9 text-right">
                    {chromeos.quickSettings.volume}%
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Batería: {chromeos.batteryPct}%</span>
                <button
                  type="button"
                  onClick={() => openChromeApp('settings')}
                  className="text-sky-700 font-semibold hover:underline cursor-pointer"
                >
                  Todos los ajustes
                </button>
              </div>
            </div>
          )}

          {/* Bottom Shelf */}
          <div className="absolute bottom-0 inset-x-0 h-[52px] bg-white/85 backdrop-blur-md border-t border-white/60 px-3 flex items-center justify-between z-30">
            {/* Launcher Button */}
            <button
              type="button"
              onClick={() => toggleLauncher()}
              aria-label="Abrir lanzador de aplicaciones"
              aria-expanded={chromeos.launcherOpen}
              className="w-9 h-9 rounded-full bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
            >
              <CircleDot className="w-5 h-5" />
            </button>

            {/* Pinned & Open App Icons */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
              {APP_ITEMS.map((app) => {
                const win = chromeos.windows.find((w) => w.appId === app.id);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      if (win && !win.minimized) {
                        focusWindow(win.id);
                      } else {
                        openChromeApp(app.id);
                      }
                    }}
                    aria-label={app.label}
                    title={app.label}
                    className="relative p-1 rounded-xl hover:bg-slate-900/10 transition-colors cursor-pointer shrink-0"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${app.color}`}>
                      {app.icon}
                    </span>
                    {win && (
                      <span
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 rounded-full bg-sky-700 ${
                          win.minimized ? 'w-1.5 opacity-60' : 'w-4'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* System Tray */}
            <button
              type="button"
              onClick={() => toggleQuickSettings()}
              aria-label="Bandeja del sistema y ajustes rápidos"
              aria-expanded={chromeos.quickSettingsOpen}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 text-xs font-medium transition-colors cursor-pointer"
            >
              {chromeos.quickSettings.wifi ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-700" />
              )}
              <Volume2 className="w-3.5 h-3.5" />
              <span className="flex items-center gap-1 font-mono tabular-nums">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-700" />
                {chromeos.batteryPct}%
              </span>
              <span className="font-mono tabular-nums">11:32</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
