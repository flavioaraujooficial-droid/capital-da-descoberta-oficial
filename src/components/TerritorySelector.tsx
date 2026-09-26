import { useState } from 'react';
import { Map, ChevronDown, Check } from 'lucide-react';
import { TERRITORIES, type Territory } from '@/data/territories';

type TerritorySelectorProps = {
  selected: Territory;
  onSelect: (territory: Territory) => void;
};

export function TerritorySelector({ selected, onSelect }: TerritorySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[#832E43]/40 bg-[#0d1b2a]/80 backdrop-blur-md px-4 py-2 text-sm text-[#FFEFDE] hover:border-[#dc2626]/60 transition-all duration-200 group"
      >
        <Map className="h-4 w-4 text-[#dc2626] flex-shrink-0" />
        <span className="font-medium truncate max-w-[180px] sm:max-w-none">{selected.name}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#FFEFDE]/60 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[#832E43]/30 bg-[#0d1b2a]/95 backdrop-blur-xl shadow-2xl z-50 max-h-[50vh] overflow-y-auto min-w-[280px] animate-[slideUp_0.2s_ease-out]">
            <p className="px-4 pt-3 pb-1 text-xs font-medium text-[#FFEFDE]/50 uppercase tracking-wide">
              Territórios de Identidade da Bahia
            </p>
            {TERRITORIES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelect(t);
                  setOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-2.5 hover:bg-[#832E43]/15 transition-colors text-left border-b border-white/5 last:border-0 ${
                  t.id === selected.id ? 'bg-[#832E43]/10' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm text-[#FFEFDE] truncate">{t.name}</p>
                  <p className="text-xs text-[#dc2626]/80 italic truncate">{t.motto}</p>
                </div>
                {t.id === selected.id && (
                  <Check className="h-4 w-4 text-[#dc2626] flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
