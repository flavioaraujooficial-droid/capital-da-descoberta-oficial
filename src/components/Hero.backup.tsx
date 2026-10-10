import { SearchBar } from './SearchBar';
import { TerritorySelector } from './TerritorySelector';
import type { Artist } from '@/data/artists';
import type { Territory } from '@/data/territories';

interface HeroProps {
  onSelectArtist: (artist: Artist) => void;
  onSubmitCustom: (query: string) => void;
  territory: Territory;
  onSelectTerritory: (territory: Territory) => void;
}

export function Hero({ onSelectArtist, onSubmitCustom, territory, onSelectTerritory }: HeroProps) {
  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden bg-gradient-to-b from-[#06101E] via-[#0B1B33] to-[#06101E] text-white">
      {/* Efeito de luz ambiente */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#832E43]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#dc2626]/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 w-full">
        
        {/* Seletor de Território de Identidade */}
        <div className="flex justify-center">
          <TerritorySelector selected={territory} onSelect={onSelectTerritory} />
        </div>

        {/* Logotipo Principal */}
        <div className="space-y-2">
          <div className="inline-block relative">
            <div className="text-[#dc2626] text-xl font-bold mb-[-8px]">★</div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              Capital da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] via-amber-400 to-[#832E43]">Descoberta</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#FFEFDE]/70 tracking-widest uppercase">
            {territory.name} — <span className="text-[#dc2626] italic normal-case">{territory.motto}</span>
          </p>
        </div>

        {/* Pergunta Direta */}
        <div className="space-y-2 pt-2">
          <h2 className="text-lg sm:text-2xl font-bold text-[#FFEFDE] tracking-wide">
            Qual música ou artista marcou a sua história?
          </h2>
          <p className="text-xs sm:text-sm text-[#FFEFDE]/60">
            Deixe sua marca na maior intervenção cultural da Bahia.
          </p>
        </div>

        {/* Buscador Integrado Imediato */}
        <div className="pt-2 w-full max-w-xl mx-auto">
          <SearchBar
            onSelect={onSelectArtist}
            onSubmitCustom={onSubmitCustom}
            fixed={false}
          />
        </div>

      </div>
    </div>
  );
}
