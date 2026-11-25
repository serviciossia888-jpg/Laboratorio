import React from 'react';
import { PresentationOsId } from '../engine/presentationArt';

interface SlideVisualArtProps {
  osId: PresentationOsId;
  slideIndex: number;
}

export const SlideVisualArt: React.FC<SlideVisualArtProps> = ({ osId, slideIndex }) => {
  const renderArtwork = () => {
    if (osId === 'chromeos') {
      switch (slideIndex) {
        case 0:
          // Diapositiva 1: Línea de tiempo evolutiva de 3 etapas
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía evolutiva de Chrome OS: 2009-2011, Nube y Ash/Renderer">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              {/* Línea de flujo */}
              <line x1="120" y1="168" x2="520" y2="168" stroke="#bae6fd" strokeWidth="5" strokeLinecap="round" />
              <polygon points="262,168 250,160 250,176" fill="#0284c7" />
              <polygon points="444,168 432,160 432,176" fill="#0284c7" />

              {/* Hito 1: Origen */}
              <rect x="44" y="100" width="166" height="144" rx="16" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="127" cy="136" r="18" fill="#e0f2fe" />
              <circle cx="127" cy="136" r="7" fill="#0284c7" />
              <text x="127" y="178" textAnchor="middle" fill="#0284c7" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">2009 · 2011</text>
              <text x="127" y="202" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">Chromium OS</text>
              <text x="127" y="222" textAnchor="middle" fill="#475569" fontSize="12" fontFamily="system-ui, sans-serif">Base Linux limpia</text>

              {/* Hito 2: Filosofía */}
              <rect x="237" y="100" width="166" height="144" rx="16" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="296" y="120" width="48" height="30" rx="10" fill="#0284c7" />
              <rect x="308" y="128" width="24" height="14" rx="5" fill="#ffffff" />
              <text x="320" y="178" textAnchor="middle" fill="#0284c7" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">FILOSOFÍA</text>
              <text x="320" y="202" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">Nube Ligera</text>
              <text x="320" y="222" textAnchor="middle" fill="#475569" fontSize="12" fontFamily="system-ui, sans-serif">Arranque rápido</text>

              {/* Hito 3: Arquitectura */}
              <rect x="430" y="100" width="166" height="144" rx="16" fill="#0f172a" />
              <rect x="488" y="120" width="50" height="32" rx="6" fill="#38bdf8" />
              <text x="513" y="178" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">ARQUITECTURA</text>
              <text x="513" y="202" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">Ash &amp; Sandbox</text>
              <text x="513" y="222" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="system-ui, sans-serif">1 PID / pestaña</text>
            </svg>
          );
        case 1:
          // Diapositiva 2: Esquema jerárquico de 4 estratos apilados
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Esquema jerárquico de 4 capas de Chrome OS">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              <line x1="320" y1="68" x2="320" y2="292" stroke="#bae6fd" strokeWidth="4" />
              {[
                { y: 40, bg: '#e0f2fe', border: '#0284c7', text: '#0f172a', code: 'L4', title: 'Ash UI / Shelf' },
                { y: 112, bg: '#bae6fd', border: '#0284c7', text: '#0f172a', code: 'L3', title: 'Chromium Sandbox' },
                { y: 184, bg: '#e2e8f0', border: '#64748b', text: '#0f172a', code: 'L2', title: 'Linux + dm-verity' },
                { y: 256, bg: '#0f172a', border: '#0f172a', text: '#ffffff', code: 'L1', title: 'Firmware & A/B' },
              ].map((row) => (
                <g key={row.code}>
                  <rect x="110" y={row.y} width="420" height="54" rx="14" fill={row.bg} stroke={row.border} strokeWidth="2.5" />
                  <rect x="128" y={row.y + 13} width="44" height="28" rx="7" fill={row.code === 'L1' ? '#0284c7' : '#ffffff'} />
                  <text x="150" y={row.y + 32} textAnchor="middle" fill={row.code === 'L1' ? '#ffffff' : '#0284c7'} fontSize="13" fontWeight="800" fontFamily="monospace">{row.code}</text>
                  <text x="192" y={row.y + 33} fill={row.text} fontSize="17" fontWeight="700" fontFamily="system-ui, sans-serif">{row.title}</text>
                </g>
              ))}
            </svg>
          );
        case 2:
          // Diapositiva 3: Carriles paralelos de aislamiento por pestaña
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía de carriles paralelos por pestaña en Chrome OS">
              <rect width="640" height="360" rx="20" fill="#f0f9ff" />
              {/* Carril 1 */}
              <rect x="52" y="72" width="164" height="216" rx="18" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="74" y="96" width="120" height="30" rx="8" fill="#0284c7" />
              <text x="134" y="116" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Tab 1 · PID</text>
              <text x="134" y="168" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">seccomp-bpf</text>
              <rect x="86" y="218" width="96" height="34" rx="10" fill="#dcfce7" />
              <text x="134" y="240" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">ACTIVO</text>

              {/* Carril 2 */}
              <rect x="238" y="72" width="164" height="216" rx="18" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="260" y="96" width="120" height="30" rx="8" fill="#0284c7" />
              <text x="320" y="116" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Tab 2 · PID</text>
              <text x="320" y="168" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">seccomp-bpf</text>
              <rect x="272" y="218" width="96" height="34" rx="10" fill="#dcfce7" />
              <text x="320" y="240" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">ACTIVO</text>

              {/* Carril 3 aislado */}
              <rect x="424" y="72" width="164" height="216" rx="18" fill="#f8fafc" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="7 5" />
              <rect x="446" y="96" width="120" height="30" rx="8" fill="#64748b" />
              <text x="506" y="116" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Tab 3 · Kill</text>
              <text x="506" y="168" textAnchor="middle" fill="#475569" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Fallo aislado</text>
              <rect x="458" y="218" width="96" height="34" rx="10" fill="#ffe4e6" />
              <text x="506" y="240" textAnchor="middle" fill="#be123c" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">CONTENIDO</text>
            </svg>
          );
        case 3:
          // Diapositiva 4: Flujo cíclico comparativo A/B
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Diagrama cíclico de actualizaciones silenciosas A/B">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              {/* Partición A */}
              <rect x="66" y="106" width="198" height="148" rx="18" fill="#0f172a" />
              <text x="165" y="144" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="800" fontFamily="monospace">ROOT-A</text>
              <text x="165" y="176" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="700" fontFamily="system-ui, sans-serif">Sistema Activo</text>
              <rect x="106" y="198" width="118" height="28" rx="8" fill="#0284c7" />
              <text x="165" y="217" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">En uso · 0 pausas</text>

              {/* Partición B */}
              <rect x="376" y="106" width="198" height="148" rx="18" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
              <text x="475" y="144" textAnchor="middle" fill="#0284c7" fontSize="14" fontWeight="800" fontFamily="monospace">ROOT-B</text>
              <text x="475" y="176" textAnchor="middle" fill="#0f172a" fontSize="17" fontWeight="700" fontFamily="system-ui, sans-serif">update_engine</text>
              <rect x="416" y="198" width="118" height="28" rx="8" fill="#dcfce7" />
              <text x="475" y="217" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">Descarga + Firma</text>

              {/* Flechas de conmutación */}
              <path d="M272 90c32-24 64-24 96 0" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
              <polygon points="374,92 358,93 367,79" fill="#0284c7" />
              <text x="320" y="60" textAnchor="middle" fill="#0284c7" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">2° Plano</text>

              <path d="M368 272c-32 24-64 24-96 0" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <polygon points="266,270 282,269 273,283" fill="#10b981" />
              <text x="320" y="318" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Cambio al reiniciar</text>
            </svg>
          );
        case 4:
          // Diapositiva 5: Flujo de validación Verified Boot
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Flujo secuencial Verified Boot y dm-verity">
              <rect width="640" height="360" rx="20" fill="#f0f9ff" />
              <line x1="110" y1="150" x2="530" y2="150" stroke="#0284c7" strokeWidth="4" />
              {[
                { x: 46, title: 'Firmware', sub: 'Llave raíz' },
                { x: 186, title: 'Kernel', sub: 'Firma digital' },
                { x: 326, title: 'dm-verity', sub: 'Bloque a bloque' },
                { x: 466, title: 'Raíz R/O', sub: 'Inmutable' },
              ].map((step) => (
                <g key={step.title}>
                  <rect x={step.x} y="108" width="128" height="84" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                  <text x={step.x + 64} y="144" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif">{step.title}</text>
                  <text x={step.x + 64} y="168" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">{step.sub}</text>
                </g>
              ))}
              {/* Rama de reversión */}
              <path d="M390 192v58H210" fill="none" stroke="#e11d48" strokeWidth="3" strokeDasharray="6 4" />
              <rect x="130" y="230" width="210" height="44" rx="12" fill="#0f172a" />
              <text x="235" y="257" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Alteración → Auto-Reversión</text>
            </svg>
          );
        case 5:
          // Diapositiva 6: Infografía radial de influencia actual
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía radial de impacto actual de Chrome OS">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              <line x1="320" y1="180" x2="152" y2="96" stroke="#7dd3fc" strokeWidth="3.5" />
              <line x1="320" y1="180" x2="488" y2="96" stroke="#7dd3fc" strokeWidth="3.5" />
              <line x1="320" y1="180" x2="152" y2="264" stroke="#7dd3fc" strokeWidth="3.5" />
              <line x1="320" y1="180" x2="488" y2="264" stroke="#7dd3fc" strokeWidth="3.5" />

              <circle cx="320" cy="180" r="56" fill="#0f172a" />
              <text x="320" y="176" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif">Chrome OS</text>
              <text x="320" y="196" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">Impacto</text>

              {[
                { x: 64, y: 58, t: 'Educación K-12', s: 'Adopción masiva' },
                { x: 400, y: 58, t: 'Empresas', s: 'Flota gestionada' },
                { x: 64, y: 230, t: 'Bajo Coste', s: 'Cero soporte pesado' },
                { x: 400, y: 230, t: 'Mínimo Malware', s: 'Raíz protegida' },
              ].map((card) => (
                <g key={card.t}>
                  <rect x={card.x} y={card.y} width="176" height="72" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                  <text x={card.x + 88} y={card.y + 32} textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif">{card.t}</text>
                  <text x={card.x + 88} y={card.y + 52} textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">{card.s}</text>
                </g>
              ))}
            </svg>
          );
        default:
          // Diapositiva 7: Ruta evolutiva de 3 tarjetas
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Tres tarjetas de tendencias futuras en Chrome OS">
              <rect width="640" height="360" rx="20" fill="#f0f9ff" />
              <line x1="130" y1="180" x2="510" y2="180" stroke="#0284c7" strokeWidth="4" />
              {[
                { x: 44, y: 120, tag: 'SOSTENIBILIDAD', title: 'ChromeOS Flex', sub: 'PCs reciclados', accent: '#059669' },
                { x: 237, y: 98, tag: 'CÓMPUTO LOCAL', title: 'Crostini & IA', sub: 'WebGPU · NPU', accent: '#0284c7' },
                { x: 430, y: 76, tag: 'SEGURIDAD', title: 'Zero-Trust', sub: 'Servicios nube', accent: '#0f172a' },
              ].map((c) => (
                <g key={c.title}>
                  <rect x={c.x} y={c.y} width="166" height="164" rx="16" fill="#ffffff" stroke={c.accent} strokeWidth="3" />
                  <rect x={c.x + 18} y={c.y + 22} width="130" height="24" rx="6" fill={c.accent} />
                  <text x={c.x + 83} y={c.y + 38} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">{c.tag}</text>
                  <text x={c.x + 83} y={c.y + 88} textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">{c.title}</text>
                  <text x={c.x + 83} y={c.y + 114} textAnchor="middle" fill="#475569" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">{c.sub}</text>
                </g>
              ))}
            </svg>
          );
      }
    }

    if (osId === 'fuchsia') {
      switch (slideIndex) {
        case 0:
          // Diapositiva 1: 3 pilares conceptuales
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía de origen, filosofía y arquitectura de Google Fuchsia">
              <rect width="640" height="360" rx="20" fill="#fff1f2" />
              <line x1="120" y1="176" x2="520" y2="176" stroke="#fda4af" strokeWidth="5" />
              <rect x="44" y="102" width="166" height="148" rx="16" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
              <text x="127" y="146" textAnchor="middle" fill="#e11d48" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">2016 · DESDE CERO</text>
              <text x="127" y="178" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">Sin Linux</text>
              <text x="127" y="204" textAnchor="middle" fill="#475569" fontSize="12" fontFamily="system-ui, sans-serif">Cero legado POSIX</text>

              <rect x="237" y="102" width="166" height="148" rx="16" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
              <text x="320" y="146" textAnchor="middle" fill="#e11d48" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">FILOSOFÍA</text>
              <text x="320" y="178" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">Cero Root</text>
              <text x="320" y="204" textAnchor="middle" fill="#475569" fontSize="12" fontFamily="system-ui, sans-serif">Solo Handles</text>

              <rect x="430" y="102" width="166" height="148" rx="16" fill="#0f172a" />
              <text x="513" y="146" textAnchor="middle" fill="#fb7185" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">ARQUITECTURA</text>
              <text x="513" y="178" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">Zircon &amp; FIDL</text>
              <text x="513" y="204" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="system-ui, sans-serif">UI en Stories</text>
            </svg>
          );
        case 1:
          // Diapositiva 2: Esquema modular de 4 capas
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Esquema modular de 4 capas en Google Fuchsia">
              <rect width="640" height="360" rx="20" fill="#fff1f2" />
              <line x1="320" y1="68" x2="320" y2="292" stroke="#fda4af" strokeWidth="4" />
              {[
                { y: 40, bg: '#ffffff', border: '#e11d48', text: '#0f172a', code: 'L4', title: 'Stories & Flatland UI' },
                { y: 112, bg: '#ffe4e6', border: '#e11d48', text: '#0f172a', code: 'L3', title: 'Component Framework v2' },
                { y: 184, bg: '#f1f5f9', border: '#64748b', text: '#0f172a', code: 'L2', title: 'FIDL & Zircon Handles' },
                { y: 256, bg: '#0f172a', border: '#0f172a', text: '#ffffff', code: 'L1', title: 'Microkernel Zircon' },
              ].map((row) => (
                <g key={row.code}>
                  <rect x="106" y={row.y} width="428" height="54" rx="14" fill={row.bg} stroke={row.border} strokeWidth="2.5" />
                  <rect x="124" y={row.y + 13} width="44" height="28" rx="7" fill={row.code === 'L1' ? '#e11d48' : '#ffffff'} />
                  <text x="146" y={row.y + 32} textAnchor="middle" fill={row.code === 'L1' ? '#ffffff' : '#e11d48'} fontSize="13" fontWeight="800" fontFamily="monospace">{row.code}</text>
                  <text x="188" y={row.y + 33} fill={row.text} fontSize="17" fontWeight="700" fontFamily="system-ui, sans-serif">{row.title}</text>
                </g>
              ))}
            </svg>
          );
        case 2:
          // Diapositiva 3: Diagrama radial núcleo-espacio de usuario
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Diagrama radial de microkernel Zircon y drivers en espacio de usuario">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              <circle cx="320" cy="180" r="118" fill="none" stroke="#fecdd3" strokeWidth="3" strokeDasharray="8 6" />
              <line x1="320" y1="180" x2="320" y2="66" stroke="#e11d48" strokeWidth="3" />
              <line x1="320" y1="180" x2="188" y2="256" stroke="#e11d48" strokeWidth="3" />
              <line x1="320" y1="180" x2="452" y2="256" stroke="#e11d48" strokeWidth="3" />

              {/* Zircon mínimo */}
              <circle cx="320" cy="180" r="52" fill="#0f172a" />
              <text x="320" y="176" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif">Zircon</text>
              <text x="320" y="196" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">Núcleo Mínimo</text>

              {/* Drivers user-space */}
              {[
                { x: 254, y: 34, label: 'Red (IPC)' },
                { x: 112, y: 230, label: 'Audio (User)' },
                { x: 396, y: 230, label: 'Disco (BlobFS)' },
              ].map((node) => (
                <g key={node.label}>
                  <rect x={node.x} y={node.y} width="132" height="48" rx="12" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
                  <text x={node.x + 66} y={node.y + 29} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">{node.label}</text>
                </g>
              ))}
            </svg>
          );
        case 3:
          // Diapositiva 4: Comparativa sin root vs Handle explícito
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Comparativa de permisos globales bloqueados frente a Zircon Handle explícito">
              <rect width="640" height="360" rx="20" fill="#fff1f2" />
              {/* Arriba: Ruta global bloqueada */}
              <rect x="64" y="56" width="512" height="90" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
              <rect x="88" y="80" width="144" height="42" rx="10" fill="#f1f5f9" />
              <text x="160" y="106" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Ruta Global /root</text>
              <line x1="254" y1="101" x2="366" y2="101" stroke="#cbd5e1" strokeWidth="3" />
              <rect x="384" y="80" width="166" height="42" rx="10" fill="#ffe4e6" />
              <text x="467" y="106" textAnchor="middle" fill="#be123c" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">✕ BLOQUEADO</text>

              {/* Abajo: Handle explícito */}
              <rect x="64" y="182" width="512" height="122" rx="18" fill="#ffffff" stroke="#e11d48" strokeWidth="3" />
              <rect x="88" y="218" width="132" height="50" rx="12" fill="#0f172a" />
              <text x="154" y="248" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Componente</text>
              <line x1="220" y1="243" x2="420" y2="243" stroke="#e11d48" strokeWidth="4" />
              <rect x="252" y="214" width="136" height="58" rx="12" fill="#e11d48" />
              <text x="320" y="239" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="monospace">Handle 0x01a4</text>
              <text x="320" y="259" textAnchor="middle" fill="#ffe4e6" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">READ · WRITE</text>
              <rect x="420" y="218" width="132" height="50" rx="12" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
              <text x="486" y="248" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">Acceso Acotado</text>
            </svg>
          );
        case 4:
          // Diapositiva 5: Infografía dual Zero-Copy VMO + BlobFS
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía de memoria compartida VMO y paquetes BlobFS">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              {/* Nivel superior: Zero-Copy VMO */}
              <rect x="52" y="46" width="536" height="148" rx="18" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
              <text x="80" y="78" fill="#e11d48" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">MEMORIA COMPARTIDA ZERO-COPY</text>
              <rect x="82" y="104" width="124" height="58" rx="12" fill="#0f172a" />
              <text x="144" y="138" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Productor</text>
              <line x1="206" y1="133" x2="254" y2="133" stroke="#e11d48" strokeWidth="3.5" />
              <rect x="254" y="100" width="132" height="66" rx="12" fill="#e11d48" />
              <text x="320" y="131" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800" fontFamily="monospace">zx::vmo</text>
              <text x="320" y="151" textAnchor="middle" fill="#ffe4e6" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">Sin copias extra</text>
              <line x1="386" y1="133" x2="434" y2="133" stroke="#e11d48" strokeWidth="3.5" />
              <rect x="434" y="104" width="124" height="58" rx="12" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
              <text x="496" y="138" textAnchor="middle" fill="#881337" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">Reproductor</text>

              {/* Nivel inferior: BlobFS */}
              <rect x="52" y="214" width="536" height="102" rx="18" fill="#0f172a" />
              <text x="80" y="246" fill="#fb7185" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">PAQUETES INMUTABLES</text>
              <rect x="80" y="262" width="156" height="36" rx="8" fill="#1e293b" />
              <text x="158" y="285" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">BlobFS Hash</text>
              <rect x="256" y="262" width="156" height="36" rx="8" fill="#e11d48" />
              <text x="334" y="285" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Update Atómico</text>
              <rect x="432" y="262" width="132" height="36" rx="8" fill="#059669" />
              <text x="498" y="285" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Verificado</text>
            </svg>
          );
        case 5:
          // Diapositiva 6: Infografía Nest Hub + 2 ejes
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía de impacto actual de Google Fuchsia en Nest Hub">
              <rect width="640" height="360" rx="20" fill="#fff1f2" />
              <line x1="208" y1="180" x2="432" y2="180" stroke="#fda4af" strokeWidth="4" />
              {/* Izquierda */}
              <rect x="46" y="120" width="166" height="120" rx="16" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
              <text x="129" y="168" textAnchor="middle" fill="#e11d48" fontSize="12" fontWeight="800" fontFamily="system-ui, sans-serif">PRODUCCIÓN</text>
              <text x="129" y="196" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">Hogar Conectado</text>

              {/* Centro: Nest Hub */}
              <rect x="236" y="96" width="168" height="168" rx="20" fill="#0f172a" />
              <rect x="254" y="114" width="132" height="92" rx="10" fill="#e11d48" />
              <text x="320" y="158" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="800" fontFamily="system-ui, sans-serif">Nest Hub</text>
              <text x="320" y="180" textAnchor="middle" fill="#ffe4e6" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">Fuchsia OS</text>
              <rect x="276" y="222" width="88" height="20" rx="6" fill="#334155" />

              {/* Derecha */}
              <rect x="428" y="120" width="166" height="120" rx="16" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
              <text x="511" y="168" textAnchor="middle" fill="#e11d48" fontSize="12" fontWeight="800" fontFamily="system-ui, sans-serif">REFERENTE</text>
              <text x="511" y="196" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">Capacidades</text>
            </svg>
          );
        default:
          // Diapositiva 7: Matriz de 3 tarjetas futuras
          return (
            <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Tres tarjetas de tendencias futuras de Google Fuchsia">
              <rect width="640" height="360" rx="20" fill="#f8fafc" />
              <line x1="130" y1="180" x2="510" y2="180" stroke="#fda4af" strokeWidth="4" />
              {[
                { x: 44, tag: 'ESPACIO USUARIO', title: 'Driver v2', sub: 'Aislado de kernel', border: '#e11d48' },
                { x: 237, tag: 'EXPANSIÓN', title: 'IoT Modular', sub: 'Pantallas y nodos', border: '#fb7185' },
                { x: 430, tag: 'MEMORIA SEGURA', title: 'Lenguaje Rust', sub: 'Servicios críticos', border: '#0f172a' },
              ].map((c) => (
                <g key={c.title}>
                  <rect x={c.x} y="98" width="166" height="164" rx="16" fill="#ffffff" stroke={c.border} strokeWidth="3" />
                  <rect x={c.x + 16} y="120" width="134" height="24" rx="6" fill={c.border} />
                  <text x={c.x + 83} y="136" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">{c.tag}</text>
                  <text x={c.x + 83} y="186" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">{c.title}</text>
                  <text x={c.x + 83} y="212" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">{c.sub}</text>
                </g>
              ))}
            </svg>
          );
      }
    }

    // RTOS Embebido
    switch (slideIndex) {
      case 0:
        // Diapositiva 1: Evolución Super-Loop -> RTOS -> Hardware MCU
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Evolución hacia RTOS determinista y acceso directo a hardware">
            <rect width="640" height="360" rx="20" fill="#fffbeb" />
            <line x1="120" y1="176" x2="520" y2="176" stroke="#fbbf24" strokeWidth="5" />

            <rect x="44" y="102" width="166" height="148" rx="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />
            <text x="127" y="146" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">ANTES</text>
            <text x="127" y="178" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">Super-Loop</text>
            <text x="127" y="204" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="system-ui, sans-serif">Sin prioridad real</text>

            <rect x="237" y="102" width="166" height="148" rx="16" fill="#ffffff" stroke="#d97706" strokeWidth="3" />
            <text x="320" y="146" textAnchor="middle" fill="#d97706" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">2003 · 2016</text>
            <text x="320" y="178" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">FreeRTOS / Zephyr</text>
            <text x="320" y="204" textAnchor="middle" fill="#475569" fontSize="12" fontFamily="system-ui, sans-serif">Tiempo acotado</text>

            <rect x="430" y="102" width="166" height="148" rx="16" fill="#064e3b" />
            <text x="513" y="146" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">SIN MMU</text>
            <text x="513" y="178" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">MCU Directo</text>
            <text x="513" y="204" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontFamily="system-ui, sans-serif">GPIO · I2C · UART</text>
          </svg>
        );
      case 1:
        // Diapositiva 2: Esquema jerárquico de 4 estratos MCU
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Esquema jerárquico de 4 capas en RTOS embebido">
            <rect width="640" height="360" rx="20" fill="#f8fafc" />
            <line x1="320" y1="68" x2="320" y2="292" stroke="#fbbf24" strokeWidth="4" />
            {[
              { y: 40, bg: '#fef3c7', border: '#d97706', text: '#0f172a', code: 'L4', title: 'Tareas de Aplicación' },
              { y: 112, bg: '#1e293b', border: '#334155', text: '#ffffff', code: 'L3', title: 'Núcleo RTOS + Colas' },
              { y: 184, bg: '#0f172a', border: '#0f172a', text: '#6ee7b7', code: 'L2', title: 'HAL · ISR · Periféricos' },
              { y: 256, bg: '#064e3b', border: '#064e3b', text: '#ffffff', code: 'L1', title: 'MCU 520 KB SRAM' },
            ].map((row) => (
              <g key={row.code}>
                <rect x="106" y={row.y} width="428" height="54" rx="14" fill={row.bg} stroke={row.border} strokeWidth="2.5" />
                <rect x="124" y={row.y + 13} width="44" height="28" rx="7" fill="#d97706" />
                <text x="146" y={row.y + 32} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="monospace">{row.code}</text>
                <text x="188" y={row.y + 33} fill={row.text} fontSize="17" fontWeight="700" fontFamily="system-ui, sans-serif">{row.title}</text>
              </g>
            ))}
          </svg>
        );
      case 2:
        // Diapositiva 3: Línea de tiempo preemptiva (< 10 us)
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Gráfico temporal de planificación preemptiva menor a 10 microsegundos">
            <rect width="640" height="360" rx="20" fill="#fffbeb" />
            <text x="58" y="64" fill="#d97706" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">CRONOGRAMA PREEMPTIVO EN TIEMPO REAL</text>

            {/* Carriles */}
            <rect x="56" y="96" width="528" height="48" rx="10" fill="#ffffff" stroke="#fde68a" strokeWidth="2" />
            <text x="74" y="125" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Alta Prioridad</text>
            <rect x="220" y="106" width="136" height="28" rx="7" fill="#d97706" />
            <text x="288" y="125" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="800" fontFamily="system-ui, sans-serif">Task_Blink → LED</text>
            <rect x="430" y="106" width="124" height="28" rx="7" fill="#d97706" />

            <rect x="56" y="164" width="528" height="48" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
            <text x="74" y="193" fill="#0f172a" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Media</text>
            <rect x="148" y="174" width="72" height="28" rx="7" fill="#059669" />
            <rect x="356" y="174" width="74" height="28" rx="7" fill="#059669" />

            <rect x="56" y="232" width="528" height="48" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
            <text x="74" y="261" fill="#64748b" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">Idle</text>
            <rect x="148" y="242" width="406" height="28" rx="7" fill="#cbd5e1" opacity="0.55" />

            {/* Línea de cambio */}
            <line x1="220" y1="82" x2="220" y2="296" stroke="#0f172a" strokeWidth="3" strokeDasharray="5 4" />
            <rect x="172" y="298" width="96" height="28" rx="8" fill="#0f172a" />
            <text x="220" y="317" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="800" fontFamily="monospace">&lt; 10 µs</text>
          </svg>
        );
      case 3:
        // Diapositiva 4: Mapa comparativo de pilas estáticas en SRAM
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Mapa de memoria SRAM estática por tarea con límite de Stack Overflow">
            <rect width="640" height="360" rx="20" fill="#f8fafc" />
            <rect x="74" y="54" width="492" height="252" rx="18" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
            <text x="102" y="86" fill="#0f172a" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">SRAM FÍSICA (SIN MMU NI SWAP)</text>
            {/* Límite Stack Overflow */}
            <line x1="94" y1="114" x2="546" y2="114" stroke="#e11d48" strokeWidth="3" strokeDasharray="8 5" />
            <text x="456" y="104" textAnchor="middle" fill="#e11d48" fontSize="12" fontWeight="800" fontFamily="system-ui, sans-serif">LÍMITE OVERFLOW → WDT</text>

            {[
              { x: 108, h: 120, color: '#059669', name: 'Sensor', kb: '1 KB' },
              { x: 214, h: 96, color: '#d97706', name: 'Blink', kb: '1 KB' },
              { x: 320, h: 144, color: '#064e3b', name: 'OLED', kb: '2 KB' },
              { x: 426, h: 82, color: '#475569', name: 'UART', kb: '1 KB' },
            ].map((col) => (
              <g key={col.name}>
                <rect x={col.x} y={272 - col.h} width="84" height={col.h} rx="10" fill={col.color} />
                <text x={col.x + 42} y={248 - col.h + 36} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">{col.name}</text>
                <text x={col.x + 42} y={268 - col.h + 36} textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="monospace">{col.kb}</text>
              </g>
            ))}
          </svg>
        );
      case 4:
        // Diapositiva 5: 3 defensas IoT alrededor del MCU
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Tres mecanismos de seguridad IoT: MPU, Watchdog y OTA firmada">
            <rect width="640" height="360" rx="20" fill="#fffbeb" />
            <line x1="320" y1="140" x2="132" y2="238" stroke="#059669" strokeWidth="3.5" />
            <line x1="320" y1="140" x2="320" y2="238" stroke="#d97706" strokeWidth="3.5" />
            <line x1="320" y1="140" x2="508" y2="238" stroke="#059669" strokeWidth="3.5" />

            {/* MCU */}
            <rect x="220" y="48" width="200" height="92" rx="18" fill="#064e3b" />
            <text x="320" y="92" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="800" fontFamily="system-ui, sans-serif">Nodo IoT Seguro</text>
            <text x="320" y="116" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">Protección Multicapa</text>

            {/* Tres tarjetas */}
            {[
              { x: 46, title: 'Regiones MPU', sub: 'Aísla tareas', stroke: '#059669' },
              { x: 237, title: 'HW Watchdog', sub: 'Auto-reinicio', stroke: '#d97706' },
              { x: 428, title: 'OTA Firmada', sub: 'Parche seguro', stroke: '#059669' },
            ].map((b) => (
              <g key={b.title}>
                <rect x={b.x} y="218" width="166" height="92" rx="14" fill="#ffffff" stroke={b.stroke} strokeWidth="3" />
                <text x={b.x + 83} y="258" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif">{b.title}</text>
                <text x={b.x + 83} y="282" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">{b.sub}</text>
              </g>
            ))}
          </svg>
        );
      case 5:
        // Diapositiva 6: Infografía radial de 4 sectores IoT
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Infografía radial de sectores que utilizan RTOS">
            <rect width="640" height="360" rx="20" fill="#f8fafc" />
            <line x1="320" y1="180" x2="152" y2="96" stroke="#d97706" strokeWidth="3.5" />
            <line x1="320" y1="180" x2="488" y2="96" stroke="#059669" strokeWidth="3.5" />
            <line x1="320" y1="180" x2="152" y2="264" stroke="#059669" strokeWidth="3.5" />
            <line x1="320" y1="180" x2="488" y2="264" stroke="#d97706" strokeWidth="3.5" />

            <circle cx="320" cy="180" r="56" fill="#064e3b" />
            <text x="320" y="176" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">RTOS</text>
            <text x="320" y="196" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">Millones de nodos</text>

            {[
              { x: 64, y: 58, t: 'Domótica', s: 'Hogar IoT', b: '#d97706' },
              { x: 400, y: 58, t: 'Industria', s: 'Sensores PLC', b: '#059669' },
              { x: 64, y: 230, t: 'Medicina', s: 'Equipos críticos', b: '#059669' },
              { x: 400, y: 230, t: 'Aeroespacial', s: 'Satélites & Auto', b: '#d97706' },
            ].map((card) => (
              <g key={card.t}>
                <rect x={card.x} y={card.y} width="176" height="72" rx="14" fill="#ffffff" stroke={card.b} strokeWidth="2.5" />
                <text x={card.x + 88} y={card.y + 32} textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="800" fontFamily="system-ui, sans-serif">{card.t}</text>
                <text x={card.x + 88} y={card.y + 52} textAnchor="middle" fill="#475569" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">{card.s}</text>
              </g>
            ))}
          </svg>
        );
      default:
        // Diapositiva 7: Tres pilares futuros RTOS
        return (
          <svg viewBox="0 0 640 360" className="w-full h-full" role="img" aria-label="Tres tarjetas de tendencias futuras en RTOS">
            <rect width="640" height="360" rx="20" fill="#fffbeb" />
            <line x1="130" y1="180" x2="510" y2="180" stroke="#fbbf24" strokeWidth="4" />
            {[
              { x: 44, tag: 'ESTÁNDAR', title: 'Zephyr OS', sub: 'ARM · RISC-V', border: '#059669' },
              { x: 237, tag: 'EDGE AI', title: 'TinyML', sub: 'Milivatios', border: '#d97706' },
              { x: 430, tag: 'SEGURIDAD', title: 'TrustZone-M', sub: 'PSA & OTA', border: '#064e3b' },
            ].map((c) => (
              <g key={c.title}>
                <rect x={c.x} y="98" width="166" height="164" rx="16" fill="#ffffff" stroke={c.border} strokeWidth="3" />
                <rect x={c.x + 16} y="120" width="134" height="24" rx="6" fill={c.border} />
                <text x={c.x + 83} y="136" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">{c.tag}</text>
                <text x={c.x + 83} y="186" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif">{c.title}</text>
                <text x={c.x + 83} y="212" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">{c.sub}</text>
              </g>
            ))}
          </svg>
        );
    }
  };

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-white">
      {renderArtwork()}
    </div>
  );
};
