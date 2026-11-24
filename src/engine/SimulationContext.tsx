import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  addBrowserTab,
  addModuleToStory,
  closeBrowserTab,
  closeChromeWindow,
  commitFuchsiaDocVmo,
  createFuchsiaStory,
  createInitialEngineState,
  killChromeProcess,
  logFuchsiaSheetEval,
  openChromeWindow,
  parseSectionFromUrl,
  removeModuleFromStory,
  reorderModuleInStory,
  runArchitectureTests,
  runCroshCommand,
  runFfxCommand,
  runRtosUartCommand,
  saveChromeDocToDrive,
  sendFuchsiaIpcBurst,
  setRtosSensor,
  stepSimulation,
  toggleRtosTaskState,
  triggerRtosPanic,
  triggerRtosReset,
} from './simulation';
import {
  ChromeAppId,
  ChromeNoteItem,
  ChromeOSState,
  FuchsiaModuleType,
  RTOSState,
  SectionId,
  SharedEngineState,
} from './types';

interface SimulationContextValue {
  state: SharedEngineState;
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  toggleEngineRunning: () => void;
  resetAll: () => void;
  // Chrome OS actions
  openChromeApp: (appId: ChromeAppId) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  toggleMaximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  moveWindow: (windowId: string, x: number, y: number) => void;
  resizeWindow: (windowId: string, width: number, height: number) => void;
  toggleLauncher: (force?: boolean) => void;
  toggleQuickSettings: (force?: boolean) => void;
  toggleQuickSetting: (key: 'wifi' | 'bluetooth' | 'dnd') => void;
  setQuickSlider: (key: 'brightness' | 'volume', value: number) => void;
  addTab: (title?: string, url?: string, heavy?: boolean) => void;
  closeTab: (tabId: string) => void;
  selectTab: (tabId: string) => void;
  navigateTab: (tabId: string, url: string, title: string) => void;
  killProcess: (pid: number) => void;
  selectChromeFolder: (folder: ChromeOSState['selectedFolder']) => void;
  createChromeFile: (name: string, preview: string) => void;
  deleteChromeFile: (id: string) => void;
  execCrosh: (cmd: string) => void;
  updateChromeDoc: (title: string, content: string) => void;
  saveChromeDoc: (title: string, content: string) => void;
  updateChromeSheetCell: (cell: string, value: string) => void;
  addChromeNote: (title: string, content: string, color: ChromeNoteItem['color']) => void;
  togglePinChromeNote: (id: string) => void;
  deleteChromeNote: (id: string) => void;
  // Fuchsia actions
  selectFuchsiaStory: (storyId: string) => void;
  createStory: (title: string, mod: FuchsiaModuleType) => void;
  closeStory: (storyId: string) => void;
  toggleFuchsiaOverview: (force?: boolean) => void;
  toggleFuchsiaComponentsPanel: (force?: boolean) => void;
  selectFuchsiaComponent: (componentId: string) => void;
  addStoryModule: (storyId: string, modType: FuchsiaModuleType) => void;
  removeStoryModule: (storyId: string, moduleId: string) => void;
  reorderStoryModule: (storyId: string, moduleId: string, dir: 'left' | 'right') => void;
  toggleFuchsiaAudio: () => void;
  nextFuchsiaTrack: () => void;
  sendIpcBurst: (count?: number, dropSome?: boolean) => void;
  restartFuchsiaComponent: (componentId: string) => void;
  toggleFuchsiaMicPrivacy: () => void;
  setFuchsiaUiScale: (scale: number) => void;
  execFfx: (cmd: string) => void;
  updateFuchsiaDoc: (content: string) => void;
  commitFuchsiaDoc: (content: string) => void;
  updateFuchsiaSheetCell: (cell: string, value: string) => void;
  addFuchsiaTask: (title: string, time: string) => void;
  toggleFuchsiaTask: (id: string) => void;
  deleteFuchsiaTask: (id: string) => void;
  // RTOS actions
  updateRtosSensor: (key: keyof RTOSState['sensors'], value: number) => void;
  toggleRtosTask: (taskId: string) => void;
  boostRtosTaskPriority: (taskId: string) => void;
  resetRtosBoard: () => void;
  panicRtosBoard: () => void;
  execRtosUart: (cmd: string) => void;
  // Test Lab actions
  runAllTests: () => void;
  runSingleTest: (testId: string) => void;
  logStressEvent: (message: string) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

function getInitialSection(): SectionId {
  if (typeof window === 'undefined') return 'inicio';
  return parseSectionFromUrl(window.location.hash, window.location.search);
}

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SharedEngineState>(() => createInitialEngineState());
  const [activeSection, setActiveSectionState] = useState<SectionId>(getInitialSection);

