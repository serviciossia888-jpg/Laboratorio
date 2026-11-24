import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Layers,
  Monitor,
  Presentation,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import { useSimulation } from '../engine/SimulationContext';
import { SectionId } from '../engine/types';

type DocsTopic = 'manual' | 'chromeos' | 'fuchsia' | 'rtos';

interface ConceptBlock {
  title: string;
  concept: string;
  explanation: string;
  simulatorLinkLabel: string;
}

interface OSDossier {
  id: Exclude<DocsTopic, 'manual'>;
  targetSection: SectionId;
  name: string;
  tagline: string;
  origin: string;
  philosophy: string;
  architectureSummary: string;
  layers: { label: string; detail: string; accent: string }[];
  concepts: ConceptBlock[];
  influence: string;
  futureTrends: string[];
}

const OS_DOSSIERS: Record<Exclude<DocsTopic, 'manual'>, OSDossier> = {
  chromeos: {
    id: 'chromeos',
    targetSection: 'chromeos',
    name: 'Chrome OS',
    tagline: 'Ligereza centrada en la nube, aislamiento por pestaña y actualizaciones silenciosas A/B',
    origin:
      'Anunciado por Google en 2009 y lanzado en 2011 sobre Chromium OS y el kernel Linux, eliminando capas heredadas de escritorio pesado.',
    philosophy:
      'Minimalismo operativo: arranque en segundos, estado sincronizado en la nube, cero parches manuales y contención de fallos en el navegador.',
    architectureSummary:
      'Kernel Linux endurecido con raíz de solo lectura, compositor gráfico Ash/Wayland y Chromium aislando cada pestaña en su propio proceso Renderer.',
    layers: [
      { label: 'Interfaz Material Design (Ash / Shelf)', detail: 'Ventanas, lanzador de apps y ajustes rápidos', accent: 'bg-sky-50 border-sky-200 text-sky-900' },
      { label: 'Multi-proceso Chromium + Sandbox', detail: '1 proceso Renderer por pestaña · seccomp-bpf', accent: 'bg-sky-100/80 border-sky-300 text-sky-950' },
      { label: 'Kernel Linux 6.6 + dm-verity', detail: 'Verified Boot criptográfico + namespaces', accent: 'bg-slate-100 border-slate-300 text-slate-900' },
      { label: 'Firmware & Particiones A/B', detail: 'ROOT-A / ROOT-B para actualización silenciosa', accent: 'bg-slate-900 border-slate-800 text-white' },
    ],
    concepts: [
      {
        title: '1. Gestión de procesos',
        concept: 'Multi-proceso por pestaña',
        explanation:
          'Cada pestaña ejecuta un proceso Renderer aislado con filtro seccomp-bpf. Finalizar un PID en Shift+Esc cierra solo esa pestaña sin afectar el sistema.',
        simulatorLinkLabel: 'Probar en Monitor de tareas',
      },
      {
        title: '2. Actualizaciones silenciosas A/B',
        concept: 'Particiones duales sin pausas',
        explanation:
          'Existen dos particiones de sistema (A y B). Mientras usas A, update_engine descarga y verifica B en segundo plano; el cambio ocurre en el siguiente reinicio.',
        simulatorLinkLabel: 'Ver estado en Ajustes',
      },
      {
        title: '3. Seguridad por diseño',
        concept: 'Verified Boot y raíz inmutable',
        explanation:
          'El firmware verifica la firma del kernel y dm-verity valida bloque a bloque la raíz de solo lectura, revirtiendo automáticamente ante alteraciones.',
        simulatorLinkLabel: 'Inspeccionar en Crosh / Archivos',
      },
    ],
    influence:
      'Domina el sector educativo K-12 y despliegues empresariales gestionados por su bajo coste operativo y mínima exposición a malware.',
    futureTrends: [
      'Extensión de vida útil de PCs antiguos mediante ChromeOS Flex (sostenibilidad).',
      'Contenedores Linux (Crostini) y aceleración WebGPU / IA local en Chromebook Plus.',
      'Convergencia hacia servicios contenerizados y políticas Zero-Trust desde la nube.',
    ],
  },
  fuchsia: {
    id: 'fuchsia',
    targetSection: 'fuchsia',
    name: 'Google Fuchsia',
    tagline: 'Microkernel Zircon, seguridad basada en capacidades y arquitectura modular sin POSIX heredado',
    origin:
      'Iniciado por Google en 2016 desde cero, sin kernel Linux, para superar la fragmentación de actualizaciones y permisos de sistemas monolíticos.',
    philosophy:
      'Seguridad por capacidades absolutas: no existe usuario "root" ni sistema de archivos global; cada componente recibe únicamente Handles explícitos.',
    architectureSummary:
      'Sobre el microkernel Zircon (hilos, memoria virtual, IPC) corre el Component Framework y el protocolo FIDL, componiendo la UI en Stories.',
    layers: [
      { label: 'Workstation Stories & Flatland UI', detail: 'Módulos componibles y Overview sin ventanas rígidas', accent: 'bg-rose-50 border-rose-200 text-rose-950' },
      { label: 'Component Framework (v2)', detail: 'Manifiestos .cml · Árbol jerárquico de componentes', accent: 'bg-rose-100/80 border-rose-300 text-rose-950' },
      { label: 'FIDL & Zircon Handles', detail: 'Canales IPC tipados (zx::channel) y memoria VMO', accent: 'bg-slate-100 border-slate-300 text-slate-900' },
      { label: 'Microkernel Zircon', detail: 'Planificación, objetos de kernel y drivers en espacio de usuario', accent: 'bg-slate-900 border-slate-800 text-white' },
    ],
    concepts: [
      {
        title: '1. Arquitectura Microkernel',
        concept: 'Drivers e IPC fuera del núcleo',
        explanation:
          'Zircon mantiene el núcleo mínimo. Red, audio y almacenamiento operan como componentes aislados en espacio de usuario comunicados por mensajes.',
        simulatorLinkLabel: 'Explorar Árbol de Componentes',
      },
      {
        title: '2. Seguridad por capacidades',
        concept: 'Zircon Handles (zx::channel / zx::vmo)',
        explanation:
          'Ningún componente accede a rutas arbitrarias. Toda interacción requiere un Handle explícito (ej. 0x01a4) con derechos acotados (READ, WRITE, MAP).',
        simulatorLinkLabel: 'Inspeccionar Handles en Visor',
      },
      {
        title: '3. Memoria y actualizaciones',
        concept: 'VMOs compartidos y paquetes BlobFS',
        explanation:
          'Buffers multimedia se comparten mediante Virtual Memory Objects (zx::vmo) sin copias extra, y los paquetes inmutables permiten actualizaciones atómicas.',
        simulatorLinkLabel: 'Probar Reproductor + Monitor IPC',
      },
    ],
    influence:
      'Opera ya en producción sobre pantallas inteligentes (Google Nest Hub) y sirve como referente de sistemas limpios orientados a capacidades.',
    futureTrends: [
      'Controladores 100% en espacio de usuario mediante Driver Framework v2.',
      'Expansión a dispositivos IoT, pantallas conectadas y sistemas embebidos modulares.',
      'Uso creciente de Rust para garantizar seguridad de memoria en servicios críticos.',
    ],
  },
  rtos: {
    id: 'rtos',
    targetSection: 'rtos',
    name: 'Sistema Embebido (RTOS)',
    tagline: 'Determinismo estricto, huella en kilobytes y control directo sobre hardware e IoT',
    origin:
      'Representado por FreeRTOS (2003) y Zephyr OS (2016). Reemplazaron los bucles infinitos "super-loop" en microcontroladores (ESP32, STM32) ante el auge IoT.',
    philosophy:
      'Ligereza extrema y previsibilidad temporal: una respuesta correcta que llega tarde es un fallo. Cada byte de SRAM y microsegundo están acotados.',
    architectureSummary:
      'Sin unidad MMU, kernel y tareas comparten SRAM física con pilas estáticas, planificación preemptive por prioridades y acceso directo a GPIO, ADC, I2C y UART.',
    layers: [
      { label: 'Tareas de aplicación (Tasks)', detail: 'Task_Sensor, Task_Blink, Task_Display, Task_Watchdog', accent: 'bg-amber-50 border-amber-200 text-amber-950' },
      { label: 'Núcleo RTOS (Scheduler + IPC)', detail: 'Planificación por prioridad · Colas, semáforos y Tickless Idle', accent: 'bg-slate-800 border-slate-700 text-cyan-200' },
      { label: 'HAL & Drivers de Periféricos', detail: 'Interrupciones ISR, ADC, PWM, I2C (OLED) y UART0', accent: 'bg-slate-900 border-slate-700 text-emerald-300' },
      { label: 'Hardware MCU (ESP32 / STM32)', detail: 'SRAM 520 KB, MPU por regiones, Watchdog físico y pines GPIO', accent: 'bg-emerald-950 border-emerald-800 text-emerald-100' },
    ],
    concepts: [
      {
        title: '1. Planificación determinista',
        concept: 'Preemptive Priority Scheduling',
        explanation:
          'La tarea READY de mayor prioridad toma la CPU al instante con jitter menor a 10 µs. Suspender Task_Blink detiene de inmediato el parpadeo físico del LED GPIO2.',
        simulatorLinkLabel: 'Suspender tareas en htop RTOS',
      },
      {
        title: '2. Memoria sin MMU',
        concept: 'Pilas estáticas en SRAM',
        explanation:
          'Sin memoria virtual ni swap, cada tarea tiene una pila fija en kilobytes (ej. 1024 B). Desbordarla dispara una alerta de Stack Overflow y el Watchdog.',
        simulatorLinkLabel: 'Simular Stack Overflow / Panic',
      },
      {
        title: '3. Seguridad en IoT',
        concept: 'MPU, Watchdog y OTA firmada',
        explanation:
          'Regiones MPU aíslan tareas críticas, el Hardware Watchdog reinicia el MCU ante bloqueos y las particiones OTA firmadas habilitan parches silenciosos.',
        simulatorLinkLabel: 'Probar umbral térmico y Watchdog',
      },
    ],
    influence:
      'Columna vertebral de miles de millones de nodos conectados: domótica, sensores industriales, equipos médicos, satélites y electrónica automotriz.',
    futureTrends: [
      'Consolidación de Zephyr OS como estándar abierto multi-arquitectura (ARM, RISC-V).',
      'Inferencia TinyML en el borde (edge AI) con consumo de apenas milivatios.',
      'TrustZone-M y arranque seguro PSA Certified para actualizaciones OTA silenciosas en flotas IoT.',
    ],
  },
};

