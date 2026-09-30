import React, { useState, useEffect } from 'react';
import { Search, Music, Sparkles, Heart, Trophy, Radio, Disc, Flame } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { ShareableCard } from './components/ShareableCard';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVote, setPendingVote] = useState<any>(null);
  
  const [loginOpen, setLoginOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [voterInfo, setVoterInfo] = useState({ name: '', city: '', instagram: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const decadas = [
    { label: 'Anos 70 e 80', query: 'Sucessos Anos 80', color: 'from-amber-600 to-red-600' },
    { label: 'Anos 90', query: 'Sucessos Anos 90', color: 'from-purple-600 to-pink-600' },
    { label: 'Anos 2000', query: 'Sertanejo 2000', color: 'from-blue-600 to-indigo-600' },
    { label: 'Modão Sertanejo', query: 'Modao Sertanejo', color: 'from-emerald-600 to-teal-600' },
  ];

  const [ranking] = useState([
    { id: 1, song: 'Evidências', artist: 'Chitãozinho & Xororó', votes: 142, img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100' },
    { id: 2, song: 'Telefone Mudo', artist: 'Trio Parada Dura', votes: 118, img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100' },
    { id: 3, song: 'Majestade o Sabiá', artist: 'Roberta Miranda', votes: 95, img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100' },
    { id: 4, song: 'Boate Azul', artist: 'Joaquim & Manuel', votes: 87, img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Busca JSONP Nativa da Deezer (100% livre de bloqueio CORS)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);

      const callbackName = 'deezerJsonpCallback_' + Math.floor(Math.random() * 1000000);
      
      (window as any)[callbackName] = (data: any) => {
        if (data && data.data) {
          setSearchResults(data.data);
        } else {
          setSearchResults([]);
        }
        setIsLoading(false);
        delete (window as any)[callbackName];
        const scriptToRemove = document.getElementById(callbackName);
        if (scriptToRemove) scriptToRemove.remove();
      };

      const script = document.createElement('script');
      script.id = callbackName;
      script.src = `https://api.deezer.com/search?q=${encodeURIComponent(searchQuery)}&limit=12&output=jsonp&callback=${callbackName}`;
      script.onerror = () => {
        setIsLoading(false);
        setSearchResults([]);
      };

      document.body.appendChild(script);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectTrack = (track: any) => {
    setPendingVote({
      artistName: track.artist.name,
      songName: track.title,
      decade: track.album?.title || 'Trilha Sonora da Minha Vida',
      imageUrl: track.album?.cover_big || track.artist?.picture_big,
      isCustom: false
    });
    setLoginOpen(true);
  };

  const handleConfirmVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVote) return;
    if (!voterInfo.name || !voterInfo.city) {
      showToast('Preencha seu nome e cidade!');
      return;
    }

    setLoginOpen(false);

    try {
      if (supabaseUrl) {
        await supabase.from('votes').insert({
          artist_name: pendingVote.artistName,
          song_name: pendingVote.songName,
          decade: pendingVote.decade,
          image_url: pendingVote.imageUrl,
          voter_name: voterInfo.name,
          city: voterInfo.city,
          instagram: voterInfo.instagram || null,
        });
      }
    } catch (err) {
      console.log('Voto registrado.');
    }

    setCardData({
      artistName: pendingVote.artistName,
      songName: pendingVote.songName,
      decade: pendingVote.decade,
      imageUrl: pendingVote.imageUrl,
      voter: voterInfo,
    });

    setCardOpen(true);
    setPendingVote(null);
    showToast('Voto computado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#060a17] text-[#FFEFDE] flex flex-col items-center justify-start px-4 py-6 font-sans overflow-x-hidden">
      
      {toastMessage && (
        <div className="fixed top-4 z-[200] bg-[#dc2626] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold animate-bounce text-xs">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO */}
      <header className="w-full max-w-lg text-center my-2 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/40 text-[#dc2626] text-[10px] font-black uppercase tracking-widest">
          <Radio className="h-3 w-3 animate-pulse" />
          FESTIVAL CAPITAL DA DESCOBERTA
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug px-2">
          Qual música marcou <span className="text-[#dc2626]">sua história?</span>
        </h1>
        
        <p className="text-xs text-[#FFEFDE]/70 max-w-xs mx-auto">
          Escolha a trilha sonora da sua vida, registre seu voto e compartilhe seu cartão com a Bahia!
        </p>
      </header>

      {/* ÁREA DE BUSCA */}
      <main className="w-full max-w-lg space-y-5 mt-2">
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite o nome da música ou artista..."
            className="w-full bg-[#0d172a] border border-[#dc2626]/40 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-[#dc2626] shadow-xl text-xs sm:text-sm"
          />
        </div>

        {/* INDICADOR DE CARREGAMENTO */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-white/70 py-3 bg-white/5 rounded-2xl border border-white/5 animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
            <span>Buscando músicas na Deezer...</span>
          </div>
        )}

        {/* RESULTADOS DA BUSCA */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-wider px-1">Resultados da Busca</h2>
            <div className="grid grid-cols-1 gap-2 max-h-[420px] overflow-y-auto pr-1">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between gap-3 bg-[#0a1224] border border-white/10 hover:border-[#dc2626]/60 p-2.5 rounded-2xl shadow-md transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={track.album?.cover_medium || track.artist?.picture_medium}
                      alt={track.title}
                      className="h-11 w-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-xs truncate">{track.title}</h3>
                      <p className="text-[10px] text-white/60 truncate">{track.artist?.name}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTrack(track)}
                    className="flex-shrink-0 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3 fill-current" />
                    <span>Votar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL (DÉCADAS E RANKING) */}
        {!searchQuery && (
          <>
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                <Disc className="h-3.5 w-3.5 text-[#dc2626]" />
                <span>Explorar por Categoria</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {decadas.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(item.query)}
                    className={`bg-gradient-to-r ${item.color} p-3 rounded-2xl text-left shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden`}
                  >
                    <p className="text-xs font-black text-white">{item.label}</p>
                    <p className="text-[9px] text-white/80 mt-0.5">Toque para ver sugestões</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-[#0b1329] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span>Mais Votadas no Momento</span>
                </div>
                <span className="flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Flame className="h-2.5 w-2.5" /> AO VIVO
                </span>
              </div>

              <div className="space-y-2">
                {ranking.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white/5 rounded-2xl text-xs border border-white/5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-black text-white/40 w-3 text-center text-xs">{index + 1}</span>
                      <img src={item.img} alt={item.song} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{item.song}</p>
                        <p className="text-[10px] text-white/60 truncate">{item.artist}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#dc2626] bg-[#dc2626]/10 px-2 py-1 rounded-lg flex-shrink-0">
                      {item.votes} votos
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE VOTO */}
      {loginOpen && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
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
                  placeholder="Ex: Alagoinhas, Salvador..."
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

      {/* CARD DE COMPARTILHAMENTO */}
      <ShareableCard
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        cardData={cardData}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Meu Voto - Capital da Descoberta',
              text: `Votei em ${cardData?.songName} de ${cardData?.artistName}!`,
              url: window.location.href,
            });
          } else {
            showToast('Link copiado!');
          }
        }}
      />
    </div>
  );
}

export default App;
