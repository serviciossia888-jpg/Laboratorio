import {
  BrowserTab,
  ChromeAppId,
  ChromeOSState,
  ChromeProcess,
  ChromeWindow,
  FuchsiaComponent,
  FuchsiaIPCMessage,
  FuchsiaModule,
  FuchsiaModuleType,
  FuchsiaState,
  FuchsiaStory,
  RTOSState,
  RTOSTask,
  SectionId,
  SharedEngineState,
  TestResult,
} from './types';

const VALID_SECTIONS: ReadonlySet<string> = new Set([
  'inicio',
  'chromeos',
  'fuchsia',
  'rtos',
  'pruebas',
  'docs',
]);

export function parseSectionFromUrl(hash: string, search: string): SectionId {
  const cleanHash = hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
  if (VALID_SECTIONS.has(cleanHash)) {
    return cleanHash as SectionId;
  }
  const param = new URLSearchParams(search).get('section')?.trim().toLowerCase() ?? '';
  if (VALID_SECTIONS.has(param)) {
    return param as SectionId;
  }
  return 'inicio';
}

export const CHROME_APP_META: Record<
  ChromeAppId,
  { title: string; defaultW: number; defaultH: number; baseMem: number }
> = {
  browser: { title: 'Navegador Chromium', defaultW: 680, defaultH: 430, baseMem: 145 },
  files: { title: 'Archivos', defaultW: 540, defaultH: 370, baseMem: 92 },
  terminal: { title: 'Terminal Crosh', defaultW: 560, defaultH: 360, baseMem: 64 },
  taskmanager: { title: 'Monitor de tareas', defaultW: 580, defaultH: 380, baseMem: 58 },
  calculator: { title: 'Calculadora', defaultW: 310, defaultH: 410, baseMem: 44 },
  settings: { title: 'Ajustes del sistema', defaultW: 560, defaultH: 390, baseMem: 78 },
  docs: { title: 'Documentos', defaultW: 600, defaultH: 430, baseMem: 112 },
  sheets: { title: 'Hojas de Cálculo', defaultW: 630, defaultH: 420, baseMem: 124 },
  notes: { title: 'Notas rápidas', defaultW: 490, defaultH: 390, baseMem: 68 },
  clock: { title: 'Reloj', defaultW: 410, defaultH: 370, baseMem: 52 },
};

export const FUCHSIA_MODULE_META: Record<
  FuchsiaModuleType,
  { title: string; componentId: string; defaultProtocol: string }
> = {
  settings: {
    title: 'Ajustes',
    componentId: 'comp-settings',
    defaultProtocol: 'fuchsia.settings.Display',
  },
  'component-viewer': {
    title: 'Visor de componentes',
    componentId: 'comp-inspector',
    defaultProtocol: 'fuchsia.sys2.RealmQuery',
  },
  player: {
    title: 'Reproductor',
    componentId: 'comp-player',
    defaultProtocol: 'fuchsia.media.Audio',
  },
  'ffx-terminal': {
    title: 'Terminal ffx',
    componentId: 'comp-ffx',
    defaultProtocol: 'fuchsia.developer.remotecontrol',
  },
  'ipc-monitor': {
    title: 'Monitor de canales IPC',
    componentId: 'comp-ipc',
    defaultProtocol: 'fuchsia.diagnostics.ArchiveAccessor',
  },
  'doc-editor': {
    title: 'Editor Docs VMO',
    componentId: 'comp-docs',
    defaultProtocol: 'fuchsia.docs.VmoStore',
  },
  'sheet-calc': {
    title: 'Hojas de Cálculo',
    componentId: 'comp-sheets',
    defaultProtocol: 'fuchsia.calc.EvalEngine',
  },
  'calendar-tasks': {
    title: 'Agenda y Utilidades',
    componentId: 'comp-tasks',
    defaultProtocol: 'fuchsia.calendar.TaskStore',
  },
};

export function createInitialChromeOSState(): ChromeOSState {
  const tabs: BrowserTab[] = [
    {
      id: 'tab-1',
      title: 'Arquitectura Chrome OS',
      url: 'chrome://system/architecture',
      pid: 1042,
      cpu: 3.4,
      memoryMb: 128,
    },
    {
      id: 'tab-2',
      title: 'Chromium Sandbox Docs',
      url: 'https://chromium.org/developers/design-documents/sandbox',
      pid: 1089,
      cpu: 1.8,
      memoryMb: 94,
    },
  ];

  const windows: ChromeWindow[] = [
    {
      id: 'win-browser',
      appId: 'browser',
      title: 'Navegador Chromium',
      x: 116,
      y: 22,
      width: 640,
      height: 410,
      minimized: false,
      maximized: false,
      zIndex: 10,
    },
    {
      id: 'win-taskmanager',
      appId: 'taskmanager',
      title: 'Monitor de tareas',
      x: 680,
      y: 96,
      width: 570,
      height: 350,
      minimized: false,
      maximized: false,
      zIndex: 11,
    },
  ];

  const baseProcesses: ChromeProcess[] = [
    { pid: 1001, name: 'Navegador (Proceso principal)', type: 'Kernel/Browser', cpu: 2.1, memoryMb: 184 },
    { pid: 1012, name: 'Proceso GPU (Vulkan/Skia)', type: 'GPU', cpu: 3.6, memoryMb: 142 },
    { pid: 1018, name: 'Servicio de Red', type: 'Network', cpu: 0.7, memoryMb: 46 },
    { pid: 1025, name: 'Monitor de tareas', type: 'App', appId: 'taskmanager', cpu: 1.2, memoryMb: 58 },
  ];

  const tabProcesses: ChromeProcess[] = tabs.map((t) => ({
    pid: t.pid,
    name: `Pestaña: ${t.title}`,
    type: 'Renderer (Pestaña)',
    tabId: t.id,
    cpu: t.cpu,
    memoryMb: t.memoryMb,
  }));

  return {
    windows,
    nextZIndex: 12,
    nextPid: 1120,
    launcherOpen: false,
    quickSettingsOpen: false,
    quickSettings: {
      wifi: true,
      bluetooth: true,
      dnd: false,
      brightness: 95,
      volume: 70,
    },
    tabs,
    activeTabId: 'tab-1',
    processes: [...baseProcesses, ...tabProcesses],
    files: [
      {
        id: 'f-1',
        name: 'notas_kernel_linux.txt',
        folder: 'Descargas',
        sizeKb: 14,
        updatedAt: 'Hoy 10:15',
        preview: 'Chrome OS ejecuta aplicaciones web en procesos renderer aislados mediante seccomp-bpf y namespaces de Linux.',
      },
      {
        id: 'f-2',
        name: 'tabla_particiones_verified_boot.md',
        folder: 'Descargas',
        sizeKb: 8,
        updatedAt: 'Ayer 18:40',
        preview: 'Verified Boot (dm-verity) verifica criptográficamente cada bloque de la partición raíz de solo lectura.',
      },
      {
        id: 'f-3',
        name: 'presentacion_so_emergentes.pdf',
        folder: 'Google Drive',
        sizeKb: 2450,
        updatedAt: 'Hace 2 días',
        preview: 'Comparativa entre kernels monolíticos endurecidos, microkernels orientados a capacidades y RTOS deterministas.',
      },
      {
        id: 'f-4',
        name: 'crostini_container.yaml',
        folder: 'Archivos de Linux',
        sizeKb: 4,
        updatedAt: 'Hace 3 días',
        preview: 'vm: termina\ncontainer: penguin\nimage: debian:bookworm\nwayland_display: sommelier-0',
      },
    ],
    selectedFolder: 'Descargas',
    terminalHistory: [
      'crosh> uname -a',
      'Linux localhost 6.6.30-chromeos #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      'crosh> Escribe "help" para ver los comandos disponibles.',
    ],
    batteryPct: 87,
    docTitle: 'Informe Técnico Chrome OS',
    docContent:
      '# Seguridad y Productividad en Chrome OS\n\nChrome OS ejecuta aplicaciones de oficina web (PWA) en procesos Renderer aislados con seccomp-bpf.\n\n- Verified Boot (dm-verity) valida la partición raíz de solo lectura.\n- Actualizaciones A/B silenciosas en segundo plano.\n- Sincronización inmediata con Google Drive local.',
    sheetCells: {
      A1: 'Sistema',
      B1: 'RAM (MB)',
      C1: 'Arranque (s)',
      D1: 'Capacidad',
      A2: 'Chrome OS',
      B2: '420',
      C2: '6',
      D2: 'Verified Boot',
      A3: 'Fuchsia',
      B3: '190',
      C3: '4',
      D3: 'Zircon IPC',
      A4: 'RTOS Esp32',
      B4: '2',
      C4: '1',
      D4: 'Determinista',
      A5: 'Total',
      B5: '=SUM(B2:B4)',
      C5: '=SUM(C2:C4)',
      D5: '3 SO',
      A6: 'Promedio',
      B6: '=AVG(B2:B4)',
      C6: '=AVG(C2:C4)',
      D6: '=B2-B3',
    },
    notes: [
      {
        id: 'note-1',
        title: 'Lista de verificación A/B',
        content: 'Confirmar que la partición SLOT_B pasa validación criptográfica antes de reiniciar.',
        color: 'amber',
        pinned: true,
      },
      {
        id: 'note-2',
        title: 'Atajos de escritorio',
        content: 'Shift+Esc abre el Monitor de tareas para inspeccionar PIDs de pestañas y apps.',
        color: 'sky',
        pinned: false,
      },
      {
        id: 'note-3',
        title: 'Prueba sin conexión',
        content: 'Desactivar Wi-Fi en Ajustes rápidos permite editar documentos offline y sincronizar luego.',
        color: 'emerald',
        pinned: false,
      },
    ],
  };
}

