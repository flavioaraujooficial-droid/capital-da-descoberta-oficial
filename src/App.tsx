import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { LoginModal, type VoterInfo } from '@/components/LoginModal';
import { ShareableCard, type CardData } from '@/components/ShareableCard';
import { Ranking } from '@/components/Ranking';
import { StreetFeed } from '@/components/StreetFeed';
import { Footer } from '@/components/Footer';
import { supabase, type Vote } from '@/lib/supabase';
import type { Artist } from '@/data/artists';
import { TERRITORIES, type Territory } from '@/data/territories';

type PendingVote = {
  artistName: string;
  songName: string;
  decade: string;
  imageUrl: string;
  isCustom: boolean;
};

function App() {
  const [territory, setTerritory] = useState<Territory>(TERRITORIES[0]);
  const [pendingVote, setPendingVote] = useState<PendingVote | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadVotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      setLoading(false);
      return;
    }
    setVotes(data as Vote[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVotes();
  }, [loadVotes]);

  const handleSelectArtist = (artist: Artist) => {
    setPendingVote({
      artistName: artist.name,
      songName: artist.song,
      decade: artist.decade,
      imageUrl: artist.image,
      isCustom: false,
    });
    setLoginOpen(true);
  };

  const handleCustomSubmit = (query: string) => {
    setPendingVote({
      artistName: query,
      songName: 'Voto personalizado',
      decade: '—',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
      isCustom: true,
    });
    setLoginOpen(true);
  };

  const handleConfirmVote = async (info: VoterInfo) => {
    if (!pendingVote) return;
    setLoginOpen(false);

    const { error } = await supabase.from('votes').insert({
      artist_name: pendingVote.artistName,
      song_name: pendingVote.songName,
      decade: pendingVote.decade,
      image_url: pendingVote.imageUrl,
      voter_name: info.name,
      city: info.city,
      instagram: info.instagram || null,
      is_custom: pendingVote.isCustom,
      territory: territory.name,
    });

    if (error) {
      showToast('Erro ao registrar voto. Tente novamente.');
      return;
    }

    setCardData({
      artistName: pendingVote.artistName,
      songName: pendingVote.songName,
      decade: pendingVote.decade,
      imageUrl: pendingVote.imageUrl,
      voter: info,
      territory,
    });
    setCardOpen(true);
    setPendingVote(null);
    loadVotes();
    showToast('Voto confirmado com sucesso!');
  };

  const selectedLabel = pendingVote
    ? `${pendingVote.artistName} — ${pendingVote.songName}`
    : '';

  return (
    <div className="min-h-screen bg-[#06101E] text-white relative overflow-hidden">
      {/* Vídeo de fundo em loop com atmosfera de festival */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 filter brightness-75"
        >
          <source src="https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Concert_crowd_lights_loop.webm/Concert_crowd_lights_loop.webm.high.webm" type="webm" />
        </video>
        {/* Camada escurecida em gradiente para garantir contraste e legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06101E]/90 via-[#06101E]/75 to-[#06101E]/90" />
      </div>

      <div className="relative z-10">
        <Hero
          onSelectArtist={handleSelectArtist}
          onSubmitCustom={handleCustomSubmit}
          territory={territory}
          onSelectTerritory={setTerritory}
        />

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          <Ranking votes={votes} territory={territory} />
          <StreetFeed votes={votes} territory={territory} />

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-6 w-6 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <Footer />
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onConfirm={handleConfirmVote}
        selectedLabel={selectedLabel}
        territory={territory}
      />
      <ShareableCard
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        card={cardData}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] rounded-xl bg-[#0d1b2a] border border-[#832E43]/30 px-5 py-3 text-sm text-[#FFEFDE] shadow-2xl animate-[slideUp_0.3s_ease-out]">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#dc2626] fill-[#dc2626]" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
