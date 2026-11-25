import React, { useEffect, useState } from 'react';
import { ArrowRight, Maximize2, Minimize2 } from 'lucide-react';

interface CoverPresentationBannerProps {
  onStartTour: () => void;
}

const UdoEmblemSvg: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Emblema Universidad de Oriente Venezuela">
    {/* Outer gold ring */}
    <circle cx="60" cy="60" r="56" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
    <circle cx="60" cy="60" r="41" fill="#0f2547" stroke="#ca8a04" strokeWidth="2" />
    {/* Circular text paths */}
    <defs>
      <path id="udo-top-arc" d="M 16,60 A 44,44 0 1,1 104,60" />
      <path id="udo-bottom-arc" d="M 18,66 A 44,44 0 0,0 102,66" />
    </defs>
    <text fill="#1e293b" fontSize="8.8" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.8">
      <textPath href="#udo-top-arc" startOffset="50%" textAnchor="middle">
        UNIVERSIDAD DE ORIENTE
      </textPath>
    </text>
    <text fill="#1e293b" fontSize="8.2" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="1.2">
      <textPath href="#udo-bottom-arc" startOffset="50%" textAnchor="middle">
        VENEZUELA
      </textPath>
    </text>
    {/* Inner 8-point compass star */}
    <polygon points="60,24 65,52 94,60 65,68 60,96 55,68 26,60 55,52" fill="#f8fafc" stroke="#eab308" strokeWidth="1.5" />
    <polygon points="60,34 64,54 84,60 64,66 60,86 56,66 36,60 56,54" fill="#38bdf8" opacity="0.45" />
    <polygon points="39,39 58,54 81,81 62,66" fill="#facc15" />
    <polygon points="81,39 62,54 39,81 58,66" fill="#facc15" />
    <circle cx="60" cy="60" r="6" fill="#facc15" stroke="#0f2547" strokeWidth="1.5" />
  </svg>
);

const IsometricLayerStackSvg: React.FC = () => {
  const layers = [
    {
      label: 'NUBE',
      y: 22,
      topFill: '#dd9411',
      leftFill: '#af6f08',
      rightFill: '#8d5605',
      stroke: '#f5b841',
    },
    {
      label: 'INFRAESTRUCTURA HÍBRIDA',
      y: 94,
      topFill: '#1281c2',
      leftFill: '#0b6193',
      rightFill: '#094e77',
      stroke: '#38bdf8',
    },
    {
      label: 'CONTENEDORES',
      y: 166,
      topFill: '#1281c2',
      leftFill: '#0b6193',
      rightFill: '#094e77',
      stroke: '#38bdf8',
    },
    {
      label: 'VIRTUALIZACIÓN',
      y: 238,
      topFill: '#1281c2',
      leftFill: '#0b6193',
      rightFill: '#094e77',
      stroke: '#38bdf8',
    },
    {
      label: 'NÚCLEO / KERNEL',
      y: 310,
      topFill: '#1281c2',
      leftFill: '#0b6193',
      rightFill: '#094e77',
      stroke: '#38bdf8',
    },
  ];

  // Diamond corners around center x=190, half-width=145, half-height=40, thickness=16
  return (
    <svg
      viewBox="0 0 390 420"
      className="w-full h-full max-h-[430px] select-none"
      role="img"
      aria-label="Capas arquitectónicas: Nube, Infraestructura Híbrida, Contenedores, Virtualización y Núcleo / Kernel"
    >
      {/* Dashed curved connectors linking right corners */}
      {layers.slice(0, -1).map((layer, idx) => {
        const y1 = layer.y + 42;
        const y2 = layers[idx + 1].y + 42;
        const midY = (y1 + y2) / 2;
        return (
          <path
            key={layer.label}
            d={`M 336 ${y1} Q 368 ${midY} 336 ${y2}`}
            fill="none"
            stroke="#dd9411"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        );
      })}

      {layers.map((layer) => {
        const cx = 190;
        const cy = layer.y + 40;
        const hw = 144;
        const hh = 38;
        const depth = 15;

        const topPts = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;
        const leftPts = `${cx - hw},${cy} ${cx},${cy + hh} ${cx},${cy + hh + depth} ${cx - hw},${cy + depth}`;
        const rightPts = `${cx},${cy + hh} ${cx + hw},${cy} ${cx + hw},${cy + depth} ${cx},${cy + hh + depth}`;

        return (
          <g key={layer.label}>
            <polygon points={leftPts} fill={layer.leftFill} stroke={layer.stroke} strokeWidth="0.9" strokeOpacity="0.45" />
            <polygon points={rightPts} fill={layer.rightFill} stroke={layer.stroke} strokeWidth="0.9" strokeOpacity="0.45" />
            <polygon points={topPts} fill={layer.topFill} stroke={layer.stroke} strokeWidth="1.2" />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11.5"
              fontWeight="800"
              letterSpacing="0.8"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {layer.label}
            </text>
            {/* Right corner orange connector dot */}
            <circle cx={cx + hw} cy={cy + 2} r="4.5" fill="#f59e0b" />
          </g>
        );
      })}
    </svg>
  );
};