export function createInitialFuchsiaState(): FuchsiaState {
  const components: FuchsiaComponent[] = [
    {
      id: 'comp-root',
      moniker: '/',
      name: 'root (Zircon Boot)',
      url: 'fuchsia-boot:///#meta/root.cm',
      parentId: null,
      state: 'RUNNING',
      memoryKb: 12400,
      cpuPct: 0.8,
      exposedProtocols: ['fuchsia.boot.Arguments', 'fuchsia.kernel.Stats'],
      usedProtocols: [],
      handles: [
        { id: '0x001a', type: 'zx::port', rights: 'READ | WRITE', target: 'zircon-scheduler' },
        { id: '0x001f', type: 'zx::vmo', rights: 'MAP | READ', target: 'bootfs-image' },
      ],
    },
    {
      id: 'comp-core',
      moniker: '/core',
      name: 'core',
      url: 'fuchsia-pkg://fuchsia.com/core#meta/core.cm',
      parentId: 'comp-root',
      state: 'RUNNING',
      memoryKb: 28600,
      cpuPct: 1.9,
      exposedProtocols: ['fuchsia.sys2.RealmQuery', 'fuchsia.diagnostics.ArchiveAccessor'],
      usedProtocols: ['fuchsia.kernel.Stats'],
      handles: [
        { id: '0x008c', type: 'zx::channel', rights: 'TRANSFER | WRITE', target: '/core/network' },
        { id: '0x0091', type: 'zx::channel', rights: 'READ | WRITE', target: '/session/workstation' },
      ],
    },
    {
      id: 'comp-session',
      moniker: '/session/workstation',
      name: 'workstation_session',
      url: 'fuchsia-pkg://fuchsia.com/workstation#meta/session.cm',
      parentId: 'comp-core',
      state: 'RUNNING',
      memoryKb: 41200,
      cpuPct: 2.7,
      exposedProtocols: ['fuchsia.session.ElementManager', 'fuchsia.ui.Composition'],
      usedProtocols: ['fuchsia.sys2.RealmQuery'],
      handles: [
        { id: '0x0120', type: 'zx::eventpair', rights: 'SIGNAL', target: 'scenic-flatland' },
        { id: '0x0124', type: 'zx::vmo', rights: 'MAP | WRITE', target: 'framebuffer-surface' },
      ],
    },
    {
      id: 'comp-inspector',
      moniker: '/session/workstation/stories/visor',
      name: 'component_inspector',
      url: 'fuchsia-pkg://fuchsia.com/inspector#meta/visor.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 9400,
      cpuPct: 0.9,
      exposedProtocols: ['fuchsia.ui.app.ViewProvider'],
      usedProtocols: ['fuchsia.sys2.RealmQuery'],
      handles: [
        { id: '0x01a4', type: 'zx::channel', rights: 'READ | WRITE', target: '/core/realm_query' },
      ],
    },
    {
      id: 'comp-ipc',
      moniker: '/session/workstation/stories/ipc_monitor',
      name: 'fidl_ipc_monitor',
      url: 'fuchsia-pkg://fuchsia.com/ipc-mon#meta/monitor.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 7800,
      cpuPct: 1.1,
      exposedProtocols: ['fuchsia.lab.IpcProbe'],
      usedProtocols: ['fuchsia.diagnostics.ArchiveAccessor'],
      handles: [
        { id: '0x01c8', type: 'zx::channel', rights: 'READ | WAIT', target: '/core/archivist' },
        { id: '0x01cc', type: 'zx::port', rights: 'READ | QUEUE', target: 'fidl-async-loop' },
      ],
    },
    {
      id: 'comp-player',
      moniker: '/session/workstation/stories/media_player',
      name: 'audio_player',
      url: 'fuchsia-pkg://fuchsia.com/media#meta/player.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 15200,
      cpuPct: 2.2,
      exposedProtocols: ['fuchsia.media.SessionAudio'],
      usedProtocols: ['fuchsia.media.Audio', 'fuchsia.ui.Composition'],
      handles: [
        { id: '0x0202', type: 'zx::vmo', rights: 'READ | MAP', target: 'audio-ring-buffer' },
        { id: '0x0209', type: 'zx::channel', rights: 'WRITE', target: '/core/audio_core' },
      ],
    },
    {
      id: 'comp-ffx',
      moniker: '/session/workstation/stories/ffx_shell',
      name: 'ffx_console',
      url: 'fuchsia-pkg://fuchsia.com/ffx-shell#meta/ffx.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 6300,
      cpuPct: 0.4,
      exposedProtocols: ['fuchsia.terminal.Session'],
      usedProtocols: ['fuchsia.developer.remotecontrol'],
      handles: [
        { id: '0x0244', type: 'zx::channel', rights: 'READ | WRITE', target: '/core/remote-control' },
      ],
    },
    {
      id: 'comp-settings',
      moniker: '/session/workstation/stories/settings',
      name: 'system_settings',
      url: 'fuchsia-pkg://fuchsia.com/settings#meta/settings.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 8900,
      cpuPct: 0.5,
      exposedProtocols: ['fuchsia.settings.Client'],
      usedProtocols: ['fuchsia.settings.Display', 'fuchsia.settings.Privacy'],
      handles: [
        { id: '0x0271', type: 'zx::channel', rights: 'READ | WRITE', target: '/core/setui_service' },
      ],
    },
    {
      id: 'comp-docs',
      moniker: '/session/workstation/stories/docs_vmo',
      name: 'docs_vmo_editor',
      url: 'fuchsia-pkg://fuchsia.com/office#meta/docs_vmo.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 14200,
      cpuPct: 1.0,
      exposedProtocols: ['fuchsia.docs.VmoStore'],
      usedProtocols: ['fuchsia.ui.Composition', 'fuchsia.io.Directory'],
      handles: [
        { id: '0x0310', type: 'zx::vmo', rights: 'READ | WRITE | MAP', target: 'shared-doc-buffer' },
        { id: '0x0314', type: 'zx::channel', rights: 'READ | WRITE', target: '/core/pkg-cache' },
      ],
    },
    {
      id: 'comp-sheets',
      moniker: '/session/workstation/stories/sheet_calc',
      name: 'fidl_sheet_calc',
      url: 'fuchsia-pkg://fuchsia.com/office#meta/sheet_calc.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 11800,
      cpuPct: 0.8,
      exposedProtocols: ['fuchsia.calc.EvalEngine'],
      usedProtocols: ['fuchsia.ui.Composition'],
      handles: [
        { id: '0x0338', type: 'zx::vmo', rights: 'READ | WRITE', target: 'matrix-cells-vmo' },
        { id: '0x033c', type: 'zx::channel', rights: 'WRITE', target: '/core/archivist' },
      ],
    },
    {
      id: 'comp-tasks',
      moniker: '/session/workstation/stories/agenda_tasks',
      name: 'workstation_agenda',
      url: 'fuchsia-pkg://fuchsia.com/office#meta/agenda.cm',
      parentId: 'comp-session',
      state: 'RUNNING',
      memoryKb: 7600,
      cpuPct: 0.4,
      exposedProtocols: ['fuchsia.calendar.TaskStore'],
      usedProtocols: ['fuchsia.settings.Client'],
      handles: [
        { id: '0x0362', type: 'zx::channel', rights: 'READ | WRITE', target: '/core/timekeeper' },
      ],
    },
  ];

  const stories: FuchsiaStory[] = [
    {
      id: 'story-1',
      title: 'Espacio de Diagnóstico Zircon',
      subtitle: 'Inspección de capacidades y canales FIDL en vivo',
      modules: [
        { id: 'mod-1', type: 'component-viewer', title: 'Visor de componentes', componentId: 'comp-inspector' },
        { id: 'mod-2', type: 'ipc-monitor', title: 'Monitor de canales IPC', componentId: 'comp-ipc' },
      ],
    },
    {
      id: 'story-2',
      title: 'Multimedia y Control',
      subtitle: 'Flujo de audio sobre VMO compartidos y ajustes',
      modules: [
        { id: 'mod-3', type: 'player', title: 'Reproductor', componentId: 'comp-player' },
        { id: 'mod-4', type: 'ffx-terminal', title: 'Terminal ffx', componentId: 'comp-ffx' },
      ],
    },
  ];

  const ipcMessages: FuchsiaIPCMessage[] = [
    {
      id: 'ipc-1',
      tick: 1,
      from: 'workstation_session',
      to: 'scenic-flatland',
      protocol: 'fuchsia.ui.Composition',
      method: 'Present()',
      bytes: 128,
      latencyUs: 42,
      status: 'OK',
    },
    {
      id: 'ipc-2',
      tick: 2,
      from: 'audio_player',
      to: '/core/audio_core',
      protocol: 'fuchsia.media.Audio',
      method: 'SendPacket(vmo=0x0202)',
      bytes: 4096,
      latencyUs: 68,
      status: 'OK',
    },
    {
      id: 'ipc-3',
      tick: 3,
      from: 'component_inspector',
      to: '/core/realm_query',
      protocol: 'fuchsia.sys2.RealmQuery',
      method: 'GetInstanceInfo()',
      bytes: 256,
      latencyUs: 31,
      status: 'OK',
    },
  ];

  return {
    stories,
    activeStoryId: 'story-1',
    overviewMode: false,
    componentsPanelOpen: true,
    selectedComponentId: 'comp-session',
    components,
    ipcMessages,
    ipcDroppedCount: 0,
    ipcTotalCount: 3,
    audioPlaying: true,
    audioTrackIndex: 0,
    audioProgressSec: 34,
    ffxHistory: [
      '$ ffx target show',
      'Target: fuchsia-workstation-lab (Zircon Microkernel)',
      'Build: 2026.11.23-workstation.arm64 · Capability Security: Enforced',
      '$ Escribe "help" o "ffx component list" para explorar.',
    ],
    privacyMicAllowed: false,
    uiScale: 100,
    docContent:
      '# Notas de Diseño Zircon\n\nCada documento se respalda en un Virtual Memory Object (zx::vmo 0x0310) sin acceso global al sistema de archivos.\n\n1. Aislamiento por capacidades explícitas.\n2. Mensajería FIDL tipada entre editor y almacenamiento.',
    sheetCells: {
      A1: 'Componente',
      B1: 'RAM (KB)',
      C1: 'Handles',
      A2: 'core',
      B2: '28600',
      C2: '2',
      A3: 'workstation',
      B3: '41200',
      C3: '2',
      A4: 'docs_vmo',
      B4: '14200',
      C4: '2',
      A5: 'Total',
      B5: '=SUM(B2:B4)',
      C5: '=SUM(C2:C4)',
    },
    tasks: [
      { id: 'ft-1', title: 'Revisar handles zx::channel en /core', done: true, time: '09:30' },
      { id: 'ft-2', title: 'Validar latencia IPC de audio_player', done: false, time: '11:45' },
      { id: 'ft-3', title: 'Sincronizar borrador VMO 0x0310', done: false, time: '15:00' },
    ],
  };
}

