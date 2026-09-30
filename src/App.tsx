import React, { useState, useEffect } from 'react';
import { Search, Disc, Flame, Music2, Radio, Sparkles, Trophy, Play, CheckCircle2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  preview?: string;
  votes?: number;
}

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  // Lista Fixa das Mais Votadas (Ranking)
  const topVoted: Song[] = [
    { id: '1', title: 'Evidências', artist: 'Chitãozinho & Xororó', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100', votes: 142 },
    { id: '2', title: 'Telefone Mudo', artist: 'Trio Parada Dura', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100', votes: 118 },
    { id: '3', title: 'Majestade o Sabiá', artist: 'Roberta Miranda', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100', votes: 95 },
    { id: '4', title: 'Boate Azul', artist: 'Joaquim & Manuel', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100', votes: 87 },
  ];

  const categories = [
    { id: '70s80s', label: 'Anos 70 e 80', desc: 'Clássicos Inesquecíveis', icon: Disc, color: 'from-amber-500/20 to-red-600/20 border-amber-500/40 text-amber-300' },
    { id: '90s', label: 'Anos 90', desc: 'Época de Ouro', icon: Radio, color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-300' },
    { id: '2000s', label: 'Anos 2000', desc: 'Sucessos Marcantes', icon: Music2, color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300' },
    { id: 'sertanejo', label: 'Modão Sertanejo', desc: 'As Melhores do Brasil', icon: Flame, color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
  ];

  // Busca de Músicas via API do Deezer
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.deezer.com/search?q=${encodeURIComponent(searchTerm)}&output=jsonp`,
          { method: 'GET' }
        );
        // Fallback para fetch direto se jsonp não for necessário no browser
        const res = await fetch(`https://corsproxy.io/?https://api.deezer.com/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();

        if (data && data.data) {
          const formattedSongs: Song[] = data.data.slice(0, 8).map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            artist: item.artist.name,
            cover: item.album.cover_medium,
            preview: item.preview,
          }));
          setSearchResults(formattedSongs);
        }
      } catch (error) {
        console.error('Erro na busca de músicas:', error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#070b19] text-white px-4 py-8 max-w-lg mx-auto space-y-8">
      
      {/* Topo discreto */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#dc2626] bg-[#dc2626]/10 px-3 py-1 rounded-full border border-[#dc2626]/20">
          <Sparkles className="h-3 w-3" />
          Festival Capital da Descoberta
        </span>

        <h1 className="text-2xl font-black tracking-tight leading-tight">
          Qual música marcou <span className="text-[#dc2626]">sua história?</span>
        </h1>

        <p className="text-xs text-white/60 px-4">
          Escolha a trilha sonora da sua vida, ouça a prévia, vote e compartilhe seu cartão!
        </p>
      </div>

      {/* BUSCADOR */}
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
        </div>
      </div>

      {/* RESULTADOS DA BUSCA (Aparecem quando o usuário digita) */}
      {searchTerm.trim() !== '' && (
        <div className="space-y-3 bg-[#0d152a] border border-white/10 rounded-2xl p-4 shadow-2xl">
          <h3 className="text-xs font-bold text-white/70 uppercase">
            {loading ? 'Buscando músicas...' : 'Resultados da busca:'}
          </h3>

          <div className="space-y-2">
            {searchResults.length > 0 ? (
              searchResults.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={song.cover} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{song.title}</p>
                      <p className="text-[11px] text-white/60">{song.artist}</p>
                    </div>
                  </div>
                  <button className="bg-[#dc2626] hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all">
                    Votar
                  </button>
                </div>
              ))
            ) : (
              !loading && <p className="text-xs text-white/40 py-2 text-center">Nenhuma música encontrada.</p>
            )}
          </div>
        </div>
      )}

      {/* CATEGORIAS */}
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
                  onClick={() => setSearchTerm(cat.label)}
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

      {/* MAIS VOTADAS NO MOMENTO */}
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

    </div>
  );
}

export default App;