  const setActiveSection = useCallback((section: SectionId) => {
    setActiveSectionState(section);
    if (typeof window !== 'undefined') {
      const targetHash = `#/${section}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHashChange = () => {
      const next = parseSectionFromUrl(window.location.hash, window.location.search);
      setActiveSectionState(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((prev) => stepSimulation(prev, prev.tickRateMs));
    }, 400);
    return () => window.clearInterval(timer);
  }, []);

  const toggleEngineRunning = useCallback(() => {
    setState((prev) => ({ ...prev, running: !prev.running }));
  }, []);

  const resetAll = useCallback(() => {
    setState(createInitialEngineState());
  }, []);

  // Chrome OS handlers
  const openChromeApp = useCallback((appId: ChromeAppId) => {
    setState((prev) => openChromeWindow(prev, appId));
  }, []);

  const closeWindow = useCallback((windowId: string) => {
    setState((prev) => closeChromeWindow(prev, windowId));
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        windows: prev.chromeos.windows.map((w) =>
          w.id === windowId ? { ...w, minimized: true } : w
        ),
      },
    }));
  }, []);

  const toggleMaximizeWindow = useCallback((windowId: string) => {
    setState((prev) => {
      const nextZ = prev.chromeos.nextZIndex + 1;
      return {
        ...prev,
        chromeos: {
          ...prev.chromeos,
          nextZIndex: nextZ,
          windows: prev.chromeos.windows.map((w) =>
            w.id === windowId ? { ...w, maximized: !w.maximized, zIndex: nextZ } : w
          ),
        },
      };
    });
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setState((prev) => {
      const nextZ = prev.chromeos.nextZIndex + 1;
      return {
        ...prev,
        chromeos: {
          ...prev.chromeos,
          launcherOpen: false,
          quickSettingsOpen: false,
          nextZIndex: nextZ,
          windows: prev.chromeos.windows.map((w) =>
            w.id === windowId ? { ...w, zIndex: nextZ, minimized: false } : w
          ),
        },
      };
    });
  }, []);

  const moveWindow = useCallback((windowId: string, x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        windows: prev.chromeos.windows.map((w) =>
          w.id === windowId ? { ...w, x: Math.max(0, x), y: Math.max(0, y) } : w
        ),
      },
    }));
  }, []);

  const resizeWindow = useCallback((windowId: string, width: number, height: number) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        windows: prev.chromeos.windows.map((w) =>
          w.id === windowId
            ? { ...w, width: Math.max(290, width), height: Math.max(240, height) }
            : w
        ),
      },
    }));
  }, []);

  const toggleLauncher = useCallback((force?: boolean) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        launcherOpen: force !== undefined ? force : !prev.chromeos.launcherOpen,
        quickSettingsOpen: false,
      },
    }));
  }, []);

  const toggleQuickSettings = useCallback((force?: boolean) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        quickSettingsOpen: force !== undefined ? force : !prev.chromeos.quickSettingsOpen,
        launcherOpen: false,
      },
    }));
  }, []);

  const toggleQuickSetting = useCallback((key: 'wifi' | 'bluetooth' | 'dnd') => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        quickSettings: {
          ...prev.chromeos.quickSettings,
          [key]: !prev.chromeos.quickSettings[key],
        },
      },
    }));
  }, []);

  const setQuickSlider = useCallback((key: 'brightness' | 'volume', value: number) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        quickSettings: {
          ...prev.chromeos.quickSettings,
          [key]: value,
        },
      },
    }));
  }, []);

  const addTab = useCallback((title?: string, url?: string, heavy?: boolean) => {
    setState((prev) => addBrowserTab(prev, title, url, heavy));
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setState((prev) => closeBrowserTab(prev, tabId));
  }, []);

  const selectTab = useCallback((tabId: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: { ...prev.chromeos, activeTabId: tabId },
    }));
  }, []);

  const navigateTab = useCallback((tabId: string, url: string, title: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        tabs: prev.chromeos.tabs.map((t) => (t.id === tabId ? { ...t, url, title } : t)),
        processes: prev.chromeos.processes.map((p) =>
          p.tabId === tabId ? { ...p, name: `Pestaña: ${title}` } : p
        ),
      },
    }));
  }, []);

  const killProcess = useCallback((pid: number) => {
    setState((prev) => killChromeProcess(prev, pid));
  }, []);

  const selectChromeFolder = useCallback((folder: ChromeOSState['selectedFolder']) => {
    setState((prev) => ({
      ...prev,
      chromeos: { ...prev.chromeos, selectedFolder: folder },
    }));
  }, []);

  const createChromeFile = useCallback((name: string, preview: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        files: [
          {
            id: `f-${Date.now()}`,
            name,
            folder: prev.chromeos.selectedFolder,
            sizeKb: Math.max(1, Math.ceil(preview.length / 12)),
            updatedAt: 'Ahora mismo',
            preview,
          },
          ...prev.chromeos.files,
        ],
      },
    }));
  }, []);

  const deleteChromeFile = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        files: prev.chromeos.files.filter((f) => f.id !== id),
      },
    }));
  }, []);

  const execCrosh = useCallback((cmd: string) => {
    setState((prev) => runCroshCommand(prev, cmd));
  }, []);

  const updateChromeDoc = useCallback((title: string, content: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: { ...prev.chromeos, docTitle: title, docContent: content },
    }));
  }, []);

  const saveChromeDoc = useCallback((title: string, content: string) => {
    setState((prev) => saveChromeDocToDrive(prev, title, content));
  }, []);

  const updateChromeSheetCell = useCallback((cell: string, value: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        sheetCells: { ...prev.chromeos.sheetCells, [cell.toUpperCase()]: value },
      },
    }));
  }, []);

  const addChromeNote = useCallback(
    (title: string, content: string, color: ChromeNoteItem['color']) => {
      setState((prev) => ({
        ...prev,
        chromeos: {
          ...prev.chromeos,
          notes: [
            {
              id: `note-${Date.now()}`,
              title: title.trim() || 'Nota rápida',
              content: content.trim(),
              color,
              pinned: false,
            },
            ...prev.chromeos.notes,
          ],
        },
      }));
    },
    []
  );

  const togglePinChromeNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        notes: prev.chromeos.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
      },
    }));
  }, []);

  const deleteChromeNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      chromeos: {
        ...prev.chromeos,
        notes: prev.chromeos.notes.filter((n) => n.id !== id),
      },
    }));
  }, []);

  // Fuchsia handlers
  const selectFuchsiaStory = useCallback((storyId: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: { ...prev.fuchsia, activeStoryId: storyId, overviewMode: false },
    }));
  }, []);

  const createStory = useCallback((title: string, mod: FuchsiaModuleType) => {
    setState((prev) => createFuchsiaStory(prev, title, mod));
  }, []);

  const closeStory = useCallback((storyId: string) => {
    setState((prev) => {
      const remaining = prev.fuchsia.stories.filter((s) => s.id !== storyId);
      const nextActive =
        prev.fuchsia.activeStoryId === storyId
          ? remaining[0]?.id ?? ''
          : prev.fuchsia.activeStoryId;
      return {
        ...prev,
        fuchsia: {
          ...prev.fuchsia,
          stories: remaining,
          activeStoryId: nextActive,
        },
      };
    });
  }, []);

  const toggleFuchsiaOverview = useCallback((force?: boolean) => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        overviewMode: force !== undefined ? force : !prev.fuchsia.overviewMode,
      },
    }));
  }, []);

  const toggleFuchsiaComponentsPanel = useCallback((force?: boolean) => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        componentsPanelOpen: force !== undefined ? force : !prev.fuchsia.componentsPanelOpen,
      },
    }));
  }, []);

  const selectFuchsiaComponent = useCallback((componentId: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: { ...prev.fuchsia, selectedComponentId: componentId },
    }));
  }, []);

  const addStoryModule = useCallback((storyId: string, modType: FuchsiaModuleType) => {
    setState((prev) => addModuleToStory(prev, storyId, modType));
  }, []);

  const removeStoryModule = useCallback((storyId: string, moduleId: string) => {
    setState((prev) => removeModuleFromStory(prev, storyId, moduleId));
  }, []);

  const reorderStoryModule = useCallback(
    (storyId: string, moduleId: string, dir: 'left' | 'right') => {
      setState((prev) => reorderModuleInStory(prev, storyId, moduleId, dir));
    },
    []
  );

  const toggleFuchsiaAudio = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fuchsia: { ...prev.fuchsia, audioPlaying: !prev.fuchsia.audioPlaying },
    }));
  }, []);

  const nextFuchsiaTrack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        audioTrackIndex: (prev.fuchsia.audioTrackIndex + 1) % 3,
        audioProgressSec: 0,
      },
    }));
  }, []);

  const sendIpcBurst = useCallback((count = 1, dropSome = false) => {
    setState((prev) => sendFuchsiaIpcBurst(prev, count, dropSome));
  }, []);

  const restartFuchsiaComponent = useCallback((componentId: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        components: prev.fuchsia.components.map((c) =>
          c.id === componentId
            ? { ...c, state: c.state === 'RUNNING' ? 'PAUSED' : 'RUNNING' }
            : c
        ),
      },
    }));
  }, []);

  const toggleFuchsiaMicPrivacy = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fuchsia: { ...prev.fuchsia, privacyMicAllowed: !prev.fuchsia.privacyMicAllowed },
    }));
  }, []);

  const setFuchsiaUiScale = useCallback((scale: number) => {
    setState((prev) => ({
      ...prev,
      fuchsia: { ...prev.fuchsia, uiScale: scale },
    }));
  }, []);

  const execFfx = useCallback((cmd: string) => {
    setState((prev) => runFfxCommand(prev, cmd));
  }, []);

  const updateFuchsiaDoc = useCallback((content: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: { ...prev.fuchsia, docContent: content },
    }));
  }, []);

  const commitFuchsiaDoc = useCallback((content: string) => {
    setState((prev) => commitFuchsiaDocVmo(prev, content));
  }, []);

  const updateFuchsiaSheetCell = useCallback((cell: string, value: string) => {
    setState((prev) => logFuchsiaSheetEval(prev, cell, value));
  }, []);

  const addFuchsiaTask = useCallback((title: string, time: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        tasks: [
          ...prev.fuchsia.tasks,
          { id: `ft-${Date.now()}`, title: title.trim(), done: false, time: time || '16:00' },
        ],
      },
    }));
  }, []);

  const toggleFuchsiaTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        tasks: prev.fuchsia.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      },
    }));
  }, []);

  const deleteFuchsiaTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      fuchsia: {
        ...prev.fuchsia,
        tasks: prev.fuchsia.tasks.filter((t) => t.id !== id),
      },
    }));
  }, []);

  // RTOS handlers
  const updateRtosSensor = useCallback((key: keyof RTOSState['sensors'], value: number) => {
    setState((prev) => setRtosSensor(prev, key, value));
  }, []);

  const toggleRtosTask = useCallback((taskId: string) => {
    setState((prev) => toggleRtosTaskState(prev, taskId));
  }, []);

  const boostRtosTaskPriority = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      rtos: {
        ...prev.rtos,
        tasks: prev.rtos.tasks.map((t) =>
          t.id === taskId ? { ...t, priority: t.priority >= 5 ? 2 : t.priority + 1 } : t
        ),
      },
    }));
  }, []);

  const resetRtosBoard = useCallback(() => {
    setState((prev) => triggerRtosReset(prev));
  }, []);

  const panicRtosBoard = useCallback(() => {
    setState((prev) => triggerRtosPanic(prev));
  }, []);

  const execRtosUart = useCallback((cmd: string) => {
    setState((prev) => runRtosUartCommand(prev, cmd));
  }, []);

  // Test Lab handlers
  const runAllTests = useCallback(() => {
    setState((prev) => runArchitectureTests(prev).nextState);
  }, []);

  const runSingleTest = useCallback((testId: string) => {
    setState((prev) => {
      const { results } = runArchitectureTests(prev);
      const updatedOne = results.find((r) => r.id === testId);
      if (!updatedOne) return prev;
      return {
        ...prev,
        testResults: prev.testResults.map((r) => (r.id === testId ? updatedOne : r)),
      };
    });
  }, []);

  const logStressEvent = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      stressEvents: [`[Tick ${prev.globalTick}] ${message}`, ...prev.stressEvents].slice(0, 20),
    }));
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        state,
        activeSection,
        setActiveSection,
        toggleEngineRunning,
        resetAll,
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
        updateRtosSensor,
        toggleRtosTask,
        boostRtosTaskPriority,
        resetRtosBoard,
        panicRtosBoard,
        execRtosUart,
        runAllTests,
        runSingleTest,
        logStressEvent,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used inside SimulationProvider');
  return ctx;
}