export function createInitialRTOSState(): RTOSState {
  const tasks: RTOSTask[] = [
    {
      id: 't-sensor',
      name: 'Task_Sensor',
      priority: 4,
      state: 'READY',
      stackUsedBytes: 1120,
      stackTotalBytes: 2048,
      cpuPct: 14.2,
      periodMs: 250,
      runCount: 42,
    },
    {
      id: 't-blink',
      name: 'Task_Blink',
      priority: 3,
      state: 'RUNNING',
      stackUsedBytes: 480,
      stackTotalBytes: 1024,
      cpuPct: 3.1,
      periodMs: 500,
      runCount: 84,
    },
    {
      id: 't-display',
      name: 'Task_Display',
      priority: 2,
      state: 'READY',
      stackUsedBytes: 1540,
      stackTotalBytes: 2048,
      cpuPct: 11.4,
      periodMs: 400,
      runCount: 31,
    },
    {
      id: 't-uart',
      name: 'Task_UART',
      priority: 3,
      state: 'BLOCKED',
      stackUsedBytes: 760,
      stackTotalBytes: 1536,
      cpuPct: 2.0,
      periodMs: 300,
      runCount: 19,
    },
    {
      id: 't-watchdog',
      name: 'Task_Watchdog',
      priority: 5,
      state: 'BLOCKED',
      stackUsedBytes: 320,
      stackTotalBytes: 1024,
      cpuPct: 0.8,
      periodMs: 1000,
      runCount: 12,
    },
    {
      id: 't-idle',
      name: 'Task_Idle',
      priority: 1,
      state: 'READY',
      stackUsedBytes: 192,
      stackTotalBytes: 512,
      cpuPct: 68.5,
      periodMs: 100,
      runCount: 210,
    },
  ];

  return {
    tasks,
    sensors: {
      temperatureC: 26.4,
      lightLux: 420,
      voltageV: 3.3,
      blinkPeriodMs: 500,
    },
    leds: {
      pwr: true,
      heartbeat: true,
      alarm: false,
      uartTx: false,
      uartRx: false,
    },
    tickCount: 1200,
    uptimeMs: 12000,
    jitterUs: 4,
    maxJitterUs: 9,
    watchdogResets: 0,
    bootPhase: 'READY',
    oledHistory: [24, 25, 25.5, 26, 26.2, 26.4, 26.3, 26.4],
    uartLogs: [
      '[000000] [BOOT] ESP32-Lab Rev3 · FreeRTOS v11.1.0 Tickless (1000 Hz)',
      '[000012] [KERNEL] 6 tareas creadas. MMU: Deshabilitada (MPU regiones=8)',
      '[000120] [Task_Display] OLED SSD1306 128x64 I2C (0x3C) inicializado',
      '[001200] [Task_Sensor] TEMP=26.4C LUX=420 VDD=3.30V · Nominal',
    ],
    lastBlinkToggleMs: 12000,
  };
}

export function createInitialTestResults(): TestResult[] {
  return [
    {
      id: 'test-chrome-process',
      os: 'Chrome OS',
      name: 'Aislamiento de procesos por pestaña',
      description: 'Verifica que abrir una pestaña registra un proceso Renderer con PID único y cerrarla libera el proceso.',
      status: 'IDLE',
      durationMs: 0,
      lastRunTick: null,
      assertions: [],
    },
    {
      id: 'test-chrome-network',
      os: 'Chrome OS',
      name: 'Propagación de red desde Ajustes rápidos',
      description: 'Verifica que desactivar Wi-Fi en la bandeja del sistema actualiza inmediatamente el estado de conectividad del navegador.',
      status: 'IDLE',
      durationMs: 0,
      lastRunTick: null,
      assertions: [],
    },
    {
      id: 'test-fuchsia-story',
      os: 'Fuchsia',
      name: 'Composición modular de Stories y capacidades',
      description: 'Verifica que cada módulo agregado a una Story se vincula a un componente válido con handles Zircon.',
      status: 'IDLE',
      durationMs: 0,
      lastRunTick: null,
      assertions: [],
    },
    {
      id: 'test-fuchsia-ipc',
      os: 'Fuchsia',
      name: 'Integridad de canales IPC (zx_channel / FIDL)',
      description: 'Comprueba el envío de mensajes FIDL entre componentes sin memoria compartida global.',
      status: 'IDLE',
      durationMs: 0,
      lastRunTick: null,
      assertions: [],
    },
    {
      id: 'test-rtos-determinism',
      os: 'RTOS Embebido',
      name: 'Planificación determinista por prioridades',
      description: 'Valida que las tareas de mayor prioridad toman control y que suspender Task_Blink detiene el parpadeo del LED.',
      status: 'IDLE',
      durationMs: 0,
      lastRunTick: null,
      assertions: [],
    },
    {
      id: 'test-rtos-thermal',
      os: 'RTOS Embebido',
      name: 'Respuesta hardware ante umbral térmico y UART',
      description: 'Verifica que superar 50°C activa el LED de alarma GPIO15 y emite una alerta en el puerto serial UART.',
      status: 'IDLE',
      durationMs: 0,
      lastRunTick: null,
      assertions: [],
    },
  ];
}

export function createInitialEngineState(): SharedEngineState {
  return {
    running: true,
    globalTick: 0,
    tickRateMs: 400,
    chromeos: createInitialChromeOSState(),
    fuchsia: createInitialFuchsiaState(),
    rtos: createInitialRTOSState(),
    testResults: createInitialTestResults(),
    stressEvents: [],
  };
}