export const DocsManualScreen: React.FC = () => {
  const { setActiveSection } = useSimulation();
  const [topic, setTopic] = useState<DocsTopic>('manual');
  const [presentationMode, setPresentationMode] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const dossier = topic !== 'manual' ? OS_DOSSIERS[topic] : null;
  const totalSlides = 3;

  // Reset slide index when topic changes
  const handleSelectTopic = (nextTopic: DocsTopic) => {
    setTopic(nextTopic);
    setSlideIndex(0);
  };

  // Keyboard navigation in Presentation Mode
  useEffect(() => {
    if (!presentationMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setPresentationMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [presentationMode, totalSlides]);

  const renderPresentationSlide = () => {
    if (topic === 'manual') {
      if (slideIndex === 0) {
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-semibold text-sky-700">
                Diapositiva 1 · Manual de Usuario
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                Cómo operar el Laboratorio de SO Emergentes
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-4">
                <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-sky-700 shrink-0" />
                  <span>Motor Compartido y Persistencia</span>
                </h3>
                <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
                  Los tres sistemas operativos comparten un reloj único de simulación. Cambia entre
                  pestañas sin perder ventanas, historias de Fuchsia ni sensores del RTOS.
                </p>
                <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
                  Usa <strong>Pausar / Reanudar motor</strong> arriba a la derecha para congelar o
                  reactivar todos los procesos en vivo.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-4">
                <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                  <span>Ejes de Estudio en Clase</span>
                </h3>
                <ul className="space-y-3 text-lg sm:text-xl text-slate-800 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-sky-700 shrink-0 mt-1" />
                    <span><strong>Ligereza e IoT:</strong> del navegador aislado a kilobytes en SRAM.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-rose-700 shrink-0 mt-1" />
                    <span><strong>Microkernels:</strong> Zircon y comunicación tipada por canales FIDL.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-amber-700 shrink-0 mt-1" />
                    <span><strong>Seguridad por diseño:</strong> particiones A/B, handles y MPU/WDT.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }

      if (slideIndex === 1) {
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-semibold text-sky-700">
                Diapositiva 2 · Guías de Escritorio y Workstation
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                Uso práctico: Chrome OS y Google Fuchsia
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-sky-600 shrink-0" />
                    <span>Pantalla Chrome OS</span>
                  </h3>
                  <ul className="space-y-3 text-lg sm:text-xl text-slate-800 leading-relaxed list-disc pl-6">
                    <li>Ventanas arrastrables, redimensionables y minimizables al estante.</li>
                    <li>Cada pestaña registra su PID en <strong>Monitor de tareas</strong> (Shift+Esc).</li>
                    <li>Ajustes rápidos en la bandeja derecha (Wi-Fi, Bluetooth, Brillo).</li>
                    <li>Terminal Crosh: <span className="font-mono">ps</span>, <span className="font-mono">free -m</span>, <span className="font-mono">ping</span>.</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('chromeos')}
                  className="self-start inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
                >
                  <span>Abrir Chrome OS</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Layers className="w-6 h-6 text-rose-600 shrink-0" />
                    <span>Pantalla Google Fuchsia</span>
                  </h3>
                  <ul className="space-y-3 text-lg sm:text-xl text-slate-800 leading-relaxed list-disc pl-6">
                    <li>Trabaja con <strong>Stories</strong> modulares y vista <strong>Overview</strong>.</li>
                    <li>Agrega, reordena o cierra módulos desde la cabecera de la Story.</li>
                    <li>Inspecciona protocolos y handles <span className="font-mono">zx::*</span> en <strong>Componentes</strong>.</li>
                    <li>Terminal ffx: <span className="font-mono">ffx component list</span>, <span className="font-mono">ffx log</span>.</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('fuchsia')}
                  className="self-start inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
                >
                  <span>Abrir Fuchsia</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-semibold text-sky-700">
              Diapositiva 3 · Hardware Embebido y Pruebas
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Uso práctico: RTOS Embebido y Laboratorio de Pruebas
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-amber-600 shrink-0" />
                  <span>Sistema Embebido (RTOS)</span>
                </h3>
                <ul className="space-y-3 text-lg sm:text-xl text-slate-800 leading-relaxed list-disc pl-6">
                  <li>Placa física con OLED 128×64, LEDs reactivos y botón <strong>EN / RST</strong>.</li>
                  <li>Sliders de Temperatura (≥ 50 °C activa alarma), Luz y Voltaje.</li>
                  <li>Monitor <strong>htop RTOS</strong> para suspender/reanudar tareas en tiempo real.</li>
                  <li>UART CLI: <span className="font-mono">tasks</span>, <span className="font-mono">blink 200</span>, <span className="font-mono">panic</span>.</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('rtos')}
                className="self-start inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <span>Abrir RTOS Embebido</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-slate-700 shrink-0" />
                  <span>Laboratorio de Pruebas</span>
                </h3>
                <ul className="space-y-3 text-lg sm:text-xl text-slate-800 leading-relaxed list-disc pl-6">
                  <li>Suite automática de 6 aserciones sobre los tres sistemas.</li>
                  <li>Inyección de estrés: 3 pestañas pesadas, ráfaga FIDL o pico térmico.</li>
                  <li>Comparativa en vivo de RAM (MB), VMOs y pilas SRAM (KB).</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('pruebas')}
                className="self-start inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <span>Abrir Laboratorio de Pruebas</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!dossier) return null;

    if (slideIndex === 0) {
      return (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-semibold text-sky-700">
                Diapositiva 1 · Origen, Filosofía y Arquitectura
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                {dossier.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection(dossier.targetSection)}
              className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <span>Abrir simulador</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-lg sm:text-xl text-slate-800 leading-relaxed">
              <p>
                <strong className="text-slate-900">Origen:</strong> {dossier.origin}
              </p>
              <p>
                <strong className="text-slate-900">Filosofía:</strong> {dossier.philosophy}
              </p>
              <p>
                <strong className="text-slate-900">Arquitectura:</strong> {dossier.architectureSummary}
              </p>
            </div>

            <div className="lg:col-span-5 space-y-3">
              {dossier.layers.map((layer, idx) => (
                <div
                  key={layer.label}
                  className={`px-5 py-4 rounded-xl border ${layer.accent} flex items-center justify-between gap-4`}
                >
                  <div>
                    <div className="text-base sm:text-lg font-bold">{layer.label}</div>
                    <div className="text-sm sm:text-base opacity-90 mt-0.5">{layer.detail}</div>
                  </div>
                  <span className="font-mono text-sm font-semibold opacity-75 shrink-0">
                    L{dossier.layers.length - idx}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (slideIndex === 1) {
      return (
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-semibold text-sky-700">
              Diapositiva 2 · {dossier.name} — Conceptos Clave Aplicados
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Procesos, memoria, actualizaciones y seguridad por diseño
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dossier.concepts.map((c) => (
              <div
                key={c.title}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="text-sm sm:text-base font-semibold text-sky-700">{c.concept}</div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">{c.title}</h3>
                  <p className="text-lg text-slate-800 leading-relaxed">{c.explanation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection(dossier.targetSection)}
                  className="text-left text-base font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                  {c.simulatorLinkLabel} →
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-base sm:text-lg font-semibold text-sky-700">
            Diapositiva 3 · {dossier.name} — Impacto y Futuro
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Influencia actual y tendencias futuras
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-3">
            <h3 className="font-display text-2xl font-bold text-slate-900">Influencia actual</h3>
            <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">{dossier.influence}</p>
          </div>

          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-4">
            <h3 className="font-display text-2xl font-bold text-slate-900">Tendencias futuras</h3>
            <ul className="space-y-4">
              {dossier.futureTrends.map((trend) => (
                <li key={trend} className="flex items-start gap-3 text-lg sm:text-xl text-slate-800 leading-relaxed">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-1" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={`max-w-[1360px] mx-auto px-4 lg:px-8 ${presentationMode ? 'py-4 space-y-4' : 'py-8 space-y-8'}`}>
      {/* Header & Sub-navigation */}
      <section
        className={`flex flex-col xl:flex-row justify-between gap-4 border-b border-slate-200 ${
          presentationMode ? 'xl:items-center pb-3' : 'xl:items-end pb-6 gap-6'
        }`}
      >
        {presentationMode ? (
          <div className="flex items-center gap-3">
            <Presentation className="w-5 h-5 text-sky-700 shrink-0" />
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Presentación de Aula · Documentación
            </h1>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-semibold tracking-wide text-sky-700">
              Guía académica y manual operativo del laboratorio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 leading-tight">
              Documentación y Manuales de Usuario
            </h1>
            <p className="text-base sm:text-lg text-slate-700 max-w-3xl leading-relaxed">
              Sistemas operativos emergentes y de nicho: ligereza, especialización, IoT, microkernels,
              actualizaciones silenciosas y seguridad por diseño.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            role="tablist"
            aria-label="Secciones de documentación"
            className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 rounded-xl"
          >
            {(
              [
                { id: 'manual', label: 'Manual de Usuario' },
                { id: 'chromeos', label: 'Chrome OS' },
                { id: 'fuchsia', label: 'Google Fuchsia' },
                { id: 'rtos', label: 'RTOS Embebido' },
              ] as { id: DocsTopic; label: string }[]
            ).map((tab) => {
              const active = topic === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectTopic(tab.id)}
                  className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setPresentationMode((v) => !v);
              setSlideIndex(0);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm sm:text-base font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              presentationMode
                ? 'bg-rose-700 text-white hover:bg-rose-800'
                : 'bg-sky-700 text-white hover:bg-sky-800'
            }`}
          >
            {presentationMode ? (
              <>
                <X className="w-4 h-4" />
                <span>Salir de presentación</span>
              </>
            ) : (
              <>
                <Presentation className="w-4 h-4" />
                <span>Modo Presentación</span>
              </>
            )}
          </button>
        </div>
      </section>

      {presentationMode ? (
        /* VIDEO BEAM SLIDE DECK VIEW */
        <section
          aria-label="Modo presentación para video beam"
          className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 min-h-[calc(100vh-11rem)] flex flex-col justify-between gap-6 shadow-sm"
        >
          <div className="flex-1 flex flex-col justify-center">{renderPresentationSlide()}</div>

          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-base font-mono tabular-nums font-semibold text-slate-600">
              Diapositiva {slideIndex + 1} de {totalSlides} · Usa las flechas ← / →
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={slideIndex === 0}
                onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-semibold rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                disabled={slideIndex === totalSlides - 1}
                onClick={() => setSlideIndex((i) => Math.min(totalSlides - 1, i + 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      ) : topic === 'manual' ? (
        /* CLASSROOM-READABLE USER MANUAL */
        <div className="space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-7 space-y-5">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-sky-700 shrink-0" />
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Cómo usar el Laboratorio de SO Emergentes
                </h2>
              </div>
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
                Esta aplicación funciona como un banco de pruebas único donde los tres sistemas
                operativos comparten un mismo reloj de simulación. Cambia entre pestañas sin perder
                ventanas abiertas, módulos de Fuchsia ni sensores o registros UART.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-100 text-base">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900">Motor compartido en vivo</div>
                  <p className="text-slate-700 leading-relaxed">
                    El botón superior <strong>Pausar / Reanudar motor</strong> congela o reactiva
                    ticks, CPU, mensajes FIDL y el parpadeo del RTOS en todo el laboratorio.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900">Persistencia entre vistas</div>
                  <p className="text-slate-700 leading-relaxed">
                    Las acciones del <strong>Laboratorio de Pruebas</strong> (pestañas pesadas o
                    picos térmicos) se reflejan al instante al entrar a cada monitor.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-7 space-y-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Ejes transversales de estudio
                </h2>
              </div>
              <ul className="space-y-4 text-base sm:text-lg text-slate-800 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-700 shrink-0 mt-1" />
                  <span>
                    <strong className="text-slate-900">Ligereza y especialización:</strong> del
                    escritorio web a firmware RTOS de pocos kilobytes para IoT.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-700 shrink-0 mt-1" />
                  <span>
                    <strong className="text-slate-900">Microkernels e IPC tipado:</strong> menor
                    superficie privilegiada y comunicación estricta por handles.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-1" />
                  <span>
                    <strong className="text-slate-900">Actualizaciones silenciosas y seguridad:</strong>{' '}
                    particiones A/B, Verified Boot, sandboxing, MPU y Watchdog.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Per-Screen User Guides */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <Monitor className="w-5 h-5 text-sky-600 shrink-0" />
                    <span>Manual: Pantalla Chrome OS</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectTopic('chromeos')}
                    className="text-sm font-semibold text-sky-700 hover:underline cursor-pointer shrink-0"
                  >
                    Ver ficha técnica →
                  </button>
                </div>
                <ul className="space-y-2.5 text-base text-slate-800 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Ventanas:</strong> arrastra desde la barra superior, redimensiona en la
                    esquina inferior derecha, minimiza o maximiza.
                  </li>
                  <li>
                    <strong>Navegador y procesos:</strong> pulsa <span className="font-mono">+</span> para
                    abrir pestañas; cada una registra su PID en <strong>Monitor de tareas</strong>{' '}
                    (<kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-sm">Shift+Esc</kbd>).
                  </li>
                  <li>
                    <strong>Estante y bandeja:</strong> lanzador de 6 apps a la izquierda y ajustes
                    rápidos (Wi-Fi, Bluetooth, Brillo) a la derecha.
                  </li>
                  <li>
                    <strong>Terminal Crosh:</strong> usa <span className="font-mono">ps</span>,{' '}
                    <span className="font-mono">free -m</span>, <span className="font-mono">ping 8.8.8.8</span>.
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('chromeos')}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <span>Ir a Chrome OS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <Layers className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Manual: Pantalla Fuchsia</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectTopic('fuchsia')}
                    className="text-sm font-semibold text-rose-700 hover:underline cursor-pointer shrink-0"
                  >
                    Ver ficha técnica →
                  </button>
                </div>
                <ul className="space-y-2.5 text-base text-slate-800 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Stories y Overview:</strong> alterna Stories abajo o abre{' '}
                    <strong>Overview</strong> para crear nuevas Stories modulares.
                  </li>
                  <li>
                    <strong>Módulos componibles:</strong> usa <strong>Agregar módulo</strong> y
                    reordena con las flechas sin ventanas flotantes.
                  </li>
                  <li>
                    <strong>Panel Componentes:</strong> selecciona cualquier nodo del árbol para
                    ver protocolos FIDL y handles <span className="font-mono">zx::*</span>.
                  </li>
                  <li>
                    <strong>Terminal ffx:</strong> prueba <span className="font-mono">ffx component list</span>{' '}
                    y <span className="font-mono">ffx log</span>.
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('fuchsia')}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <span>Ir a Fuchsia</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <Cpu className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Manual: Sistema Embebido (RTOS)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectTopic('rtos')}
                    className="text-sm font-semibold text-amber-700 hover:underline cursor-pointer shrink-0"
                  >
                    Ver ficha técnica →
                  </button>
                </div>
                <ul className="space-y-2.5 text-base text-slate-800 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Placa física y OLED:</strong> observa LEDs <span className="font-mono">GPIO2</span>,{' '}
                    <span className="font-mono">ALARM</span>, OLED 128×64 y botón{' '}
                    <strong>EN / RST</strong>.
                  </li>
                  <li>
                    <strong>Sensores ADC / PWM:</strong> supera 50 °C para disparar la alarma física o
                    baja de 2.80 V para simular Brownout.
                  </li>
                  <li>
                    <strong>Monitor htop RTOS:</strong> suspende <span className="font-mono">Task_Blink</span>{' '}
                    y observa el LED detenerse al instante.
                  </li>
                  <li>
                    <strong>Consola UART0:</strong> ejecuta <span className="font-mono">tasks</span>,{' '}
                    <span className="font-mono">blink 200</span>, <span className="font-mono">panic</span>.
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('rtos')}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <span>Ir a RTOS Embebido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2.5">
                  <Terminal className="w-5 h-5 text-slate-700 shrink-0" />
                  <span>Manual: Laboratorio de Pruebas</span>
                </h3>
                <ul className="space-y-2.5 text-base text-slate-800 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Suite arquitectónica:</strong> pulsa <strong>Ejecutar toda la suite</strong>{' '}
                    para validar 6 aserciones en vivo sobre los tres sistemas.
                  </li>
                  <li>
                    <strong>Inyección de fallos:</strong> genera 3 pestañas pesadas, ráfaga FIDL de 25
                    mensajes, pico de 68.5 °C o Stack Overflow.
                  </li>
                  <li>
                    <strong>Telemetría comparada:</strong> contrasta procesos en MB, VMOs y pilas
                    SRAM en KB en una tabla en tiempo real.
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('pruebas')}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <span>Ir al Laboratorio de Pruebas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          </section>
        </div>
      ) : (
        /* CLASSROOM-READABLE OS TECHNICAL DOSSIER */
        dossier && (
          <div className="space-y-8">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-sm font-semibold text-sky-700">
                        01. Origen, filosofía y arquitectura
                      </p>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                        {dossier.name}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection(dossier.targetSection)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <span>Abrir simulador</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                    {dossier.tagline}
                  </p>

                  <div className="space-y-3.5 text-base sm:text-lg text-slate-800 leading-relaxed">
                    <div>
                      <strong className="text-slate-900">Origen: </strong>
                      {dossier.origin}
                    </div>
                    <div>
                      <strong className="text-slate-900">Filosofía: </strong>
                      {dossier.philosophy}
                    </div>
                    <div>
                      <strong className="text-slate-900">Arquitectura: </strong>
                      {dossier.architectureSummary}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Pila arquitectónica de {dossier.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Separación de responsabilidades de interfaz a hardware
                  </p>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {dossier.layers.map((layer, idx) => (
                    <div
                      key={layer.label}
                      className={`px-4 py-3.5 rounded-xl border ${layer.accent} flex items-center justify-between gap-3`}
                    >
                      <div className="min-w-0">
                        <div className="text-base font-bold">{layer.label}</div>
                        <div className="text-sm opacity-90 mt-0.5">{layer.detail}</div>
                      </div>
                      <span className="font-mono text-sm font-semibold opacity-75 shrink-0">
                        L{dossier.layers.length - idx}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-sky-700">
                  02. Aplicación de conceptos clave de sistemas operativos
                </p>
                <h2 className="font-display text-2xl font-bold text-slate-900 mt-0.5">
                  Procesos, memoria, actualizaciones y seguridad por diseño
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dossier.concepts.map((c) => (
                  <article
                    key={c.title}
                    className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-2.5">
                      <div className="text-sm font-semibold text-slate-500">{c.concept}</div>
                      <h3 className="font-display text-xl font-bold text-slate-900">{c.title}</h3>
                      <p className="text-base text-slate-800 leading-relaxed">{c.explanation}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection(dossier.targetSection)}
                      className="text-left text-sm font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
                    >
                      {c.simulatorLinkLabel} →
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-7 space-y-3">
                <p className="text-sm font-semibold text-sky-700">03. Impacto actual</p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Influencia en la industria
                </h2>
                <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
                  {dossier.influence}
                </p>
              </div>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-7 space-y-4">
                <p className="text-sm font-semibold text-sky-700">Evolución y proyección</p>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Tendencias futuras
                </h2>
                <ul className="space-y-3 pt-1">
                  {dossier.futureTrends.map((trend) => (
                    <li
                      key={trend}
                      className="flex items-start gap-3 text-base sm:text-lg text-slate-800 leading-relaxed"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )
      )}
    </main>
  );
};
