import { useEffect, useRef, useState } from 'react';
import { Search, Music4, Sparkles } from 'lucide-react';
import { ARTISTS, type Artist } from '@/data/artists';

type SearchBarProps = {
  onSelect: (artist: Artist) => void;
  onSubmitCustom: (query: string) => void;
  fixed: boolean;
};

export function SearchBar({ onSelect, onSubmitCustom, fixed }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Artist[]>([]);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.song.toLowerCase().includes(q) ||
        a.decade.toLowerCase().includes(q),
    ).slice(0, 8);
    setResults(filtered);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasExact = results.some(
    (r) =>
      r.name.toLowerCase() === query.trim().toLowerCase() ||
      r.song.toLowerCase() === query.trim().toLowerCase(),
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Glassmorphism search bar */}
      <div
        className={`relative flex items-center gap-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          focused
            ? 'border-[#dc2626]/50 shadow-lg shadow-[#dc2626]/10 bg-[#0d1b2a]/70'
            : 'border-[#832E43]/25 bg-[#0d1b2a]/50'
        } ${fixed ? 'px-4 py-3' : 'px-5 py-4'}`}
      >
        <Search className="h-5 w-5 text-[#dc2626] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim() && !hasExact) {
              onSubmitCustom(query.trim());
              setFocused(false);
            }
          }}
          placeholder="Busque por artista, música ou década..."
          className="flex-1 bg-transparent text-[#FFEFDE] placeholder:text-[#FFEFDE]/40 outline-none text-sm sm:text-base"
        />
        {fixed && (
          <span className="hidden sm:flex items-center gap-1 text-xs text-[#FFEFDE]/40 flex-shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-[#dc2626]" /> Busca inteligente
          </span>
        )}
      </div>

      {focused && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[#832E43]/30 bg-[#0d1b2a]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            results.map((artist) => (
              <button
                key={artist.id}
                onClick={() => {
                  onSelect(artist);
                  setQuery('');
                  setFocused(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#832E43]/15 transition-colors text-left border-b border-white/5 last:border-0"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-12 w-12 rounded-lg object-cover flex-shrink-0 ring-1 ring-[#832E43]/20"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#FFEFDE] text-sm font-medium truncate">{artist.name}</p>
                  <p className="text-[#FFEFDE]/50 text-xs truncate">{artist.song}</p>
                </div>
                <span className="text-xs text-[#FFEFDE] bg-[#832E43]/30 px-2.5 py-1 rounded-full flex-shrink-0 border border-[#832E43]/30">
                  {artist.decade}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-[#FFEFDE]/50">
              Nenhum artista encontrado na base. Pressione Enter para registrar "{query.trim()}".
            </p>
          )}

          {query.trim() && !hasExact && (
            <button
              onClick={() => {
                onSubmitCustom(query.trim());
                setFocused(false);
                setQuery('');
              }}
              className="flex items-center gap-2 w-full px-4 py-3 bg-[#dc2626]/10 hover:bg-[#dc2626]/20 transition-colors text-left border-t border-[#832E43]/20"
            >
              <Music4 className="h-5 w-5 text-[#dc2626] flex-shrink-0" />
              <span className="text-sm text-[#FFEFDE]">
                Registrar nova entrada: <strong className="text-[#dc2626]">{query.trim()}</strong>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