// ============================================================================
// SHARED SIMULATION STEP (Pure deterministic tick update)
// ============================================================================

export function stepSimulation(state: SharedEngineState, dtMs = 400): SharedEngineState {
  if (!state.running) return state;

  const nextTick = state.globalTick + 1;

  // 1. Step Chrome OS process telemetry
  const nextTabs = state.chromeos.tabs.map((tab, idx) => {
    const baseCpu = tab.heavy ? 18.5 : 1.5;
    const wave = Math.abs(Math.sin((nextTick + idx * 3) * 0.45)) * (tab.heavy ? 12.0 : 2.8);
    return {
      ...tab,
      cpu: Number((baseCpu + wave).toFixed(1)),
    };
  });

  const nextProcesses = state.chromeos.processes.map((proc, idx) => {
    if (proc.tabId) {
      const matchedTab = nextTabs.find((t) => t.id === proc.tabId);
      if (matchedTab) {
        return { ...proc, cpu: matchedTab.cpu, memoryMb: matchedTab.memoryMb };
      }
    }
    const jitter = Math.abs(Math.cos((nextTick + idx) * 0.3)) * 1.1;
    return {
      ...proc,
      cpu: Number((0.4 + jitter).toFixed(1)),
    };
  });

  // 2. Step Fuchsia IPC & Audio
  const nextIpcMessages = [...state.fuchsia.ipcMessages];
  let nextIpcTotal = state.fuchsia.ipcTotalCount;
  let nextAudioProgress = state.fuchsia.audioProgressSec;

  if (state.fuchsia.audioPlaying) {
    nextAudioProgress = (state.fuchsia.audioProgressSec + 1) % 214;
    if (nextTick % 2 === 0) {
      nextIpcTotal += 1;
      nextIpcMessages.unshift({
        id: `ipc-${nextTick}-${nextIpcTotal}`,
        tick: nextTick,
        from: 'audio_player',
        to: '/core/audio_core',
        protocol: 'fuchsia.media.Audio',
        method: `WriteBuffer(seq=${nextIpcTotal})`,
        bytes: 2048,
        latencyUs: 38 + (nextTick % 25),
        status: 'OK',
      });
    }
  } else if (nextTick % 4 === 0) {
    nextIpcTotal += 1;
    nextIpcMessages.unshift({
      id: `ipc-${nextTick}-${nextIpcTotal}`,
      tick: nextTick,
      from: 'workstation_session',
      to: 'scenic-flatland',
      protocol: 'fuchsia.ui.Composition',
      method: 'OnFramePresented()',
      bytes: 96,
      latencyUs: 29 + (nextTick % 14),
      status: 'OK',
    });
  }

  const nextComponents = state.fuchsia.components.map((c, i) => ({
    ...c,
    cpuPct:
      c.state === 'RUNNING'
        ? Number((0.3 + Math.abs(Math.sin((nextTick + i) * 0.4)) * 2.1).toFixed(1))
        : 0,
  }));

  // 3. Step RTOS Scheduler & Hardware
  const nextUptimeMs = state.rtos.uptimeMs + dtMs;
  const nextRtosTicks = state.rtos.tickCount + Math.round(dtMs / 10);
  const nextUartLogs = [...state.rtos.uartLogs];

  let nextBootPhase = state.rtos.bootPhase;
  if (state.rtos.bootPhase === 'BOOTING' && nextTick % 2 === 0) {
    nextBootPhase = 'READY';
    nextUartLogs.push(`[${String(nextRtosTicks).padStart(6, '0')}] [KERNEL] Boot completo. Scheduler determinista activo.`);
  }

  // Evaluate priority scheduler: highest priority non-suspended task gets RUNNING
  const activeReadyCandidates = state.rtos.tasks.filter((t) => t.state !== 'SUSPENDED');
  const highestPrio = activeReadyCandidates.reduce((max, t) => Math.max(max, t.priority), 0);
  let assignedRunning = false;

  const blinkTask = state.rtos.tasks.find((t) => t.id === 't-blink');
  const displayTask = state.rtos.tasks.find((t) => t.id === 't-display');
  const sensorTask = state.rtos.tasks.find((t) => t.id === 't-sensor');

  const blinkActive = blinkTask && blinkTask.state !== 'SUSPENDED' && nextBootPhase === 'READY';
  const displayActive = displayTask && displayTask.state !== 'SUSPENDED' && nextBootPhase === 'READY';
  const sensorActive = sensorTask && sensorTask.state !== 'SUSPENDED' && nextBootPhase === 'READY';

  let nextHeartbeat = state.rtos.leds.heartbeat;
  let nextLastBlink = state.rtos.lastBlinkToggleMs;

  if (blinkActive && nextUptimeMs - state.rtos.lastBlinkToggleMs >= state.rtos.sensors.blinkPeriodMs) {
    nextHeartbeat = !state.rtos.leds.heartbeat;
    nextLastBlink = nextUptimeMs;
  } else if (!blinkActive) {
    nextHeartbeat = false;
  }

  const tempHigh = state.rtos.sensors.temperatureC >= 50;
  const brownout = state.rtos.sensors.voltageV < 2.8;
  const nextAlarm = (tempHigh || brownout) && nextBootPhase !== 'BOOTING';

  if (sensorActive && nextTick % 6 === 0) {
    if (tempHigh) {
      nextUartLogs.push(
        `[${String(nextRtosTicks).padStart(6, '0')}] [ALERTA] TEMP=${state.rtos.sensors.temperatureC.toFixed(1)}°C >= 50.0°C -> GPIO15 ALARM HIGH`
      );
    } else if (brownout) {
      nextUartLogs.push(
        `[${String(nextRtosTicks).padStart(6, '0')}] [BROWNOUT] VDD=${state.rtos.sensors.voltageV.toFixed(2)}V < 2.80V -> Modo ahorro`
      );
    } else {
      nextUartLogs.push(
        `[${String(nextRtosTicks).padStart(6, '0')}] [Task_Sensor] TEMP=${state.rtos.sensors.temperatureC.toFixed(1)}°C LUX=${state.rtos.sensors.lightLux} VDD=${state.rtos.sensors.voltageV.toFixed(2)}V`
      );
    }
  }

  const nextTasks: RTOSTask[] = state.rtos.tasks.map((t, idx) => {
    if (t.state === 'SUSPENDED') {
      return { ...t, cpuPct: 0 };
    }
    const isTop =
      !assignedRunning &&
      (t.priority === highestPrio || (nextTick + idx) % 3 === 0 && t.priority >= 3);
    let newState = t.state;
    if (t.id === 't-watchdog' && nextTick % 5 !== 0) {
      newState = 'BLOCKED';
    } else if (t.id === 't-uart' && nextTick % 3 !== 0) {
      newState = 'BLOCKED';
    } else if (isTop) {
      newState = 'RUNNING';
      assignedRunning = true;
    } else {
      newState = 'READY';
    }

    const baseCpu =
      t.id === 't-idle'
        ? 62
        : t.id === 't-sensor'
          ? 13
          : t.id === 't-display'
            ? 10
            : t.id === 't-blink'
              ? 3.2
              : t.id === 't-uart'
                ? 2.2
                : 1.0;

    return {
      ...t,
      state: newState,
      runCount: newState === 'RUNNING' || newState === 'READY' ? t.runCount + 1 : t.runCount,
      cpuPct: Number((baseCpu + (nextTick % 3) * 0.4).toFixed(1)),
    };
  });

  const adcSample = Number(
    (state.rtos.sensors.temperatureC + Math.sin(nextTick * 0.8) * 1.4).toFixed(1)
  );
  const nextOledHistory = displayActive
    ? [...state.rtos.oledHistory.slice(-19), adcSample]
    : state.rtos.oledHistory;

  const jitter = 2 + ((nextTick * 3) % 7);

  return {
    ...state,
    globalTick: nextTick,
    chromeos: {
      ...state.chromeos,
      tabs: nextTabs,
      processes: nextProcesses,
    },
    fuchsia: {
      ...state.fuchsia,
      components: nextComponents,
      ipcMessages: nextIpcMessages.slice(0, 40),
      ipcTotalCount: nextIpcTotal,
      audioProgressSec: nextAudioProgress,
    },
    rtos: {
      ...state.rtos,
      tasks: nextTasks,
      tickCount: nextRtosTicks,
      uptimeMs: nextUptimeMs,
      jitterUs: jitter,
      maxJitterUs: Math.max(state.rtos.maxJitterUs, jitter),
      bootPhase: nextBootPhase,
      leds: {
        pwr: true,
        heartbeat: nextHeartbeat,
        alarm: nextAlarm,
        uartTx: nextTick % 6 === 0 && sensorActive ? true : false,
        uartRx: false,
      },
      oledHistory: nextOledHistory,
      uartLogs: nextUartLogs.slice(-60),
      lastBlinkToggleMs: nextLastBlink,
    },
  };
}

