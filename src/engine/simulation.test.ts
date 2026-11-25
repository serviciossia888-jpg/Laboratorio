import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addBrowserTab,
  addModuleToStory,
  commitFuchsiaDocVmo,
  createFuchsiaStory,
  createInitialEngineState,
  evaluateSheetCell,
  killChromeProcess,
  logFuchsiaSheetEval,
  openChromeWindow,
  parseSectionFromUrl,
  runArchitectureTests,
  runCroshCommand,
  runFfxCommand,
  runRtosUartCommand,
  saveChromeDocToDrive,
  sendFuchsiaIpcBurst,
  setRtosSensor,
  stepSimulation,
  toggleRtosTaskState,
} from './simulation';
import { PRESENTATION_SLIDE_COUNT, SLIDE_ART_CATALOG } from './presentationArt';

test('Chrome OS: opening and killing a tab process maintains 1:1 renderer isolation', () => {
  const initial = createInitialEngineState();
  const baseProcCount = initial.chromeos.processes.length;
  const baseTabCount = initial.chromeos.tabs.length;

  const withTab = addBrowserTab(initial, 'Lab Spec', 'https://example.org', false);
  assert.equal(withTab.chromeos.tabs.length, baseTabCount + 1);
  assert.equal(withTab.chromeos.processes.length, baseProcCount + 1);

  const newTab = withTab.chromeos.tabs[withTab.chromeos.tabs.length - 1];
  const proc = withTab.chromeos.processes.find((p) => p.tabId === newTab.id);
  assert.ok(proc, 'Tab should register its own renderer process');
  assert.equal(proc.pid, newTab.pid);

  const afterKill = killChromeProcess(withTab, newTab.pid);
  assert.equal(afterKill.chromeos.tabs.length, baseTabCount);
  assert.equal(afterKill.chromeos.processes.length, baseProcCount);
});

test('Chrome OS: disabling Wi-Fi blocks crosh ping command', () => {
  const initial = createInitialEngineState();
  const offline = {
    ...initial,
    chromeos: {
      ...initial.chromeos,
      quickSettings: { ...initial.chromeos.quickSettings, wifi: false },
    },
  };
  const res = runCroshCommand(offline, 'ping 1.1.1.1');
  const lastLine = res.chromeos.terminalHistory[res.chromeos.terminalHistory.length - 1];
  assert.match(lastLine, /Network is unreachable/);
});

test('Chrome OS: office apps open processes, save Docs to Drive, and compute sheet formulas', () => {
  const initial = createInitialEngineState();
  assert.equal(evaluateSheetCell(initial.chromeos.sheetCells, 'B5'), '612');
  assert.equal(evaluateSheetCell(initial.chromeos.sheetCells, 'B6'), '204');
  assert.equal(evaluateSheetCell(initial.chromeos.sheetCells, 'D6'), '230');

  assert.equal(evaluateSheetCell({ A1: '10', A2: '0', A3: '=A1/A2' }, 'A3'), '#DIV/0!');
  assert.equal(evaluateSheetCell({ A1: '=A2+1', A2: '=A1+1' }, 'A1'), '#ERR!');

  const withDocs = openChromeWindow(initial, 'docs');
  const docsProc = withDocs.chromeos.processes.find((p) => p.appId === 'docs');
  assert.ok(docsProc, 'Documentos debe registrar un proceso propio');

  const saved = saveChromeDocToDrive(withDocs, 'Acta de Laboratorio', 'Contenido de prueba A/B');
  assert.ok(
    saved.chromeos.files.some(
      (f) => f.folder === 'Google Drive' && f.name === 'acta_de_laboratorio.doc.md'
    )
  );

  const afterKill = killChromeProcess(saved, docsProc.pid);
  assert.ok(!afterKill.chromeos.windows.some((w) => w.appId === 'docs'));
});

test('Fuchsia: stories compose modules and IPC burst increments total messages', () => {
  const initial = createInitialEngineState();
  const withStory = createFuchsiaStory(initial, 'Audio Lab', 'player');
  const created = withStory.fuchsia.stories[withStory.fuchsia.stories.length - 1];
  assert.equal(created.modules.length, 1);

  const withMod = addModuleToStory(withStory, created.id, 'ipc-monitor');
  const updatedStory = withMod.fuchsia.stories.find((s) => s.id === created.id)!;
  assert.equal(updatedStory.modules.length, 2);

  const afterBurst = sendFuchsiaIpcBurst(withMod, 15, false);
  assert.equal(afterBurst.fuchsia.ipcTotalCount, withMod.fuchsia.ipcTotalCount + 15);

  const afterFfx = runFfxCommand(afterBurst, 'ffx component list');
  assert.ok(afterFfx.fuchsia.ffxHistory.some((l) => l.includes('/session/workstation')));
});

