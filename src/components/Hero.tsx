import { TerritorySelector } from './TerritorySelector';
import type { Artist } from '@/data/artists';
import type { Territory } from '@/data/territories';

interface HeroProps {
  onSelectArtist: (artist: Artist) => void;
  onSubmitCustom: (query: string) => void;
  territory: Territory;
  onSelectTerritory: (territory: Territory) => void;
}

export function Hero({ territory, onSelectTerritory }: HeroProps) {
  return (
    <div className="relative min-h-[55vh] flex flex-col items-center justify-center px-4 py-6 overflow-hidden bg-gradient-to-b from-[#06101E] via-[#0B1B33] to-[#06101E] text-white">
      {/* Efeito de luz ambiente vibrante */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#dc2626]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 w-full">

        {/* Seletor de Território de Identidade */}
        <div className="flex justify-center">
          <TerritorySelector selected={territory} onSelect={onSelectTerritory} />
        </div>

        {/* Logo / Título de Impacto do Festival */}
        <div className="space-y-1">
          <div className="inline-block relative">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] flex items-center justify-center gap-2">
              <span className="text-[#dc2626]">★</span>
              Capital da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] via-amber-400 to-[#832E43]">Descoberta</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#FFEFDE]/80 tracking-widest uppercase font-medium">
            {territory.name} — <span className="text-[#dc2626] italic normal-case">{territory.motto}</span>
          </p>
        </div>

        {/* Chamada Principal Direta */}
        <div className="space-y-1 pt-1">
          <h2 className="text-base sm:text-xl font-bold text-[#FFEFDE] tracking-wide">
            Qual música ou artista marcou a sua história?
          </h2>
          <p className="text-xs sm:text-sm text-[#FFEFDE]/70">
            Deixe sua marca na maior intervenção cultural da Bahia.
          </p>
        </div>

      </div>
    </div>
  );
}