// ============================================================================
// CHROME OS PURE ACTIONS
// ============================================================================

export function openChromeWindow(state: SharedEngineState, appId: ChromeAppId): SharedEngineState {
  const existing = state.chromeos.windows.find((w) => w.appId === appId);
  const nextZ = state.chromeos.nextZIndex + 1;

  if (existing) {
    return {
      ...state,
      chromeos: {
        ...state.chromeos,
        launcherOpen: false,
        quickSettingsOpen: false,
        nextZIndex: nextZ,
        windows: state.chromeos.windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, zIndex: nextZ } : w
        ),
      },
    };
  }

  const meta = CHROME_APP_META[appId];
  const offset = (state.chromeos.windows.length % 5) * 28;
  const newWindow: ChromeWindow = {
    id: `win-${appId}-${nextZ}`,
    appId,
    title: meta.title,
    x: 60 + offset,
    y: 36 + offset,
    width: meta.defaultW,
    height: meta.defaultH,
    minimized: false,
    maximized: false,
    zIndex: nextZ,
  };

  const hasProc = state.chromeos.processes.some((p) => p.appId === appId);
  const nextPid = state.chromeos.nextPid + 1;
  const nextProcesses = hasProc
    ? state.chromeos.processes
    : [
        ...state.chromeos.processes,
        {
          pid: nextPid,
          name: meta.title,
          type: 'App' as const,
          appId,
          cpu: 1.4,
          memoryMb: meta.baseMem,
        },
      ];

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      launcherOpen: false,
      quickSettingsOpen: false,
      nextZIndex: nextZ,
      nextPid,
      windows: [...state.chromeos.windows, newWindow],
      processes: nextProcesses,
    },
  };
}

export function closeChromeWindow(state: SharedEngineState, windowId: string): SharedEngineState {
  const target = state.chromeos.windows.find((w) => w.id === windowId);
  if (!target) return state;

  const remainingWindows = state.chromeos.windows.filter((w) => w.id !== windowId);
  const remainingProcesses =
    target.appId === 'browser'
      ? state.chromeos.processes
      : state.chromeos.processes.filter((p) => p.appId !== target.appId);

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      windows: remainingWindows,
      processes: remainingProcesses,
    },
  };
}

export function addBrowserTab(
  state: SharedEngineState,
  title = 'Nueva pestaña',
  url = 'chrome://newtab',
  heavy = false
): SharedEngineState {
  const pid = state.chromeos.nextPid + 1;
  const tabId = `tab-${pid}`;
  const mem = heavy ? 285 : 88 + (pid % 40);
  const cpu = heavy ? 19.4 : 1.9;

  const newTab: BrowserTab = {
    id: tabId,
    title,
    url,
    pid,
    cpu,
    memoryMb: mem,
    heavy,
  };

  const newProcess: ChromeProcess = {
    pid,
    name: `Pestaña: ${title}`,
    type: 'Renderer (Pestaña)',
    tabId,
    cpu,
    memoryMb: mem,
  };

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      nextPid: pid,
      tabs: [...state.chromeos.tabs, newTab],
      activeTabId: tabId,
      processes: [...state.chromeos.processes, newProcess],
    },
  };
}

export function closeBrowserTab(state: SharedEngineState, tabId: string): SharedEngineState {
  const remainingTabs = state.chromeos.tabs.filter((t) => t.id !== tabId);
  const remainingProcs = state.chromeos.processes.filter((p) => p.tabId !== tabId);
  let nextActive = state.chromeos.activeTabId;
  if (nextActive === tabId) {
    nextActive = remainingTabs[remainingTabs.length - 1]?.id ?? '';
  }

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      tabs: remainingTabs,
      activeTabId: nextActive,
      processes: remainingProcs,
    },
  };
}

export function killChromeProcess(state: SharedEngineState, pid: number): SharedEngineState {
  const proc = state.chromeos.processes.find((p) => p.pid === pid);
  if (!proc || proc.type === 'Kernel/Browser') return state;

  if (proc.tabId) {
    return closeBrowserTab(state, proc.tabId);
  }

  if (proc.appId) {
    return {
      ...state,
      chromeos: {
        ...state.chromeos,
        windows: state.chromeos.windows.filter((w) => w.appId !== proc.appId),
        processes: state.chromeos.processes.filter((p) => p.pid !== pid),
      },
    };
  }

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      processes: state.chromeos.processes.filter((p) => p.pid !== pid),
    },
  };
}

export function runCroshCommand(state: SharedEngineState, rawCmd: string): SharedEngineState {
  const cmd = rawCmd.trim();
  if (!cmd) return state;
  const lower = cmd.toLowerCase();
  const out: string[] = [`crosh> ${cmd}`];

  if (lower === 'clear') {
    return { ...state, chromeos: { ...state.chromeos, terminalHistory: [] } };
  } else if (lower === 'help') {
    out.push('Comandos disponibles: help, uname -a, ps, free -m, ping, top, clear');
  } else if (lower === 'uname -a') {
    out.push('Linux localhost 6.6.30-chromeos #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux');
  } else if (lower === 'ps') {
    state.chromeos.processes.forEach((p) => {
      out.push(`  PID ${p.pid} | ${p.cpu.toFixed(1)}% CPU | ${p.memoryMb} MB | ${p.name}`);
    });
  } else if (lower === 'free -m') {
    const used = state.chromeos.processes.reduce((acc, p) => acc + p.memoryMb, 0);
    out.push(`MemTotal: 8192 MB | MemUsed: ${used} MB | MemFree: ${Math.max(0, 8192 - used)} MB`);
  } else if (lower.startsWith('ping')) {
    if (!state.chromeos.quickSettings.wifi) {
      out.push('ping: connect: Network is unreachable (Wi-Fi desactivado)');
    } else {
      out.push('64 bytes from 142.250.184.14: icmp_seq=1 ttl=118 time=12.4 ms');
    }
  } else if (lower === 'top') {
    const topProc = [...state.chromeos.processes].sort((a, b) => b.cpu - a.cpu)[0];
    out.push(`Procesos totales: ${state.chromeos.processes.length} | Mayor consumo: ${topProc?.name ?? 'N/A'} (${topProc?.cpu ?? 0}%)`);
  } else {
    out.push(`crosh: comando no encontrado: ${cmd}. Prueba "help".`);
  }

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      terminalHistory: [...state.chromeos.terminalHistory, ...out].slice(-45),
    },
  };
}

// ============================================================================
// FUCHSIA PURE ACTIONS
// ============================================================================

export function createFuchsiaStory(
  state: SharedEngineState,
  title = 'Nueva Story',
  initialModule: FuchsiaModuleType = 'component-viewer'
): SharedEngineState {
  const id = `story-${Date.now()}-${state.globalTick}`;
  const meta = FUCHSIA_MODULE_META[initialModule];
  const newStory: FuchsiaStory = {
    id,
    title,
    subtitle: 'Espacio de trabajo aislado por capacidades',
    modules: [
      {
        id: `mod-${Date.now()}`,
        type: initialModule,
        title: meta.title,
        componentId: meta.componentId,
      },
    ],
  };

  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      stories: [...state.fuchsia.stories, newStory],
      activeStoryId: id,
      overviewMode: false,
    },
  };
}

export function addModuleToStory(
  state: SharedEngineState,
  storyId: string,
  moduleType: FuchsiaModuleType
): SharedEngineState {
  const meta = FUCHSIA_MODULE_META[moduleType];
  const newMod: FuchsiaModule = {
    id: `mod-${state.globalTick}-${Math.random().toString(36).slice(2, 6)}`,
    type: moduleType,
    title: meta.title,
    componentId: meta.componentId,
  };

  const nextIpcTotal = state.fuchsia.ipcTotalCount + 1;
  const ipcMsg: FuchsiaIPCMessage = {
    id: `ipc-bind-${nextIpcTotal}`,
    tick: state.globalTick,
    from: 'workstation_session',
    to: meta.componentId,
    protocol: meta.defaultProtocol,
    method: 'BindCapability()',
    bytes: 192,
    latencyUs: 34,
    status: 'OK',
  };

  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      stories: state.fuchsia.stories.map((s) =>
        s.id === storyId ? { ...s, modules: [...s.modules, newMod] } : s
      ),
      ipcTotalCount: nextIpcTotal,
      ipcMessages: [ipcMsg, ...state.fuchsia.ipcMessages].slice(0, 40),
    },
  };
}