export const CoverPresentationBanner: React.FC<CoverPresentationBannerProps> = ({ onStartTour }) => {
  const [fullscreenCover, setFullscreenCover] = useState(false);

  useEffect(() => {
    if (!fullscreenCover) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenCover(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullscreenCover]);

  const coverContent = (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#0f1d36] to-[#0a1324] text-white ${
        fullscreenCover
          ? 'w-full max-w-[1380px] rounded-2xl border border-slate-700/60 shadow-2xl p-6 sm:p-10 lg:p-14'
          : 'rounded-2xl border border-slate-800 shadow-lg p-6 sm:p-10 lg:p-12'
      }`}
    >
      {/* Subtle geometric background highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl"
      />

      {/* Presentation toolbar */}
      <div className="relative z-10 flex items-center justify-end gap-2 mb-4 sm:mb-2">
        <button
          type="button"
          onClick={() => setFullscreenCover((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15 transition-colors cursor-pointer"
        >
          {fullscreenCover ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Salir de portada (Esc)</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Proyectar portada</span>
            </>
          )}
        </button>
        {fullscreenCover && (
          <button
            type="button"
            onClick={() => {
              setFullscreenCover(false);
              onStartTour();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
          >
            <span>Iniciar simuladores</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main 16:9 Slide Layout matching the PDF */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Institution, Title, Subtitle, Professor & Maestrantes */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7">
          {/* University Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            <UdoEmblemSvg className="w-16 h-16 sm:w-[74px] sm:h-[74px] shrink-0" />
            <div className="text-center sm:text-center flex-1 space-y-1">
              <div className="font-display text-lg sm:text-xl lg:text-[22px] font-extrabold tracking-wide text-white uppercase">
                UNIVERSIDAD DE ORIENTE
              </div>
              <div className="text-[11px] sm:text-xs font-medium tracking-wider text-slate-300 uppercase">
                VICERRECTORADO ACADÉMICO – CONSEJO DE ESTUDIOS DE POSTGRADO
              </div>
              <div className="text-[11px] sm:text-xs font-medium tracking-wider text-slate-300 uppercase pt-1">
                POSTGRADO EN INFORMÁTICA GERENCIAL – NÚCLEO MONAGAS
              </div>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4">
            <div className="w-16 h-1 bg-[#e09412] rounded-full" />
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-white leading-[1.06] uppercase">
              SISTEMAS OPERATIVOS
              <br />
              EMERGENTES
            </h1>
            <p className="text-base sm:text-lg lg:text-xl italic text-slate-300 leading-relaxed max-w-xl">
              Arquitecturas modernas, eficiencia operativa y gobernanza tecnológica
            </p>
          </div>

          {/* Professor & Maestrantes Card */}
          <div className="bg-white/[0.04] border-l-2 border-l-sky-500 border border-white/10 rounded-r-xl p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold tracking-[0.22em] text-[#e09412] uppercase">
                PROFESOR
              </div>
              <div className="text-lg sm:text-xl font-bold text-white">Roger Díaz</div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold tracking-[0.22em] text-[#e09412] uppercase">
                MAESTRANTES
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs sm:text-sm text-slate-200 font-normal">
                <div>Ing. Jesús Díaz — C.I: 27.710.714</div>
                <div>Ing. Héctor Rocca — C.I: 25.576.672</div>
                <div>Ing. Ariannys Ruíz — C.I: 24.501.205</div>
                <div>Ing. Pedro Herrera — C.I: 21.350.890</div>
                <div>Ing. Milagros Urbina — C.I: 17.092.782</div>
                <div>Ing. César Mirabety — C.I: 11.337.278</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Layer Isometric Architectural Stack */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <IsometricLayerStackSvg />
        </div>
      </div>
    </div>
  );

  if (fullscreenCover) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Portada de presentación Sistemas Operativos Emergentes"
        className="fixed inset-0 z-50 bg-[#060d1a]/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
      >
        {coverContent}
      </div>
    );
  }

  return <section aria-label="Portada de presentación">{coverContent}</section>;
};
