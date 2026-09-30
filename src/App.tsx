import React, { useState, useEffect } from 'react';
import { Search, Music, Sparkles, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { ShareableCard } from './components/ShareableCard';

// Substitua pelas suas credenciais do Supabase se necessário
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVote, setPendingVote] = useState<any>(null);
  
  // Modais e Estados do Form
  const [loginOpen, setLoginOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [voterInfo, setVoterInfo] = useState({ name: '', city: '', instagram: '' });
  
  // Toast / Mensagens
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Busca na Deezer via API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.deezer.com/search?q=${encodeURIComponent(searchQuery)}&limit=10`
        );
        const data = await response.json();
        if (data && data.data) {
          setSearchResults(data.data);
        }
      } catch (err) {
        console.error('Erro ao buscar músicas:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Função para Iniciar Voto
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

  // Confirmação do Voto + Mapeamento Invisível de Territórios no Supabase
  const handleConfirmVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVote) return;
    if (!voterInfo.name || !voterInfo.city) {
      showToast('Por favor, preencha nome e cidade.');
      return;
    }

    setLoginOpen(false);

    let territorioFinal = 'Bahia';
    const cidadeLower = voterInfo.city.toLowerCase().trim();

    const regioesMetropolitanaSalvador = [
      'salvador', 'camaçari', 'lauro de freitas', 'simões filho',
      'candeias', 'mata de são joão', 'são sebastião do passé', 'madre de deus',
      'itaparica', 'vera cruz', "dias d'ávila"
    ];

    const regioesLitoralNorteAgreste = [
      'catu', 'alagoinhas', 'aramari', 'araçás', 'acajutiba', 'apora', 'inhambupe',
      'entre rios', 'esplanada', 'conde', 'crisópolis', 'jeremoabo', 'ribeira do pombal',
      'serrinha', 'retirolândia', 'barrocas', 'teofilândia', 'biritinga', 'coaraci'
    ];

    const regioesFeiraReconcavo = [
      'feira de santana', 'santo amaro', 'cachoeira', 'são félix', 'muritiba',
      'governador mangabeira', 'sapeaçu', 'cruz das almas', 'santo antônio de jesus',
      'amargosa', 'laje', 'são miguel das matas', 'muniz ferreira', 'saubara'
    ];

    const regioesSulBaiano = [
      'itabuna', 'ilhéus', 'canavieiras', 'eunápolis',
      'porto seguro', 'santa cruz cabrália', 'prado', 'itamaraju', 'teixeira de freitas'
    ];

    const regioesSudoestePlanalto = [
      'vitória da conquista', 'poções', 'planalto', 'ibicuí', 'itapetinga',
      'guanambi', 'caetité', 'macarani', 'itambé'
    ];

    const regioesSertaoSaoFrancisco = [
      'juazeiro', 'senhor do bonfim', 'jacobina', 'campo formoso', 'euclides da cunha',
      'paulo afonso', 'santa brígida', 'canudos', 'casa nova', 'remanso'
    ];

    if (regioesMetropolitanaSalvador.some((c) => cidadeLower.includes(c))) {
      territorioFinal = 'Região Metropolitana de Salvador';
    } else if (regioesLitoralNorteAgreste.some((c) => cidadeLower.includes(c))) {
      territorioFinal = 'Litoral Norte e Agreste Baiano';
    } else if (regioesFeiraReconcavo.some((c) => cidadeLower.includes(c))) {
      territorioFinal = 'Recôncavo e Portal do Sertão';
    } else if (regioesSulBaiano.some((c) => cidadeLower.includes(c))) {
      territorioFinal = 'Sul e Extremo Sul Baiano';
    } else if (regioesSudoestePlanalto.some((c) => cidadeLower.includes(c))) {
      territorioFinal = 'Sudoeste e Planalto Conquistense';
    } else if (regioesSertaoSaoFrancisco.some((c) => cidadeLower.includes(c))) {
      territorioFinal = 'Sertão e São Francisco';
    }

    // Salva no banco Supabase
    try {
      await supabase.from('votes').insert({
        artist_name: pendingVote.artistName,
        song_name: pendingVote.songName,
        decade: pendingVote.decade,
        image_url: pendingVote.imageUrl,
        voter_name: voterInfo.name,
        city: voterInfo.city,
        instagram: voterInfo.instagram || null,
        is_custom: pendingVote.isCustom || false,
        territory: territorioFinal,
      });
    } catch (err) {
      console.log('Gravação em modo offline/sem supabase ativo');
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
    showToast('Voto confirmado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#060a17] text-[#FFEFDE] flex flex-col items-center justify-start p-4 sm:p-6 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 z-[200] bg-[#dc2626] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-bold animate-bounce">
          <Sparkles className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO LIMPO (Sem Territórios Poluindo) */}
      <header className="w-full max-w-xl text-center my-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626] text-xs font-bold uppercase tracking-widest">
          <Music className="h-4 w-4" />
          Festival Capital da Descoberta
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Qual música marcou a <span className="text-[#dc2626]">sua história?</span>
        </h1>
        <p className="text-sm sm:text-base text-[#FFEFDE]/70 max-w-md mx-auto">
          Escolha a trilha sonora da sua vida, registre seu voto oficial e compartilhe o seu card com a Bahia!
        </p>
      </header>

      {/* CAMPO DE BUSCA DE MÚSICAS */}
      <main className="w-full max-w-xl space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite o nome da música ou artista..."
            className="w-full bg-[#0d172a] border border-[#dc2626]/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-[#dc2626] shadow-xl text-base"
          />
        </div>

        {/* LISTA DE RESULTADOS DA BUSCA */}
        {isLoading && (
          <p className="text-center text-sm text-white/50 animate-pulse">Buscando na Deezer...</p>
        )}

        <div className="space-y-3">
          {searchResults.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between gap-3 bg-[#0a1224] border border-white/5 hover:border-[#dc2626]/50 p-3 rounded-2xl shadow-md transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={track.album?.cover_medium || track.artist?.picture_medium}
                  alt={track.title}
                  className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-white text-base truncate">{track.title}</h3>
                  <p className="text-xs text-white/60 truncate">{track.artist?.name}</p>
                  
                  {/* Player de 30s da Deezer */}
                  {track.preview && (
                    <audio controls src={track.preview} className="h-6 w-48 mt-1 opacity-80" />
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSelectTrack(track)}
                className="flex-shrink-0 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1"
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
                Votar
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE IDENTIFICAÇÃO DO ELEITOR (NOME E CIDADE) */}
      {loginOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-[#dc2626]/40 p-6 rounded-3xl w-full max-w-sm space-y-4 text-left shadow-2xl">
            <h3 className="text-xl font-black text-white">Quase lá! Quem está votando?</h3>
            <p className="text-xs text-white/60">
              Sua cidade será exibida no seu Card de Voto Oficial!
            </p>

            <form onSubmit={handleConfirmVote} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Seu Nome / Apelido</label>
                <input
                  type="text"
                  required
                  value={voterInfo.name}
                  onChange={(e) => setVoterInfo({ ...voterInfo, name: e.target.value })}
                  placeholder="Ex: Flávio Araújo"
                  className="w-full bg-[#060a17] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Sua Cidade na Bahia</label>
                <input
                  type="text"
                  required
                  value={voterInfo.city}
                  onChange={(e) => setVoterInfo({ ...voterInfo, city: e.target.value })}
                  placeholder="Ex: Alagoinhas, Camaçari, Salvador..."
                  className="w-full bg-[#060a17] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">Instagram (Opcional)</label>
                <input
                  type="text"
                  value={voterInfo.instagram}
                  onChange={(e) => setVoterInfo({ ...voterInfo, instagram: e.target.value })}
                  placeholder="@seu.instagram"
                  className="w-full bg-[#060a17] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginOpen(false)}
                  className="w-1/2 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-lg"
                >
                  Confirmar Voto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARD COMPARTILHÁVEL */}
      <ShareableCard
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        cardData={cardData}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Meu Voto Oficial - Festival Capital da Descoberta',
              text: `Eu votei na música "${cardData?.songName}" do ${cardData?.artistName}! Monte o seu voto também!`,
              url: window.location.href,
            });
          } else {
            showToast('Link de compartilhamento copiado!');
          }
        }}
      />
    </div>
  );
}

export default App;
