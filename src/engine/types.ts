export type SectionId = 'inicio' | 'chromeos' | 'fuchsia' | 'rtos' | 'pruebas' | 'docs';

export type ChromeAppId =
  | 'browser'
  | 'files'
  | 'terminal'
  | 'taskmanager'
  | 'calculator'
  | 'settings'
  | 'docs'
  | 'sheets'
  | 'notes'
  | 'clock';

export interface ChromeNoteItem {
  id: string;
  title: string;
  content: string;
  color: 'amber' | 'sky' | 'emerald' | 'rose';
  pinned: boolean;
}

export interface ChromeWindow {
  id: string;
  appId: ChromeAppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  pid: number;
  cpu: number;
  memoryMb: number;
  heavy?: boolean;
}

export interface ChromeProcess {
  pid: number;
  name: string;
  type: 'Kernel/Browser' | 'GPU' | 'Network' | 'Renderer (Pestaña)' | 'App';
  tabId?: string;
  appId?: ChromeAppId;
  cpu: number;
  memoryMb: number;
}

export interface ChromeFileItem {
  id: string;
  name: string;
  folder: 'Descargas' | 'Google Drive' | 'Archivos de Linux';
  sizeKb: number;
  updatedAt: string;
  preview: string;
}

export interface ChromeOSState {
  windows: ChromeWindow[];
  nextZIndex: number;
  nextPid: number;
  launcherOpen: boolean;
  quickSettingsOpen: boolean;
  quickSettings: {
    wifi: boolean;
    bluetooth: boolean;
    dnd: boolean;
    brightness: number;
    volume: number;
  };
  tabs: BrowserTab[];
  activeTabId: string;
  processes: ChromeProcess[];
  files: ChromeFileItem[];
  selectedFolder: 'Descargas' | 'Google Drive' | 'Archivos de Linux';
  terminalHistory: string[];
  batteryPct: number;
  docTitle: string;
  docContent: string;
  sheetCells: Record<string, string>;
  notes: ChromeNoteItem[];
}

export type FuchsiaModuleType =
  | 'settings'
  | 'component-viewer'
  | 'player'
  | 'ffx-terminal'
  | 'ipc-monitor'
  | 'doc-editor'
  | 'sheet-calc'
  | 'calendar-tasks';

export interface FuchsiaTaskItem {
  id: string;
  title: string;
  done: boolean;
  time: string;
}

export interface FuchsiaModule {
  id: string;
  type: FuchsiaModuleType;
  title: string;
  componentId: string;
}

export interface FuchsiaStory {
  id: string;
  title: string;
  subtitle: string;
  modules: FuchsiaModule[];
}

export interface FuchsiaHandle {
  id: string;
  type: 'zx::channel' | 'zx::vmo' | 'zx::eventpair' | 'zx::port';
  rights: string;
  target: string;
}

export interface FuchsiaComponent {
  id: string;
  moniker: string;
  name: string;
  url: string;
  parentId: string | null;
  state: 'RUNNING' | 'PAUSED' | 'TERMINATED';
  memoryKb: number;
  cpuPct: number;
  exposedProtocols: string[];
  usedProtocols: string[];
  handles: FuchsiaHandle[];
}

export interface FuchsiaIPCMessage {
  id: string;
  tick: number;
  from: string;
  to: string;
  protocol: string;
  method: string;
  bytes: number;
  latencyUs: number;
  status: 'OK' | 'DROPPED';
}

export interface FuchsiaState {
  stories: FuchsiaStory[];
  activeStoryId: string;
  overviewMode: boolean;
  componentsPanelOpen: boolean;
  selectedComponentId: string;
  components: FuchsiaComponent[];
  ipcMessages: FuchsiaIPCMessage[];
  ipcDroppedCount: number;
  ipcTotalCount: number;
  audioPlaying: boolean;
  audioTrackIndex: number;
  audioProgressSec: number;
  ffxHistory: string[];
  privacyMicAllowed: boolean;
  uiScale: number;
  docContent: string;
  sheetCells: Record<string, string>;
  tasks: FuchsiaTaskItem[];
}

export type RTOSTaskState = 'RUNNING' | 'READY' | 'BLOCKED' | 'SUSPENDED';

export interface RTOSTask {
  id: string;
  name: string;
  priority: number; // 1 (lowest) to 5 (highest)
  state: RTOSTaskState;
  stackUsedBytes: number;
  stackTotalBytes: number;
  cpuPct: number;
  periodMs: number;
  runCount: number;
}

export interface RTOSState {
  tasks: RTOSTask[];
  sensors: {
    temperatureC: number;
    lightLux: number;
    voltageV: number;
    blinkPeriodMs: number;
  };
  leds: {
    pwr: boolean;
    heartbeat: boolean;
    alarm: boolean;
    uartTx: boolean;
    uartRx: boolean;
  };
  tickCount: number;
  uptimeMs: number;
  jitterUs: number;
  maxJitterUs: number;
  watchdogResets: number;
  bootPhase: 'READY' | 'BOOTING' | 'PANIC';
  oledHistory: number[]; // recent temp/waveform samples
  uartLogs: string[];
  lastBlinkToggleMs: number;
}

export interface TestAssertion {
  label: string;
  passed: boolean;
  detail: string;
}

export interface TestResult {
  id: string;
  os: 'Chrome OS' | 'Fuchsia' | 'RTOS Embebido' | 'Transversal';
  name: string;
  description: string;
  status: 'IDLE' | 'PASS' | 'FAIL';
  durationMs: number;
  lastRunTick: number | null;
  assertions: TestAssertion[];
}

export interface SharedEngineState {
  running: boolean;
  globalTick: number;
  tickRateMs: number;
  chromeos: ChromeOSState;
  fuchsia: FuchsiaState;
  rtos: RTOSState;
  testResults: TestResult[];
  stressEvents: string[];
}
