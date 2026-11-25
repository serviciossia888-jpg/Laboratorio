export type PresentationOsId = 'chromeos' | 'fuchsia' | 'rtos';

export interface SlideArtSpec {
  slideNumber: number;
  topicTitle: string;
  graphicType: string;
  textAdaptation: string;
  layoutDistribution: string;
  prompt: string;
}

export const PRESENTATION_SLIDE_COUNT = 7;

export const SLIDE_ART_CATALOG: Record<PresentationOsId, SlideArtSpec[]> = {
  chromeos: [
    {
      slideNumber: 1,
      topicTitle: 'Chrome OS — Origen, Filosofía y Arquitectura',
      graphicType: 'Línea de tiempo evolutiva de 3 etapas',
      textAdaptation:
        'Convierte Origen (2009–2011), Filosofía (nube y arranque rápido) y Arquitectura (Linux + Ash + Renderer aislado) en tres hitos secuenciales conectados por flechas.',
      layoutDistribution:
        'Texto sintetizado en el 42% izquierdo; infografía horizontal 16:9 ocupando el 58% derecho.',
      prompt:
        'Flat corporate infographic timeline diagram showing three connected horizontal stages with minimal icons: stage 1 "2009-2011", stage 2 "Cloud Minimalism", stage 3 "Ash & Renderer", clean flat vector style, sky blue (#0284c7), soft cyan (#e0f2fe) and dark slate (#0f172a) palette, pure light neutral background, generous margins, short 2-word labels only, 16:9 aspect ratio.',
    },
    {
      slideNumber: 2,
      topicTitle: 'Chrome OS — Pila Arquitectónica (L4 a L1)',
      graphicType: 'Esquema jerárquico de 4 estratos apilados',
      textAdaptation:
        'Traduce cada nivel L4–L1 a un bloque horizontal independiente conectado verticalmente desde la capa visual superior hasta el firmware inferior.',
      layoutDistribution:
        'Lista de capas en el 42% izquierdo; diagrama jerárquico de 4 bloques en el 58% derecho.',
      prompt:
        'Modern flat vector architectural stack infographic with four clean horizontal layered blocks stacked vertically and linked by subtle downward flow arrows: top "L4 Ash UI", second "L3 Tab Sandbox", third "L2 Linux dm-verity", bottom "L1 Firmware A/B", sky blue and deep navy palette on clean white background, crisp typography, max 3 words per block, 16:9 aspect ratio.',
    },
    {
      slideNumber: 3,
      topicTitle: 'Chrome OS — 1. Gestión de procesos (Multi-proceso por pestaña)',
      graphicType: 'Gráfico comparativo de aislamiento en carriles paralelos',
      textAdaptation:
        'Representa tres pestañas en carriles separados con su propio PID y filtro seccomp-bpf; la tercera falla y queda contenida sin detener a las demás.',
      layoutDistribution:
        'Explicación y botón interactivo en el 42% izquierdo; diagrama de aislamiento en el 58% derecho.',
      prompt:
        'Clean vector technical infographic showing three parallel isolated process swimlanes side by side: lane 1 "Tab 1 · PID" green active, lane 2 "Tab 2 · PID" green active, lane 3 "Tab 3 · Kill" isolated inside a dashed containment shield with a red stop badge while lanes 1 and 2 remain unaffected, sky blue (#0284c7) and slate palette on light background, short labels only, 16:9 aspect ratio.',
    },
    {
      slideNumber: 4,
      topicTitle: 'Chrome OS — 2. Actualizaciones silenciosas A/B',
      graphicType: 'Diagrama de flujo cíclico comparativo A/B',
      textAdaptation:
        'Contrapone la partición A (en uso activo) frente a la partición B (descarga y verificación en segundo plano), cerrando el ciclo con el intercambio al reiniciar.',
      layoutDistribution:
        'Texto resumen a la izquierda (42%); flujo comparativo A/B a la derecha (58%).',
      prompt:
        'Flat vector cyclical flow infographic comparing two dual system partitions: left dark slate card "ROOT-A Active" and right sky blue card "ROOT-B Verify" connected by clean curved top and bottom swap arrows leading to a small reboot badge "Next Boot", minimalist corporate design, white background, 3 colors max, short labels, 16:9 aspect ratio.',
    },
    {
      slideNumber: 5,
      topicTitle: 'Chrome OS — 3. Seguridad por diseño (Verified Boot)',
      graphicType: 'Diagrama de flujo secuencial con ruta de validación',
      textAdaptation:
        'Convierte la verificación criptográfica en una cadena lineal de 4 pasos (Firmware → Kernel → dm-verity → Raíz R/O) con desvío automático ante alteración.',
      layoutDistribution:
        'Síntesis conceptual en el 42% izquierdo; flujo de verificación en el 58% derecho.',
      prompt:
        'Minimalist flat vector flowchart infographic depicting a four-step cryptographic boot chain connected by crisp arrows: "Firmware" -> "Kernel Sign" -> "dm-verity" -> "Read-Only Root", plus a lower safety branch arrow labeled "Auto Rollback", sky blue (#0284c7), emerald green (#10b981) and dark slate on pure light background, short 2-word node labels, 16:9 aspect ratio.',
    },
    {
      slideNumber: 6,
      topicTitle: 'Chrome OS — Influencia actual en la industria',
      graphicType: 'Infografía radial de impacto en 2 sectores y 2 beneficios',
      textAdaptation:
        'Enlaza los dos mercados principales (Educación K-12 y Empresas) con los dos impulsores clave (Bajo coste operativo y Mínimo malware).',
      layoutDistribution:
        'Texto editorial a la izquierda (42%); infografía radial a la derecha (58%).',
      prompt:
        'Clean corporate radial infographic with a central sky blue hub "Chrome OS" connected to four flat icon cards: "K-12 Schools", "Enterprise", "Low Cost", "Low Malware", unified sky blue (#0284c7) and slate (#0f172a) vector palette on clean off-white canvas, ample whitespace, max 2 words per node, 16:9 aspect ratio.',
    },
    {
      slideNumber: 7,
      topicTitle: 'Chrome OS — Tendencias futuras',
      graphicType: 'Infografía de 3 tarjetas visuales conectadas en ruta evolutiva',
      textAdaptation:
        'Sintetiza cada tendencia futura en una tarjeta iconográfica progresiva: Sostenibilidad (Flex), Cómputo local (Crostini / WebGPU) y Nube segura (Zero-Trust).',
      layoutDistribution:
        'Lista de 3 tendencias en el 42% izquierdo; ruta visual en 3 pilares en el 58% derecho.',
      prompt:
        'Modern flat vector roadmap infographic showing three ascending connected milestone cards with minimalist icons: card 1 "ChromeOS Flex", card 2 "Crostini & AI", card 3 "Zero-Trust", sky blue (#0284c7), emerald (#10b981) and deep slate palette on bright clean background, short labels only, 16:9 aspect ratio.',
    },
  ],
  fuchsia: [
    {
      slideNumber: 1,
      topicTitle: 'Google Fuchsia — Origen, Filosofía y Arquitectura',
      graphicType: 'Diagrama conceptual de 3 pilares conectados',
      textAdaptation:
        'Transforma el origen sin Linux (2016), la filosofía sin usuario root y la arquitectura Zircon+FIDL+Stories en tres nodos interconectados de izquierda a derecha.',
      layoutDistribution:
        'Resumen en el 42% izquierdo; esquema conceptual de 3 nodos en el 58% derecho.',
      prompt:
        'Clean flat vector conceptual infographic with three connected geometric nodes representing a modern microkernel OS: node 1 "2016 · Zero Linux", node 2 "No Root · Handles", node 3 "Zircon & Stories", rose magenta (#e11d48), blush (#ffe4e6) and deep slate (#0f172a) palette on white background, crisp lines, short labels, 16:9 aspect ratio.',
    },
    {
      slideNumber: 2,
      topicTitle: 'Google Fuchsia — Pila Arquitectónica (Zircon a Stories)',
      graphicType: 'Esquema modular de 4 capas jerárquicas',
      textAdaptation:
        'Ordena las 4 capas desde el microkernel Zircon en la base hasta Flatland UI y Stories arriba, destacando la comunicación por FIDL y manifiestos .cml.',
      layoutDistribution:
        'Capas L4–L1 en el 42% izquierdo; esquema modular apilado en el 58% derecho.',
      prompt:
        'Minimalist flat vector layered architecture infographic with four distinct horizontal modular blocks stacked cleanly: top "L4 Stories UI", "L3 Component v2", "L2 FIDL Handles", bottom "L1 Zircon Core", rose (#e11d48) and deep slate (#0f172a) accents on clean light gray-white background, max 3 words per layer, 16:9 aspect ratio.',
    },
    {
      slideNumber: 3,
      topicTitle: 'Google Fuchsia — 1. Arquitectura Microkernel',
      graphicType: 'Diagrama radial núcleo-periferia (User-Space)',
      textAdaptation:
        'Sitúa un núcleo Zircon compacto en el centro y desplaza Red, Audio y Almacenamiento al anillo exterior comunicados mediante canales IPC.',
      layoutDistribution:
        'Explicación en el 42% izquierdo; diagrama radial microkernel en el 58% derecho.',
      prompt:
        'Flat vector radial architecture diagram featuring a compact dark slate center circle "Zircon" surrounded by an outer user-space ring with three separated nodes "Network", "Audio", "Storage" connected via crisp rose (#e11d48) IPC message arrows, bright clean background, high negative space, 16:9 aspect ratio.',
    },
    {
      slideNumber: 4,
      topicTitle: 'Google Fuchsia — 2. Seguridad por capacidades (Zircon Handles)',
      graphicType: 'Gráfico comparativo de control de acceso',
      textAdaptation:
        'Compara visualmente la ruta global bloqueada (sin root ni rutas globales) contra la concesión explícita mediante Handle `0x01a4` con derechos acotados.',
      layoutDistribution:
        'Texto y acceso al visor en el 42% izquierdo; comparativa visual de permisos en el 58% derecho.',
      prompt:
        'Clean split comparison vector infographic: top banned path showing crossed-out "Global Root" badge, bottom active path showing "Component" -> key icon "Handle 0x01a4" -> "Scoped Access" with READ/WRITE tags, rose magenta (#e11d48) and slate (#0f172a) on white background, crisp flat iconography, 16:9 aspect ratio.',
    },
    {
      slideNumber: 5,
      topicTitle: 'Google Fuchsia — 3. Memoria y actualizaciones (VMOs y BlobFS)',
      graphicType: 'Infografía dividida: Zero-Copy VMO + Paquetes Atómicos',
      textAdaptation:
        'Divide el gráfico en dos bloques funcionales: memoria compartida sin copias (`zx::vmo`) arriba y actualización atómica mediante paquetes inmutables `BlobFS` abajo.',
      layoutDistribution:
        'Descripción a la izquierda (42%); infografía dual VMO/BlobFS a la derecha (58%).',
      prompt:
        'Modern two-tier corporate vector infographic: upper diagram shows two component cards pointing to one central shared memory block "zx::vmo Zero-Copy", lower diagram shows sealed hexagonal package blocks "BlobFS Atomic", rose (#e11d48), blush and deep slate on clean off-white canvas, concise labels, 16:9 aspect ratio.',
    },
    {
      slideNumber: 6,
      topicTitle: 'Google Fuchsia — Influencia actual en la industria',
      graphicType: 'Infografía de caso en producción con 2 ejes de valor',
      textAdaptation:
        'Coloca el hardware en producción (Nest Hub) como nodo central conectado a su despliegue real y su rol como referente en capacidades.',
      layoutDistribution:
        'Texto editorial en el 42% izquierdo; infografía de despliegue real en el 58% derecho.',
      prompt:
        'Minimalist flat vector infographic centered on a clean smart display icon labeled "Nest Hub" connected to two flanking value badges: "Live Production" and "Capability Model", rose (#e11d48) and dark slate (#0f172a) color scheme on light neutral background, generous whitespace, 16:9 aspect ratio.',
    },
    {
      slideNumber: 7,
      topicTitle: 'Google Fuchsia — Tendencias futuras',
      graphicType: 'Matriz infográfica de 3 tarjetas hexagonales conectadas',
      textAdaptation:
        'Convierte las tres líneas futuras en tres bloques modulares enlazados: Drivers v2 en espacio de usuario, expansión IoT y desarrollo seguro en Rust.',
      layoutDistribution:
        'Tres tendencias listadas a la izquierda (42%); matriz de 3 nodos a la derecha (58%).',
      prompt:
        'Clean flat vector three-pillar infographic displaying three connected modular cards with minimal tech icons: "Driver v2", "IoT Modular", "Rust Safety", harmonious rose magenta (#e11d48) and deep slate (#0f172a) palette on white background, crisp geometry, max 2 words per card, 16:9 aspect ratio.',
    },
  ],
  rtos: [
    {
      slideNumber: 1,
      topicTitle: 'RTOS Embebido — Origen, Filosofía y Arquitectura',
      graphicType: 'Diagrama comparativo de evolución y flujo en tiempo real',
      textAdaptation:
        'Muestra el salto del bucle único (`Super-Loop`) hacia el kernel RTOS determinista (`FreeRTOS / Zephyr`) con acceso directo a periféricos MCU sin MMU.',
      layoutDistribution:
        'Origen, filosofía y arquitectura a la izquierda (42%); esquema evolutivo a la derecha (58%).',
      prompt:
        'Clean flat engineering infographic showing progression from "Super-Loop" to "RTOS Kernel" connected to hardware blocks "GPIO · ADC · UART", warm amber (#d97706), emerald green (#059669) and dark slate (#0f172a) palette on clean off-white background, flat vector style, short labels only, 16:9 aspect ratio.',
    },
    {
      slideNumber: 2,
      topicTitle: 'RTOS Embebido — Pila Arquitectónica (Tareas a MCU)',
      graphicType: 'Esquema jerárquico compacto de 4 niveles',
      textAdaptation:
        'Apila las 4 capas de hardware-cercano (Tareas → Scheduler/IPC → HAL/ISR → Hardware MCU) mostrando latencia mínima hacia pines y SRAM.',
      layoutDistribution:
        'Capas L4–L1 a la izquierda (42%); diagrama de estratos embebidos a la derecha (58%).',
      prompt:
        'Flat vector four-layer embedded system architecture diagram stacked vertically: top "L4 Tasks", "L3 Scheduler IPC", "L2 HAL & ISR", bottom "L1 MCU 520KB", amber (#d97706) and deep forest emerald (#064e3b) palette on clean white background, crisp arrows, 3 words max per block, 16:9 aspect ratio.',
    },
    {
      slideNumber: 3,
      topicTitle: 'RTOS Embebido — 1. Planificación determinista',
      graphicType: 'Línea temporal de preempción por prioridades',
      textAdaptation:
        'Grafica cómo una tarea READY de alta prioridad interrumpe en menos de 10 µs a tareas menores para controlar al instante el LED GPIO2.',
      layoutDistribution:
        'Concepto y botón htop RTOS a la izquierda (42%); línea de tiempo preemptiva a la derecha (58%).',
      prompt:
        'Minimalist flat vector timing chart infographic showing three horizontal task tracks ("High Priority", "Sensor Task", "Idle") where a vertical trigger line marked "< 10 us" switches CPU immediately to the amber high-priority bar connected to "GPIO2 LED", white background, clean engineering lines, 16:9 aspect ratio.',
    },
    {
      slideNumber: 4,
      topicTitle: 'RTOS Embebido — 2. Memoria sin MMU (Pilas estáticas)',
      graphicType: 'Gráfico comparativo de particionamiento fijo en SRAM',
      textAdaptation:
        'Visualiza la SRAM física dividida en bloques fijos en kilobytes por tarea con una línea umbral crítica que dispara Watchdog ante Stack Overflow.',
      layoutDistribution:
        'Texto explicativo a la izquierda (42%); mapa visual de SRAM estática a la derecha (58%).',
      prompt:
        'Clean engineering flat vector bar infographic of a physical "SRAM Pool" divided into fixed static stack columns ("Task A 1KB", "Task B 1KB", "Task C 2KB") beneath a dashed red top limit line labeled "Overflow Limit", emerald (#059669), amber (#d97706) and slate on clean light background, 16:9 aspect ratio.',
    },
    {
      slideNumber: 5,
      topicTitle: 'RTOS Embebido — 3. Seguridad en IoT (MPU, Watchdog y OTA)',
      graphicType: 'Infografía de 3 mecanismos de protección alrededor del MCU',
      textAdaptation:
        'Convierte las tres defensas en tres módulos de seguridad enlazados al microcontrolador: aislamiento MPU, reinicio por Watchdog y actualización OTA firmada.',
      layoutDistribution:
        'Concepto y enlace térmico/Watchdog a la izquierda (42%); esquema de 3 escudos a la derecha (58%).',
      prompt:
        'Flat vector security infographic centering a minimalist microcontroller icon surrounded by three distinct protective badge cards: "MPU Regions", "HW Watchdog", "Signed OTA", warm amber (#d97706), emerald (#059669) and dark slate on clean white background, concise 2-word labels, 16:9 aspect ratio.',
    },
    {
      slideNumber: 6,
      topicTitle: 'RTOS Embebido — Influencia actual en la industria',
      graphicType: 'Infografía radial de 4 sectores conectados al núcleo IoT',
      textAdaptation:
        'Conecta el núcleo embebido central con los cuatro ámbitos de aplicación real: Domótica, Sensores Industriales, Equipos Médicos y Satélites/Automoción.',
      layoutDistribution:
        'Impacto industrial a la izquierda (42%); diagrama radial de 4 sectores a la derecha (58%).',
      prompt:
        'Clean flat vector radial infographic with a central emerald microchip hub "RTOS Core" linked to four minimalist flat icon cards: "Smart Home", "Industrial", "Medical", "Aerospace", amber (#d97706) and emerald (#059669) on bright off-white background, wide negative space, short labels, 16:9 aspect ratio.',
    },
    {
      slideNumber: 7,
      topicTitle: 'RTOS Embebido — Tendencias futuras',
      graphicType: 'Infografía de 3 tarjetas de hoja de ruta tecnológica',
      textAdaptation:
        'Resume las tres tendencias en tres pilares visuales paralelos: Estándar Zephyr (ARM/RISC-V), IA en el borde (TinyML mW) y Arranque seguro (TrustZone/PSA).',
      layoutDistribution:
        'Lista de tendencias a la izquierda (42%); tres pilares de proyección a la derecha (58%).',
      prompt:
        'Modern flat vector roadmap infographic with three aligned vertical feature cards and clean icons: "Zephyr RISC-V", "TinyML Edge", "TrustZone OTA", cohesive emerald green (#059669), warm amber (#d97706) and deep slate palette on pure light neutral background, concise labels, 16:9 aspect ratio.',
    },
  ],
};
