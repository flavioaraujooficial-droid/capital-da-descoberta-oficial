import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Disc,
  Flame,
  Music2,
  Radio,
  Sparkles,
  Trophy,
  Loader2,
  Play,
  Pause,
  Heart,
} from 'lucide-react';

import { supabase, type Vote, makeFingerprint } from '@/lib/supabase';
import type { Artist } from '@/data/artists';
import type { Territory } from '@/data/territories';
import { TERRITORIES } from '@/data/territories';
import { Hero } from '@/components/Hero';
import { LoginModal, type VoterInfo } from '@/components/LoginModal';
import { Ranking } from '@/components/Ranking';
import { ShareableCard } from '@/components/ShareableCard';
import { StreetFeed } from '@/components/StreetFeed';
import { Footer } from '@/components/Footer';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  preview?: string;
  decade?: string;
}

interface ITunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
}

interface CardData {
  artistName: string;
  songName: string;
  decade: string;
  imageUrl: string;
  voter: VoterInfo;
}

function App() {
  const [territory, setTerritory] = useState<Territory>(TERRITORIES[0]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const [pendingVote, setPendingVote] = useState<{
    artistName: string;
    songName: string;
    decade: string;
    imageUrl: string;
    isCustom: boolean;
  } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [votes, setVotes] = useState<Vote[]>([]);
  const [votesLoading, setVotesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // --- Fetch votes from Supabase ---
  useEffect(() => {
    async function fetchVotes() {
      setVotesLoading(true);
      try {
        const { data, error } = await supabase
          .from('votes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) {
          console.error('Erro ao buscar votos:', error);
        } else if (data) {
          setVotes(data as Vote[]);
        }
      } catch (err) {
        console.error('Erro ao carregar votos:', err);
      } finally {
        setVotesLoading(false);
      }
    }
    fetchVotes();
  }, []);

  // --- iTunes search (preserved from legacy) ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=12&country=BR`,
        );
        const data = await response.json();

        if (data && data.results) {
          const formattedSongs: Song[] = data.results.map((item: ITunesResult) => ({
            id: item.trackId.toString(),
            title: item.trackName,
            artist: item.artistName,
            cover: item.artworkUrl100
              ? item.artworkUrl100.replace('100x100bb', '400x400bb')
              : '',
            preview: item.previewUrl,
            decade: item.collectionName || 'Trilha Sonora da Minha Vida',
          }));
          setSearchResults(formattedSongs);
        }
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Audio preview playback ---
  const handlePlayPreview = (song: Song) => {
    if (!song.preview) {
      showToast('Prévia de áudio não disponível.');
      return;
    }

    if (playingSongId === song.id) {
      audioRef.current?.pause();
      setPlayingSongId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(song.preview);
      audioRef.current = newAudio;
      newAudio.play().catch(() => showToast('Erro ao reproduzir prévia.'));
      setPlayingSongId(song.id);

      newAudio.onended = () => {
        setPlayingSongId(null);
      };
    }
  };

  useEffect(() => {
    if (!searchTerm.trim() && audioRef.current) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }
  }, [searchTerm]);

  // --- Select a track from iTunes results ---
  const handleSelectTrack = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }
    setPendingVote({
      artistName: song.artist,
      songName: song.title,
      decade: song.decade || 'Trilha Sonora da Minha Vida',
      imageUrl: song.cover,
      isCustom: true,
    });
    setLoginOpen(true);
  };

  // --- Select a curated artist (from modular SearchBar) ---
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

  // --- Submit custom search query (from modular SearchBar) ---
  const handleSubmitCustom = (query: string) => {
    setSearchTerm(query);
  };

  // --- Confirm vote via LoginModal ---
  const handleConfirmVote = async (info: VoterInfo) => {
    if (!pendingVote || submitting) return;
    setSubmitting(true);

    const fingerprint = makeFingerprint(info.name, info.city, pendingVote.artistName, pendingVote.songName);

    try {
      const { data, error } = await supabase
        .from('votes')
        .insert({
          artist_name: pendingVote.artistName,
          song_name: pendingVote.songName,
          decade: pendingVote.decade,
          image_url: pendingVote.imageUrl,
          voter_name: info.name,
          city: info.city,
          instagram: info.instagram || null,
          is_custom: pendingVote.isCustom,
          territory: territory.name,
          fingerprint,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          showToast('Você já registrou este voto. Obrigado!');
        } else {
          showToast('Não foi possível registrar seu voto. Tente novamente.');
          console.error('Erro ao registrar voto:', error);
        }
        setSubmitting(false);
        return;
      }

      // Only close modal and show success after DB confirms
      setLoginOpen(false);

      if (data) {
        setVotes((prev) => [data as Vote, ...prev]);
      }

      setCardData({
        artistName: pendingVote.artistName,
        songName: pendingVote.songName,
        decade: pendingVote.decade,
        imageUrl: pendingVote.imageUrl,
        voter: info,
      });

      setCardOpen(true);
      setPendingVote(null);
      showToast('Voto registrado com sucesso!');
    } catch (err) {
      showToast('Erro de conexão. Verifique sua internet e tente novamente.');
      console.error('Erro ao registrar voto:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Share card ---
  const handleShareClick = async () => {
    if (!cardData) return;
    const shareText = `Quero ${cardData.artistName} com a música "${cardData.songName}" no Festival Capital da Descoberta! Venha escolher as atrações você também:`;
    const shareUrl = window.location.origin || window.location.href;

    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: 'Escolha de Atração - Capital da Descoberta',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        showToast('Texto de indicação copiado!');
      } catch {
        showToast('Copie a URL para compartilhar!');
      }
    }
  };

  const categories = [
    { id: '70s80s', label: 'Anos 70 e 80', desc: 'Clássicos Inesquecíveis', query: 'Sucessos Anos 80', icon: Disc, color: 'from-amber-500/20 to-red-600/20 border-amber-500/40 text-amber-300' },
    { id: '90s', label: 'Anos 90', desc: 'Época de Ouro', query: 'Sucessos Anos 90', icon: Radio, color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-300' },
    { id: '2000s', label: 'Anos 2000', desc: 'Sucessos Marcantes', query: 'Sertanejo 2000', icon: Music2, color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300' },
    { id: 'sertanejo', label: 'Modão Sertanejo', desc: 'As Melhores do Brasil', query: 'Modao Sertanejo', icon: Flame, color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
  ];

  const selectedLabel = pendingVote
    ? `${pendingVote.artistName} — ${pendingVote.songName}`
    : '';

  return (
    <div className="min-h-screen bg-[#06101E] text-[#FFEFDE] relative font-sans overflow-x-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-[#dc2626] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold animate-bounce text-xs border border-red-400">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero with modular components: TerritorySelector + SearchBar (curated artists) */}
      <Hero
        onSelectArtist={handleSelectArtist}
        onSubmitCustom={handleSubmitCustom}
        territory={territory}
        onSelectTerritory={setTerritory}
      />

      {/* iTunes search section — preserved from legacy */}
      <section className="px-4 sm:px-6 py-4 sm:py-8 max-w-3xl mx-auto space-y-6">
        {/* Search field */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#dc2626] to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative flex items-center bg-[#0d152a] border border-white/15 rounded-2xl px-4 py-3.5 shadow-xl">
            <Search className="h-5 w-5 text-white/40 mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome da música ou artista..."
              className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
            />
            {loading && <Loader2 className="h-4 w-4 text-[#dc2626] animate-spin ml-2" />}
          </div>
        </div>

        {/* Search results */}
        {searchTerm.trim() !== '' && (
          <div className="space-y-3 bg-[#0d152a] border border-white/10 rounded-2xl p-4 shadow-2xl">
            <h3 className="text-xs font-bold text-white/70 uppercase flex items-center gap-2">
              {loading ? 'Buscando catálogo...' : `Resultados para "${searchTerm}":`}
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {searchResults.length > 0 ? (
                searchResults.map((song) => {
                  const isPlaying = playingSongId === song.id;
                  return (
                    <div
                      key={song.id}
                      className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative group flex-shrink-0 cursor-pointer" onClick={() => handlePlayPreview(song)}>
                          <img src={song.cover} alt={song.title} className="w-11 h-11 rounded-lg object-cover" />
                          <div className={`absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                            {isPlaying ? (
                              <Pause className="h-5 w-5 text-[#dc2626] fill-current" />
                            ) : (
                              <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                            )}
                          </div>
                        </div>

                        <div className="truncate">
                          <p className="text-xs font-bold text-white leading-tight truncate">{song.title}</p>
                          <p className="text-[11px] text-white/60 truncate">{song.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <button
                          onClick={() => handlePlayPreview(song)}
                          className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                            isPlaying
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                          }`}
                          title="Ouvir prévia"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => handleSelectTrack(song)}
                          className="bg-[#dc2626] hover:bg-red-700 text-white text-xs px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1 shadow-md"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" />
                          <span>Escolher</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                !loading && <p className="text-xs text-white/40 py-4 text-center">Nenhuma música encontrada.</p>
              )}
            </div>
          </div>
        )}

        {/* Categories — shown when not searching */}
        {searchTerm.trim() === '' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
              Explorar por Categoria
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSearchTerm(cat.query)}
                    className={`p-4 rounded-2xl border bg-gradient-to-br ${cat.color} backdrop-blur-md text-left transition-all active:scale-95 hover:border-white/40 flex flex-col justify-between h-24 relative overflow-hidden group`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-sm text-white group-hover:text-amber-200 transition-colors">
                        {cat.label}
                      </span>
                      <Icon className="h-4 w-4 opacity-70" />
                    </div>
                    <span className="text-[10px] text-white/60 font-medium">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Dynamic ranking from Supabase */}
      {votesLoading ? (
        <section className="px-4 sm:px-6 py-12 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-[#dc2626]" />
            <h2 className="text-lg font-bold text-[#FFEFDE]">Músicas Mais Votadas</h2>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-[#dc2626] animate-spin" />
          </div>
        </section>
      ) : (
        <Ranking votes={votes} territory={territory} />
      )}

      {/* Street feed of recent votes */}
      {!votesLoading && votes.length > 0 && (
        <StreetFeed votes={votes} territory={territory} />
      )}

      {/* Login modal (modular component with city autocomplete) */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onConfirm={handleConfirmVote}
        selectedLabel={selectedLabel}
        territory={territory}
        submitting={submitting}
      />

      {/* Shareable card */}
      <ShareableCard
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        cardData={cardData}
        onShare={handleShareClick}
      />

      <Footer />
    </div>
  );
}

export default App;

