import { Radio, MapPin, Star } from 'lucide-react';
import type { Vote } from '@/lib/supabase';
import type { Territory } from '@/data/territories';

type StreetFeedProps = {
  votes: Vote[];
  territory: Territory;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora mesmo';
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export function StreetFeed({ votes, territory }: StreetFeedProps) {
  // Filter to show territory votes first, then others
  const inTerritory = votes.filter((v) => v.territory === territory.name);
  const others = votes.filter((v) => v.territory !== territory.name);
  const recent = [...inTerritory, ...others]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  if (recent.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 py-12 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Radio className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-bold text-[#FFEFDE]">Feed da Rua</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-[#FFEFDE]/40">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Últimas interações
        </span>
      </div>

      {/* Festival badge/crachá style cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recent.map((vote) => {
          const isLocal = vote.territory === territory.name;
          return (
            <div
              key={vote.id}
              className={`relative flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:scale-[1.01] ${
                isLocal
                  ? 'border-[#832E43]/40 bg-gradient-to-br from-[#832E43]/10 to-[#0d1b2a]/60'
                  : 'border-[#832E43]/15 bg-[#0d1b2a]/50'
              }`}
            >
              {/* Festival badge perforation */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-[#06101E]" />

              {vote.image_url ? (
                <img
                  src={vote.image_url}
                  alt={vote.artist_name}
                  className="h-12 w-12 rounded-lg object-cover flex-shrink-0 ring-2 ring-[#832E43]/20"
                  loading="lazy"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#832E43]/20 to-[#dc2626]/10 flex-shrink-0 ring-2 ring-[#832E43]/20" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[#FFEFDE] text-sm">
                  <span className="font-medium">{vote.voter_name}</span>{' '}
                  <span className="text-[#FFEFDE]/40">votou em</span>{' '}
                  <span className="text-[#dc2626] font-medium">{vote.song_name}</span>
                </p>
                <p className="text-[#FFEFDE]/40 text-xs truncate">
                  {vote.artist_name} · {vote.decade}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs flex-wrap">
                  <span className="flex items-center gap-1 text-[#FFEFDE]/50">
                    <MapPin className="h-3 w-3" />
                    {vote.city}
                  </span>
                  {vote.territory && (
                    <span
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                        isLocal
                          ? 'bg-[#dc2626]/15 text-[#dc2626] border border-[#dc2626]/20'
                          : 'text-[#FFEFDE]/30'
                      }`}
                    >
                      {isLocal && <Star className="h-2.5 w-2.5 fill-current" />}
                      {vote.territory}
                    </span>
                  )}
                  <span className="ml-auto text-[#FFEFDE]/30">{timeAgo(vote.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {inTerritory.length === 0 && (
        <p className="mt-4 text-center text-xs text-[#FFEFDE]/30">
          Ainda não há votos de <span className="text-[#dc2626]">{territory.name}</span>. Seja o
          primeiro do seu território!
        </p>
      )}
    </section>
  );
}