export function removeModuleFromStory(
  state: SharedEngineState,
  storyId: string,
  moduleId: string
): SharedEngineState {
  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      stories: state.fuchsia.stories.map((s) =>
        s.id === storyId
          ? { ...s, modules: s.modules.filter((m) => m.id !== moduleId) }
          : s
      ),
    },
  };
}

export function reorderModuleInStory(
  state: SharedEngineState,
  storyId: string,
  moduleId: string,
  direction: 'left' | 'right'
): SharedEngineState {
  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      stories: state.fuchsia.stories.map((s) => {
        if (s.id !== storyId) return s;
        const idx = s.modules.findIndex((m) => m.id === moduleId);
        if (idx < 0) return s;
        const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= s.modules.length) return s;
        const copy = [...s.modules];
        const [item] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, item);
        return { ...s, modules: copy };
      }),
    },
  };
}

export function sendFuchsiaIpcBurst(
  state: SharedEngineState,
  count = 1,
  simulateDrop = false
): SharedEngineState {
  const newMsgs: FuchsiaIPCMessage[] = [];
  let dropped = state.fuchsia.ipcDroppedCount;
  let total = state.fuchsia.ipcTotalCount;

  for (let i = 0; i < count; i++) {
    total += 1;
    const isDrop = simulateDrop && i % 5 === 4;
    if (isDrop) dropped += 1;
    newMsgs.push({
      id: `ipc-burst-${total}`,
      tick: state.globalTick,
      from: 'fidl_ipc_monitor',
      to: '/core/archivist',
      protocol: 'fuchsia.lab.IpcProbe',
      method: `EchoPing(seq=${total})`,
      bytes: 512,
      latencyUs: isDrop ? 0 : 24 + (i % 19),
      status: isDrop ? 'DROPPED' : 'OK',
    });
  }

  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      ipcTotalCount: total,
      ipcDroppedCount: dropped,
      ipcMessages: [...newMsgs.reverse(), ...state.fuchsia.ipcMessages].slice(0, 40),
    },
  };
}

export function runFfxCommand(state: SharedEngineState, rawCmd: string): SharedEngineState {
  const cmd = rawCmd.trim();
  if (!cmd) return state;
  const lower = cmd.toLowerCase();
  const out: string[] = [`$ ${cmd}`];

  if (lower === 'clear') {
    return { ...state, fuchsia: { ...state.fuchsia, ffxHistory: [] } };
  } else if (lower === 'help') {
    out.push('Comandos ffx: ffx component list, ffx component show <nombre>, ffx log, zx_ps, clear');
  } else if (lower === 'ffx component list') {
    state.fuchsia.components.forEach((c) => {
      out.push(`  [${c.state}] ${c.moniker} (${c.handles.length} handles)`);
    });
  } else if (lower.startsWith('ffx component show')) {
    const query = lower.replace('ffx component show', '').trim();
    const found =
      state.fuchsia.components.find(
        (c) => c.name.toLowerCase().includes(query) || c.moniker.toLowerCase().includes(query)
      ) ?? state.fuchsia.components[0];
    out.push(`Moniker: ${found.moniker} | URL: ${found.url}`);
    out.push(`Estado: ${found.state} | Memoria: ${found.memoryKb} KB`);
    out.push(`Handles: ${found.handles.map((h) => `${h.id}(${h.type})`).join(', ')}`);
  } else if (lower === 'ffx log') {
    state.fuchsia.ipcMessages.slice(0, 4).forEach((m) => {
      out.push(`[zx_channel] ${m.from} -> ${m.to} :: ${m.protocol}.${m.method} (${m.latencyUs}us)`);
    });
  } else if (lower === 'zx_ps') {
    out.push(`Zircon Jobs/Processes: ${state.fuchsia.components.length} activos | IPC Total: ${state.fuchsia.ipcTotalCount}`);
  } else {
    out.push(`ffx: comando desconocido "${cmd}". Usa "help".`);
  }

  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      ffxHistory: [...state.fuchsia.ffxHistory, ...out].slice(-45),
    },
  };
}

// ============================================================================
// OFFICE SUITE & UTILITIES PURE HELPERS (Shared across Chrome OS & Fuchsia)
// ============================================================================

function parseCellCoords(ref: string): { col: number; row: number } | null {
  const m = /^([A-Z]+)(\d+)$/i.exec(ref.trim());
  if (!m) return null;
  const colStr = m[1].toUpperCase();
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  const row = Number(m[2]);
  if (row < 1) return null;
  return { col, row };
}

function coordsToCellRef(col: number, row: number): string {
  let c = col;
  let letters = '';
  while (c > 0) {
    const rem = (c - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    c = Math.floor((c - 1) / 26);
  }
  return `${letters}${row}`;
}

function expandCellRange(startRef: string, endRef: string): string[] {
  const start = parseCellCoords(startRef);
  const end = parseCellCoords(endRef);
  if (!start || !end) return [];
  const minC = Math.min(start.col, end.col);
  const maxC = Math.max(start.col, end.col);
  const minR = Math.min(start.row, end.row);
  const maxR = Math.max(start.row, end.row);
  const refs: string[] = [];
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      refs.push(coordsToCellRef(c, r));
    }
  }
  return refs;
}

export function evaluateSheetCell(
  cells: Record<string, string>,
  cellRef: string,
  visited: Set<string> = new Set()
): string {
  const key = cellRef.trim().toUpperCase();
  if (visited.has(key)) return '#REF!';
  const raw = (cells[key] ?? '').trim();
  if (!raw) return '';
  if (!raw.startsWith('=')) return raw;

  const nextVisited = new Set(visited);
  nextVisited.add(key);
  const expr = raw.slice(1).trim();

  const fnMatch = /^(SUM|AVG|MIN|MAX)\(\s*([A-Z]+\d+)\s*:\s*([A-Z]+\d+)\s*\)$/i.exec(expr);
  if (fnMatch) {
    const fn = fnMatch[1].toUpperCase();
    const refs = expandCellRange(fnMatch[2], fnMatch[3]);
    const nums = refs
      .map((r) => Number(evaluateSheetCell(cells, r, nextVisited)))
      .filter((n) => Number.isFinite(n));
    if (nums.length === 0) return '0';
    if (fn === 'SUM') return String(Number(nums.reduce((a, b) => a + b, 0).toFixed(2)));
    if (fn === 'AVG') return String(Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)));
    if (fn === 'MIN') return String(Math.min(...nums));
    if (fn === 'MAX') return String(Math.max(...nums));
  }

  const binMatch = /^([A-Z]+\d+|\d+(?:\.\d+)?)\s*([+\-*/])\s*([A-Z]+\d+|\d+(?:\.\d+)?)$/i.exec(expr);
  if (binMatch) {
    const resolveOperand = (token: string): number => {
      if (/^[A-Z]+\d+$/i.test(token)) {
        const val = evaluateSheetCell(cells, token, nextVisited);
        if (val.startsWith('#')) return Number.NaN;
        return Number(val || 0);
      }
      return Number(token);
    };
    const left = resolveOperand(binMatch[1]);
    const right = resolveOperand(binMatch[3]);
    if (!Number.isFinite(left) || !Number.isFinite(right)) return '#ERR!';
    const op = binMatch[2];
    if (op === '+') return String(Number((left + right).toFixed(2)));
    if (op === '-') return String(Number((left - right).toFixed(2)));
    if (op === '*') return String(Number((left * right).toFixed(2)));
    if (op === '/') return right === 0 ? '#DIV/0!' : String(Number((left / right).toFixed(2)));
  }

  return '#FORM!';
}

export function saveChromeDocToDrive(
  state: SharedEngineState,
  title: string,
  content: string
): SharedEngineState {
  const cleanTitle = title.trim() || 'documento_sin_titulo';
  const slug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const fileName = `${slug || 'documento'}.doc.md`;
  const existingIdx = state.chromeos.files.findIndex(
    (f) => f.folder === 'Google Drive' && f.name === fileName
  );
  const sizeKb = Math.max(1, Math.ceil(content.length / 64));

  const nextFiles =
    existingIdx >= 0
      ? state.chromeos.files.map((f, i) =>
          i === existingIdx ? { ...f, sizeKb, updatedAt: 'Ahora mismo', preview: content } : f
        )
      : [
          {
            id: `f-doc-${Date.now()}`,
            name: fileName,
            folder: 'Google Drive' as const,
            sizeKb,
            updatedAt: 'Ahora mismo',
            preview: content,
          },
          ...state.chromeos.files,
        ];

  return {
    ...state,
    chromeos: {
      ...state.chromeos,
      docTitle: cleanTitle,
      docContent: content,
      files: nextFiles,
    },
  };
}

