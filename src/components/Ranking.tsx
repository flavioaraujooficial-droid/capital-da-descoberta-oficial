import { Trophy, TrendingUp, Star } from 'lucide-react';
import type { Vote } from '@/lib/supabase';
import type { Territory } from '@/data/territories';

type RankingProps = {
  votes: Vote[];
  territory: Territory;
};

type RankedItem = {
  artist_name: string;
  song_name: string;
  decade: string;
  image_url: string | null;
  count: number;
};

export function Ranking({ votes, territory }: RankingProps) {
  const tallied = votes.reduce<Map<string, RankedItem>>((acc, v) => {
    const key = `${v.artist_name}-${v.song_name}`;
    const existing = acc.get(key);
    if (existing) {
      existing.count++;
    } else {
      acc.set(key, {
        artist_name: v.artist_name,
        song_name: v.song_name,
        decade: v.decade,
        image_url: v.image_url,
        count: 1,
      });
    }
    return acc;
  }, new Map());

  const ranked = Array.from(tallied.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (ranked.length === 0) {
    return (
      <section className="px-4 sm:px-6 py-12 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5 text-[#dc2626]" />
          <h2 className="text-lg font-bold text-[#FFEFDE]">Músicas Mais Votadas</h2>
        </div>
        <p className="text-sm text-[#FFEFDE]/40 text-center py-8">
          Nenhum voto ainda. Seja o primeiro!
        </p>
      </section>
    );
  }

  const maxCount = ranked[0].count;

  return (
    <section className="px-4 sm:px-6 py-12 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-[#dc2626]" />
        <h2 className="text-lg font-bold text-[#FFEFDE]">Músicas Mais Votadas</h2>
        <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
          <TrendingUp className="h-3.5 w-3.5" /> Ao vivo
        </span>
      </div>

      {/* Festival ticket-style ranking cards */}
      <div className="space-y-2.5">
        {ranked.map((item, i) => (
          <div
            key={`${item.artist_name}-${item.song_name}`}
            className={`group relative flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:scale-[1.01] ${
              i < 3
                ? 'border-[#832E43]/40 bg-gradient-to-r from-[#832E43]/10 to-[#0d1b2a]/60'
                : 'border-[#832E43]/15 bg-[#0d1b2a]/60'
            }`}
          >
            {/* Rank number with star for top 3 */}
            <div className="flex-shrink-0 w-9 flex items-center justify-center">
              {i < 3 ? (
                <Star
                  className={`h-5 w-5 fill-current ${
                    i === 0
                      ? 'text-[#dc2626]'
                      : i === 1
                        ? 'text-[#FFEFDE]/70'
                        : 'text-[#832E43]'
                  }`}
                />
              ) : (
                <span className="text-sm font-bold text-[#FFEFDE]/30 tabular-nums">
                  {i + 1}
                </span>
              )}
            </div>

            {/* Artist thumbnail with festival badge styling */}
            {item.image_url && (
              <div className="relative flex-shrink-0">
                <img
                  src={item.image_url}
                  alt={item.artist_name}
                  className="h-12 w-12 rounded-lg object-cover ring-2 ring-[#832E43]/20"
                  loading="lazy"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-[#FFEFDE] text-sm font-medium truncate">{item.song_name}</p>
              <p className="text-[#FFEFDE]/50 text-xs truncate">
                {item.artist_name} · {item.decade}
              </p>
            </div>

            {/* Vote count badge */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="hidden sm:block w-24 h-1.5 rounded-full bg-[#832E43]/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#832E43] to-[#dc2626] rounded-full transition-all duration-500"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-[#dc2626] text-sm font-bold tabular-nums bg-[#dc2626]/10 px-2 py-0.5 rounded-md">
                {item.count}
              </span>
            </div>

            {/* Ticket perforation edge */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-[#06101E]" />
          </div>
        ))}
      </div>

      {/* Territory context note */}
      <p className="mt-4 text-center text-xs text-[#FFEFDE]/30">
        Votos de todos os territórios · Filtrando por:{' '}
        <span className="text-[#dc2626]">{territory.name}</span>
      </p>
    </section>
  );
}
