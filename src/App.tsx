import React, { useState } from 'react';
import { Search, Disc, Flame, Music2, Radio, Sparkles } from 'lucide-react';

export function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: '70s80s', label: 'Anos 70 e 80', desc: 'Clássicos Inesquecíveis', icon: Disc, color: 'from-amber-500/20 to-red-600/20 border-amber-500/40 text-amber-300' },
    { id: '90s', label: 'Anos 90', desc: 'Época de Ouro', icon: Radio, color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-300' },
    { id: '2000s', label: 'Anos 2000', desc: 'Sucessos Marcantes', icon: Music2, color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300' },
    { id: 'sertanejo', label: 'Modão Sertanejo', desc: 'As Melhores do Brasil', icon: Flame, color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300' },
  ];

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

      {/* BUSCADOR EM DESTAQUE (Glow sutil para destacar) */}
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

      {/* CATEGORIAS MODERNIZADAS (Cards translúcidos com brilho de borda) */}
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

    </div>
  );
}

export default App;