test('Fuchsia: office modules bind Zircon components and emit FIDL VMO/Eval IPC messages', () => {
  const initial = createInitialEngineState();
  const activeId = initial.fuchsia.activeStoryId;

  const withDocsMod = addModuleToStory(initial, activeId, 'doc-editor');
  const withSheetMod = addModuleToStory(withDocsMod, activeId, 'sheet-calc');
  const withTasksMod = addModuleToStory(withSheetMod, activeId, 'calendar-tasks');

  const story = withTasksMod.fuchsia.stories.find((s) => s.id === activeId)!;
  for (const mod of story.modules) {
    assert.ok(
      withTasksMod.fuchsia.components.some((c) => c.id === mod.componentId && c.handles.length > 0),
      `Component ${mod.componentId} must exist with handles`
    );
  }

  const afterVmo = commitFuchsiaDocVmo(withTasksMod, '# Nuevo documento VMO');
  assert.equal(afterVmo.fuchsia.ipcTotalCount, withTasksMod.fuchsia.ipcTotalCount + 1);
  assert.equal(afterVmo.fuchsia.ipcMessages[0].protocol, 'fuchsia.docs.VmoStore');

  const afterCalc = logFuchsiaSheetEval(afterVmo, 'B2', '30000');
  assert.equal(evaluateSheetCell(afterCalc.fuchsia.sheetCells, 'B5'), '85400');
  assert.equal(afterCalc.fuchsia.ipcMessages[0].protocol, 'fuchsia.calc.EvalEngine');
});

test('RTOS: thermal spike activates LED_ALARM and suspending Task_Blink freezes heartbeat', () => {
  const initial = createInitialEngineState();
  const hot = setRtosSensor(initial, 'temperatureC', 58.0);
  assert.equal(hot.rtos.leds.alarm, true);
  assert.ok(hot.rtos.uartLogs.some((l) => l.includes('ISR_THERMAL')));

  const suspended = toggleRtosTaskState(hot, 't-blink');
  const blinkTask = suspended.rtos.tasks.find((t) => t.id === 't-blink');
  assert.equal(blinkTask?.state, 'SUSPENDED');

  const stepped = stepSimulation(suspended, 600);
  assert.equal(stepped.rtos.leds.heartbeat, false);

  const rebooted = runRtosUartCommand(stepped, 'reboot');
  assert.equal(rebooted.rtos.tickCount, 0);
  assert.equal(rebooted.rtos.bootPhase, 'BOOTING');
});

test('Testing Lab: automated architecture suite passes all 6 checks', () => {
  const initial = createInitialEngineState();
  const { results } = runArchitectureTests(initial);
  assert.equal(results.length, 6);
  for (const r of results) {
    assert.equal(r.status, 'PASS', `Expected ${r.id} to pass`);
  }
});

test('Router: parses hash routes and falls back to query section or inicio', () => {
  assert.equal(parseSectionFromUrl('#/chromeos', ''), 'chromeos');
  assert.equal(parseSectionFromUrl('#fuchsia', ''), 'fuchsia');
  assert.equal(parseSectionFromUrl('#/docs', '?section=rtos'), 'docs');
  assert.equal(parseSectionFromUrl('', '?section=rtos'), 'rtos');
  assert.equal(parseSectionFromUrl('#/desconocido', ''), 'inicio');
});

test('Presentation Art: every OS defines 7 slides with coherent 16:9 infographic prompts', () => {
  assert.equal(PRESENTATION_SLIDE_COUNT, 7);
  for (const osId of ['chromeos', 'fuchsia', 'rtos'] as const) {
    const specs = SLIDE_ART_CATALOG[osId];
    assert.equal(specs.length, 7, `${osId} should have 7 slides`);
    specs.forEach((spec, idx) => {
      assert.equal(spec.slideNumber, idx + 1);
      assert.ok(spec.graphicType.length > 10);
      assert.ok(spec.textAdaptation.length > 20);
      assert.ok(spec.layoutDistribution.length > 15);
      assert.ok(spec.prompt.includes('16:9'));
    });
  }
});