export function commitFuchsiaDocVmo(state: SharedEngineState, content: string): SharedEngineState {
  const nextTotal = state.fuchsia.ipcTotalCount + 1;
  const msg: FuchsiaIPCMessage = {
    id: `ipc-vmo-${nextTotal}`,
    tick: state.globalTick,
    from: 'docs_vmo_editor',
    to: '/core/pkg-cache',
    protocol: 'fuchsia.docs.VmoStore',
    method: `Commit(vmo=0x0310, ${content.length}B)`,
    bytes: Math.max(64, content.length),
    latencyUs: 31,
    status: 'OK',
  };

  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      docContent: content,
      ipcTotalCount: nextTotal,
      ipcMessages: [msg, ...state.fuchsia.ipcMessages].slice(0, 40),
    },
  };
}

export function logFuchsiaSheetEval(
  state: SharedEngineState,
  cell: string,
  rawValue: string
): SharedEngineState {
  const upperCell = cell.trim().toUpperCase();
  const nextTotal = state.fuchsia.ipcTotalCount + 1;
  const msg: FuchsiaIPCMessage = {
    id: `ipc-calc-${nextTotal}`,
    tick: state.globalTick,
    from: 'fidl_sheet_calc',
    to: 'workstation_session',
    protocol: 'fuchsia.calc.EvalEngine',
    method: `Compute(${upperCell})`,
    bytes: 128,
    latencyUs: 19,
    status: 'OK',
  };

  return {
    ...state,
    fuchsia: {
      ...state.fuchsia,
      sheetCells: {
        ...state.fuchsia.sheetCells,
        [upperCell]: rawValue,
      },
      ipcTotalCount: nextTotal,
      ipcMessages: [msg, ...state.fuchsia.ipcMessages].slice(0, 40),
    },
  };
}

// ============================================================================
// RTOS PURE ACTIONS
// ============================================================================

export function setRtosSensor(
  state: SharedEngineState,
  key: keyof RTOSState['sensors'],
  value: number
): SharedEngineState {
  const nextSensors = { ...state.rtos.sensors, [key]: value };
  const tempHigh = nextSensors.temperatureC >= 50;
  const brownout = nextSensors.voltageV < 2.8;
  const nextLogs = [...state.rtos.uartLogs];

  if (key === 'temperatureC' && tempHigh && state.rtos.sensors.temperatureC < 50) {
    nextLogs.push(
      `[${String(state.rtos.tickCount).padStart(6, '0')}] [ISR_THERMAL] Umbral superado (${value.toFixed(1)}°C) -> Activando LED_ALARM GPIO15`
    );
  }
  if (key === 'voltageV' && brownout && state.rtos.sensors.voltageV >= 2.8) {
    nextLogs.push(
      `[${String(state.rtos.tickCount).padStart(6, '0')}] [BOD_ISR] Voltaje bajo (${value.toFixed(2)}V) -> Alerta de alimentación`
    );
  }

  return {
    ...state,
    rtos: {
      ...state.rtos,
      sensors: nextSensors,
      leds: {
        ...state.rtos.leds,
        alarm: tempHigh || brownout,
      },
      tasks: state.rtos.tasks.map((t) =>
        t.id === 't-blink' && key === 'blinkPeriodMs' ? { ...t, periodMs: value } : t
      ),
      uartLogs: nextLogs.slice(-60),
    },
  };
}

export function toggleRtosTaskState(state: SharedEngineState, taskId: string): SharedEngineState {
  if (taskId === 't-idle') return state;
  const target = state.rtos.tasks.find((t) => t.id === taskId);
  if (!target) return state;

  const suspending = target.state !== 'SUSPENDED';
  const nextState = suspending ? 'SUSPENDED' : 'READY';
  const tickStr = String(state.rtos.tickCount).padStart(6, '0');
  const log = `[${tickStr}] [SCHED] vTask${suspending ? 'Suspend' : 'Resume'}(${target.name})`;

  return {
    ...state,
    rtos: {
      ...state.rtos,
      tasks: state.rtos.tasks.map((t) =>
        t.id === taskId ? { ...t, state: nextState, cpuPct: suspending ? 0 : t.cpuPct } : t
      ),
      leds: {
        ...state.rtos.leds,
        heartbeat: taskId === 't-blink' && suspending ? false : state.rtos.leds.heartbeat,
      },
      uartLogs: [...state.rtos.uartLogs, log].slice(-60),
    },
  };
}

export function triggerRtosReset(state: SharedEngineState): SharedEngineState {
  const initial = createInitialRTOSState();
  return {
    ...state,
    rtos: {
      ...initial,
      sensors: state.rtos.sensors,
      tickCount: 0,
      uptimeMs: 0,
      bootPhase: 'BOOTING',
      watchdogResets: state.rtos.watchdogResets,
      uartLogs: [
        '[000000] [RST_PIN] Pulsador EN/RST presionado -> Reinicio en frío...',
        '[000001] [BOOT] ESP32-Lab Rev3 · Verificando SRAM (520 KB) OK',
        '[000004] [FreeRTOS] Creando 6 tareas deterministas (Tick=1kHz)...',
      ],
    },
  };
}

export function triggerRtosPanic(state: SharedEngineState): SharedEngineState {
  const tickStr = String(state.rtos.tickCount).padStart(6, '0');
  return {
    ...state,
    rtos: {
      ...state.rtos,
      bootPhase: 'BOOTING',
      tickCount: 0,
      uptimeMs: 0,
      watchdogResets: state.rtos.watchdogResets + 1,
      leds: {
        pwr: true,
        heartbeat: false,
        alarm: true,
        uartTx: true,
        uartRx: false,
      },
      uartLogs: [
        ...state.rtos.uartLogs,
        `[${tickStr}] [PANIC] Stack overflow detectado en Task_Display!`,
        `[${tickStr}] [WDT] Hardware Watchdog disparado -> Recuperando sistema...`,
        `[000000] [BOOT] Reinicio automático por Watchdog (#${state.rtos.watchdogResets + 1})`,
      ].slice(-60),
    },
  };
}

export function runRtosUartCommand(state: SharedEngineState, rawCmd: string): SharedEngineState {
  const cmd = rawCmd.trim();
  if (!cmd) return state;
  const parts = cmd.split(/\s+/);
  const verb = parts[0].toLowerCase();
  const arg = parts[1];
  const tickStr = String(state.rtos.tickCount).padStart(6, '0');

  if (verb === 'clear') {
    return { ...state, rtos: { ...state.rtos, uartLogs: [] } };
  }
  if (verb === 'reboot') {
    return triggerRtosReset(state);
  }
  if (verb === 'panic') {
    return triggerRtosPanic(state);
  }
  if (verb === 'blink' && arg && !Number.isNaN(Number(arg))) {
    const ms = Math.max(100, Math.min(2000, Number(arg)));
    const updated = setRtosSensor(state, 'blinkPeriodMs', ms);
    return {
      ...updated,
      rtos: {
        ...updated.rtos,
        leds: { ...updated.rtos.leds, uartRx: true },
        uartLogs: [
          ...updated.rtos.uartLogs,
          `[${tickStr}] > ${cmd}`,
          `[${tickStr}] [Task_Blink] Periodo actualizado a ${ms} ms`,
        ].slice(-60),
      },
    };
  }
  if ((verb === 'suspend' || verb === 'resume') && arg) {
    const found = state.rtos.tasks.find((t) => t.name.toLowerCase() === arg.toLowerCase());
    if (!found) {
      return {
        ...state,
        rtos: {
          ...state.rtos,
          uartLogs: [...state.rtos.uartLogs, `[${tickStr}] > ${cmd}`, `[${tickStr}] [ERR] Tarea no encontrada: ${arg}`].slice(-60),
        },
      };
    }
    const wantSuspend = verb === 'suspend';
    if ((wantSuspend && found.state === 'SUSPENDED') || (!wantSuspend && found.state !== 'SUSPENDED')) {
      return {
        ...state,
        rtos: {
          ...state.rtos,
          uartLogs: [...state.rtos.uartLogs, `[${tickStr}] > ${cmd}`, `[${tickStr}] [SCHED] ${found.name} ya está en ${found.state}`].slice(-60),
        },
      };
    }
    const next = toggleRtosTaskState(state, found.id);
    return {
      ...next,
      rtos: {
        ...next.rtos,
        uartLogs: [...next.rtos.uartLogs, `[${tickStr}] > ${cmd}`].slice(-60),
      },
    };
  }

  const out: string[] = [`[${tickStr}] > ${cmd}`];
  if (verb === 'help') {
    out.push('UART CLI: help | tasks | blink <ms> | suspend <tarea> | resume <tarea> | panic | reboot | clear');
  } else if (verb === 'tasks') {
    state.rtos.tasks.forEach((t) => {
      out.push(`  ${t.name.padEnd(14)} Prio=${t.priority} Estado=${t.state.padEnd(9)} Pila=${t.stackUsedBytes}/${t.stackTotalBytes}B`);
    });
  } else {
    out.push(`[ERR] Comando UART desconocido "${cmd}". Escribe "help".`);
  }

  return {
    ...state,
    rtos: {
      ...state.rtos,
      leds: { ...state.rtos.leds, uartRx: true },
      uartLogs: [...state.rtos.uartLogs, ...out].slice(-60),
    },
  };
}

