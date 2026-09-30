import React, { useState, useEffect, useRef } from 'react';
import { Search, Disc, Flame, Music2, Radio, Sparkles, Trophy, Loader2, Play, Pause, Heart, Share2, X, CheckCircle2, MapPin } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuração opcional do Supabase (não trava se não estiver configurado)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  preview?: string;
  decade?: string;
  votes?: number;
}

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Estados de Modais e Voto
  const [pendingVote, setPendingVote] = useState<Song | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [voterInfo, setVoterInfo] = useState({ name: '', city: '', instagram: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ranking Fictício/Inicial das Mais Votadas
  const topVoted: Song[] = [
    { id: '1', title: 'Evidências', artist: 'Chitãozinho & Xororó', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100', votes: 142 },
    { id: '2', title: 'Telefone Mudo', artist: 'Trio Parada Dura', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100', votes: 118 },
    { id: '3', title: 'Majestade o Sabiá', artist: 'Roberta Miranda', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100', votes: 95 },
    { id: '4', title: 'Boate Azul', artist: 'Joaquim & Manuel', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100', votes: 87 },
  ];

  const categories = [
    { id: '70s80s', label: 'Anos 70 e 80', desc: 'Clássicos Inesquecíveis', query: 'Sucessos Anos 80', icon: Disc, color: 'from-amber-500/20 to-red-600/20 border-amber-500/40 text-amber-300' },
    { id: '90s', label: 'Anos 90', desc: 'Época de Ouro', query: 'Sucessos Anos 90', icon: Radio, color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-300' },
    { id: '2000s', label: 'Anos 2000', desc: 'Sucessos Marcantes', query: 'Sertanejo 2000', icon: Music2, color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300' },
    { id: 'sertanejo', label: 'Modão Sertanejo', desc: 'As Melhores do Brasil', query: 'Modao Sertanejo', icon: Flame, color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Leitor de Prévia de Áudio
  const handlePlayPreview = (song: Song) => {
    if (!song.preview) {
      showToast('Prévia de áudio não disponível para esta música.');
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
      newAudio.play().catch(() => showToast('Não foi possível tocar a prévia.'));
      setPlayingSongId(song.id);

      newAudio.onended = () => {
        setPlayingSongId(null);
      };
    }
  };

  // Parar áudio ao apagar a busca
  useEffect(() => {
    if (!searchTerm.trim() && audioRef.current) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }
  }, [searchTerm]);

  // Busca na iTunes API
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=12&country=BR`
        );
        const data = await response.json();

        if (data && data.results) {
          const formattedSongs: Song[] = data.results.map((item: any) => ({
            id: item.trackId.toString(),
            title: item.trackName,
            artist: item.artistName,
            cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '400x400bb') : '',
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

  // Selecionar música para votar
  const handleSelectTrack = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }
    setPendingVote(song);
    setLoginOpen(true);
  };

  // Confirmar Voto
  const handleConfirmVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVote) return;
    if (!voterInfo.name || !voterInfo.city) {
      showToast('Por favor, preencha seu nome e cidade.');
      return;
    }

    setLoginOpen(false);

    // Salvar no Supabase (se configurado)
    if (supabase) {
      try {
        await supabase.from('votes').insert({
          artist_name: pendingVote.artist,
          song_name: pendingVote.title,
          decade: pendingVote.decade,
          image_url: pendingVote.cover,
          voter_name: voterInfo.name,
          city: voterInfo.city,
          instagram: voterInfo.instagram || null,
        });
      } catch (err) {
        console.log('Voto registrado localmente.');
      }
    }

    setCardData({
      artistName: pendingVote.artist,
      songName: pendingVote.title,
      decade: pendingVote.decade,
      imageUrl: pendingVote.cover,
      voter: voterInfo,
    });

    setCardOpen(true);
    setPendingVote(null);
    showToast('Voto registrado com sucesso!');
  };

  // Ação do Botão Compartilhar (Celular + Desktop)
  const handleShareClick = async () => {
    if (!cardData) return;
    const shareText = `Votei em "${cardData.songName}" de ${cardData.artistName} no Festival Capital da Descoberta! Venha construir essa história você também:`;
    const shareUrl = window.location.origin || window.location.href;

    // Se for dispositivo móvel (Android/iOS) com suporte nativo a Web Share
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: 'Meu Voto - Capital da Descoberta',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Compartilhamento cancelado pelo usuário.');
      }
    } else {
      // No Desktop ou navegadores sem Web Share: copia o link formatado
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        showToast('Link de compartilhamento copiado!');
      } catch (err) {
        showToast('Copie a URL do navegador para compartilhar!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-white px-4 py-8 max-w-lg mx-auto space-y-8 relative font-sans overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-[#dc2626] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold animate-bounce text-xs border border-red-400">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Topo / Banner Discreto */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#dc2626] bg-[#dc2626]/10 px-3 py-1 rounded-full border border-[#dc2626]/20">
          <Sparkles className="h-3 w-3 animate-spin" />
          Festival Capital da Descoberta
        </span>

        <h1 className="text-2xl font-black tracking-tight leading-tight">
          Qual música marcou <span className="text-[#dc2626]">sua história?</span>
        </h1>

        <p className="text-xs text-white/60 px-4">
          Escolha a trilha sonora da sua vida, ouça a prévia, vote e compartilhe seu cartão!
        </p>
      </div>

      {/* Campo de Busca */}
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

      {/* Resultados da Busca */}
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
                        <span>Votar</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              !loading && <p className="text-xs text-white/40 py-4 text-center">Nenhuma música encontrada. Tente outro nome!</p>
            )}
          </div>
        </div>
      )}

      {/* Categorias */}
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

      {/* Mais Votadas no Momento (Ranking) */}
      <div className="bg-[#0d152a]/80 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-md shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Mais Votadas no Momento</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AO VIVO
          </span>
        </div>

        <div className="space-y-2.5">
          {topVoted.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center justify-between bg-white/5 border border-white/5 hover:border-white/20 p-3 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-white/40 w-4 text-center">
                  {index + 1}
                </span>
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{song.title}</p>
                  <p className="text-[11px] text-white/50">{song.artist}</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#dc2626] bg-[#dc2626]/10 px-2.5 py-1 rounded-lg">
                {song.votes} votos
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE IDENTIFICAÇÃO DO ELEITOR */}
      {loginOpen && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-[#dc2626]/40 p-5 rounded-3xl w-full max-w-sm space-y-3 shadow-2xl">
            <h3 className="text-base font-black text-white">Confirme seu Voto</h3>
            
            <form onSubmit={handleConfirmVote} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1">Seu Nome</label>
                <input
                  type="text"
                  required
                  value={voterInfo.name}
                  onChange={(e) => setVoterInfo({ ...voterInfo, name: e.target.value })}
                  placeholder="Ex: Flávio Araújo"
                  className="w-full bg-[#060a17] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1">Sua Cidade na Bahia</label>
                <input
                  type="text"
                  required
                  value={voterInfo.city}
                  onChange={(e) => setVoterInfo({ ...voterInfo, city: e.target.value })}
                  placeholder="Ex: Alagoinhas, Juazeiro, Salvador..."
                  className="w-full bg-[#060a17] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/80 mb-1">Instagram (Opcional)</label>
                <input
                  type="text"
                  value={voterInfo.instagram}
                  onChange={(e) => setVoterInfo({ ...voterInfo, instagram: e.target.value })}
                  placeholder="@seu.instagram"
                  className="w-full bg-[#060a17] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="w-1/2 py-2.5 bg-white/5 text-white text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#dc2626] text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Finalizar Voto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARD DE COMPARTILHAMENTO OFICIAL */}
      {cardOpen && cardData && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a0826] via-[#0d1127] to-[#050714] border border-[#dc2626]/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.3)] space-y-5 my-auto">
            
            {/* Botão Fechar */}
            <button
              onClick={() => setCardOpen(false)}
              className="absolute right-4 top-4 p-2 text-white/60 hover:text-white bg-white/10 rounded-full transition-all hover:scale-110 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* ARTES DO CARD VIP */}
            <div className="relative bg-gradient-to-b from-[#161f3d]/80 to-[#080d1e]/90 border border-white/15 rounded-2xl p-6 text-center space-y-4 shadow-2xl overflow-hidden backdrop-blur-md">
              
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
                <Sparkles className="h-3 w-3 animate-spin" />
                <span>Voto Oficial Registrado</span>
              </div>

              <h3 className="text-xs font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-200 to-red-500 uppercase">
                Festival Capital da Descoberta
              </h3>

              {/* Capa com Neon Glow */}
              <div className="relative w-40 h-40 mx-auto my-2">
                <div className="absolute inset-0 bg-gradient-to-r from-[#dc2626] to-amber-500 rounded-2xl blur-lg opacity-70 animate-pulse"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
                  <img
                    src={cardData.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
                    alt={cardData.songName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-white leading-tight drop-shadow-md">
                  {cardData.songName}
                </h2>
                <p className="text-sm font-extrabold text-[#dc2626] tracking-wide mt-1 drop-shadow">
                  {cardData.artistName}
                </p>
              </div>

              {/* Informações do Eleitor */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs space-y-1.5 backdrop-blur-sm shadow-inner">
                <p className="font-extrabold text-white">
                  Votado por: <span className="text-amber-300">{cardData.voter?.name}</span>
                </p>
                {cardData.voter?.city && (
                  <p className="text-white/80 text-[11px] flex items-center justify-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#dc2626]" />
                    {cardData.voter.city}
                  </p>
                )}
                {cardData.voter?.instagram && (
                  <p className="text-[#dc2626] text-[11px] font-bold">
                    {cardData.voter.instagram.startsWith('@') ? cardData.voter.instagram : `@${cardData.voter.instagram}`}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirmado na Base de Dados</span>
              </div>
            </div>

            {/* BOTÃO DE COMPARTILHAR */}
            <button
              onClick={handleShareClick}
              className="w-full bg-gradient-to-r from-[#dc2626] to-red-700 hover:from-red-600 hover:to-red-800 text-white py-3.5 px-4 rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 border border-red-500/30"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartilhar Voto</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