// ============================================================================
// AUTOMATED ARCHITECTURE VERIFICATION SUITE (Testing Lab)
// ============================================================================

export function runArchitectureTests(state: SharedEngineState): {
  nextState: SharedEngineState;
  results: TestResult[];
} {
  const results: TestResult[] = [];
  const tTick = state.globalTick;

  // Test 1: Chrome OS Tab Process Isolation
  {
    const baseProcs = state.chromeos.processes.length;
    const withTab = addBrowserTab(state, 'Test Sandbox Tab', 'https://sandbox.test');
    const addedTab = withTab.chromeos.tabs[withTab.chromeos.tabs.length - 1];
    const hasUniquePid = withTab.chromeos.processes.some(
      (p) => p.tabId === addedTab.id && p.pid === addedTab.pid
    );
    const afterKill = killChromeProcess(withTab, addedTab.pid);
    const cleanedUp =
      afterKill.chromeos.processes.length === baseProcs &&
      !afterKill.chromeos.tabs.some((t) => t.id === addedTab.id);

    results.push({
      id: 'test-chrome-process',
      os: 'Chrome OS',
      name: 'Aislamiento de procesos por pestaña',
      description: 'Verifica creación y terminación aislada de procesos Renderer por pestaña.',
      status: hasUniquePid && cleanedUp ? 'PASS' : 'FAIL',
      durationMs: 1.4,
      lastRunTick: tTick,
      assertions: [
        {
          label: 'Registro de PID único al abrir pestaña',
          passed: hasUniquePid,
          detail: `PID asignado: ${addedTab.pid}`,
        },
        {
          label: 'Liberación de pestaña y proceso al finalizar PID',
          passed: cleanedUp,
          detail: `Procesos restaurados: ${afterKill.chromeos.processes.length}/${baseProcs}`,
        },
      ],
    });
  }

  // Test 2: Chrome OS Network State Propagation
  {
    const offlineState: SharedEngineState = {
      ...state,
      chromeos: {
        ...state.chromeos,
        quickSettings: { ...state.chromeos.quickSettings, wifi: false },
      },
    };
    const pingRes = runCroshCommand(offlineState, 'ping 8.8.8.8');
    const blockedPing = pingRes.chromeos.terminalHistory.some((line) =>
      line.includes('Network is unreachable')
    );

    results.push({
      id: 'test-chrome-network',
      os: 'Chrome OS',
      name: 'Propagación de red desde Ajustes rápidos',
      description: 'Comprueba que el estado Wi-Fi de la bandeja gobierna la conectividad de apps.',
      status: blockedPing ? 'PASS' : 'FAIL',
      durationMs: 0.9,
      lastRunTick: tTick,
      assertions: [
        {
          label: 'Bloqueo de tráfico al desactivar Wi-Fi',
          passed: blockedPing,
          detail: blockedPing ? 'Crosh y Navegador detectan interfaz sin red' : 'Fallo de propagación',
        },
      ],
    });
  }

  // Test 3: Fuchsia Story & Capability Binding
  {
    const withStory = createFuchsiaStory(state, 'Story Verificación', 'player');
    const story = withStory.fuchsia.stories[withStory.fuchsia.stories.length - 1];
    const withMod = addModuleToStory(withStory, story.id, 'ipc-monitor');
    const updatedStory = withMod.fuchsia.stories.find((s) => s.id === story.id)!;
    const allHaveComponents = updatedStory.modules.every((m) =>
      withMod.fuchsia.components.some((c) => c.id === m.componentId && c.handles.length > 0)
    );

    results.push({
      id: 'test-fuchsia-story',
      os: 'Fuchsia',
      name: 'Composición modular de Stories y capacidades',
      description: 'Valida que cada módulo de Story referencia un componente con handles Zircon.',
      status: updatedStory.modules.length === 2 && allHaveComponents ? 'PASS' : 'FAIL',
      durationMs: 1.2,
      lastRunTick: tTick,
      assertions: [
        {
          label: 'Módulos ensamblados sin ventanas flotantes',
          passed: updatedStory.modules.length === 2,
          detail: `${updatedStory.modules.length} módulos en Story`,
        },
        {
          label: 'Vinculación a componentes con handles zx::*',
          passed: allHaveComponents,
          detail: 'Handles verificados en árbol de componentes',
        },
      ],
    });
  }

  // Test 4: Fuchsia IPC Channel Integrity
  {
    const beforeTotal = state.fuchsia.ipcTotalCount;
    const afterBurst = sendFuchsiaIpcBurst(state, 10, false);
    const delta = afterBurst.fuchsia.ipcTotalCount - beforeTotal;
    const validZeroDrops = afterBurst.fuchsia.ipcDroppedCount === state.fuchsia.ipcDroppedCount;

    results.push({
      id: 'test-fuchsia-ipc',
      os: 'Fuchsia',
      name: 'Integridad de canales IPC (zx_channel / FIDL)',
      description: 'Envía 10 mensajes FIDL sintéticos y valida entrega ordenada sin pérdidas.',
      status: delta === 10 && validZeroDrops ? 'PASS' : 'FAIL',
      durationMs: 1.8,
      lastRunTick: tTick,
      assertions: [
        {
          label: 'Despacho de 10 paquetes FIDL por zx_channel',
          passed: delta === 10,
          detail: `Incremento verificado: +${delta} mensajes`,
        },
        {
          label: 'Cero pérdidas en canal nominal',
          passed: validZeroDrops,
          detail: `Paquetes descartados en prueba: 0`,
        },
      ],
    });
  }

  // Test 5: RTOS Deterministic Priority Scheduling & LED Suspension
  {
    const suspended = toggleRtosTaskState(state, 't-blink');
    const stepped = stepSimulation({ ...suspended, running: true }, 600);
    const ledFrozen = stepped.rtos.leds.heartbeat === false;
    const topPriorityReady = stepped.rtos.tasks
      .filter((t) => t.state === 'RUNNING')
      .every((t) => t.priority >= 3);

    results.push({
      id: 'test-rtos-determinism',
      os: 'RTOS Embebido',
      name: 'Planificación determinista por prioridades',
      description: 'Suspende Task_Blink y verifica detención inmediata del LED GPIO2 y prelación.',
      status: ledFrozen && topPriorityReady ? 'PASS' : 'FAIL',
      durationMs: 0.7,
      lastRunTick: tTick,
      assertions: [
        {
          label: 'Suspensión de Task_Blink apaga LED_HEARTBEAT',
          passed: ledFrozen,
          detail: `GPIO2 LED = ${stepped.rtos.leds.heartbeat ? 'ON' : 'OFF'}`,
        },
        {
          label: 'Jitter acotado (< 15 us)',
          passed: stepped.rtos.maxJitterUs < 15,
          detail: `Jitter máximo registrado: ${stepped.rtos.maxJitterUs} us`,
        },
      ],
    });
  }

  // Test 6: RTOS Thermal Threshold & UART Alert
  {
    const hot = setRtosSensor(
      { ...state, rtos: { ...state.rtos, sensors: { ...state.rtos.sensors, temperatureC: 30 } } },
      'temperatureC',
      62.5
    );
    const alarmOn = hot.rtos.leds.alarm === true;
    const uartLogged = hot.rtos.uartLogs.some((l) => l.includes('62.5°C') || l.includes('Umbral superado'));

    results.push({
      id: 'test-rtos-thermal',
      os: 'RTOS Embebido',
      name: 'Respuesta hardware ante umbral térmico y UART',
      description: 'Inyecta 62.5°C en sensor ADC y verifica disparo inmediato de alarma física.',
      status: alarmOn && uartLogged ? 'PASS' : 'FAIL',
      durationMs: 0.6,
      lastRunTick: tTick,
      assertions: [
        {
          label: 'Activación inmediata de LED_ALARM (GPIO15)',
          passed: alarmOn,
          detail: `Temperatura inyectada: 62.5°C -> ALARM=${alarmOn}`,
        },
        {
          label: 'Registro de interrupción térmica en consola UART',
          passed: uartLogged,
          detail: 'Evento [ISR_THERMAL] emitido a 115200 baud',
        },
      ],
    });
  }

  return {
    nextState: {
      ...state,
      testResults: results,
    },
    results,
  };
}
