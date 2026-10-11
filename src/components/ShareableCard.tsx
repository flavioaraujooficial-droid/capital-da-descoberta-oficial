import { useState } from 'react';
import { X, Share2, Check, Copy, Sparkles, MapPin } from 'lucide-react';

interface VoterInfo {
  name: string;
  city: string;
}

interface CardData {
  artistName: string;
  songName: string;
  decade: string;
  imageUrl: string;
  voter: VoterInfo;
}

interface ShareableCardProps {
  open: boolean;
  onClose: () => void;
  cardData: CardData | null;
  onShare?: () => void;
}

export function ShareableCard({ open, onClose, cardData }: ShareableCardProps) {
  const [shareStatus, setShareStatus] = useState('');

  if (!open || !cardData) return null;

  const shareText = `Estou na torcida por ${cardData.artistName} com a música "${cardData.songName}" no Festival Capital da Descoberta! 🎶✨ Quero ver esse artista fazendo parte dessa grande festa! Participe também e ajude a escolher as atrações.`;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '';

  const handleShareClick = async () => {
    setShareStatus('');

    const shareData = {
      title: 'Festival Capital da Descoberta',
      text: shareText,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setShareStatus('Convite pronto para compartilhar!');
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShareStatus('Convite e link copiados! Agora é só enviar aos amigos.');
      }
    } catch {
      window.prompt(
        'Copie o convite abaixo e envie aos seus amigos:',
        `${shareText}\n${shareUrl}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0B1B33] via-[#071324] to-[#040A14] border border-[#832E43]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-6">
          
          {/* Cabeçalho do Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Card Oficial de Torcida</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Festival Capital da Descoberta
            </h2>
            <p className="text-xs text-gray-400">
              Apoie seu artista favorito rumo ao grande palco!
            </p>
          </div>

          {/* Destaque do Artista / Música */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg flex-shrink-0">
              <img
                src={cardData.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
                alt={cardData.artistName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                {cardData.decade || 'Atração'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                {cardData.artistName}
              </h3>
              <p className="text-sm text-gray-300 font-medium truncate">
                🎵 {cardData.songName}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span className="truncate">Indicado por {cardData.voter.name} ({cardData.voter.city})</span>
              </div>
            </div>
          </div>

          {/* Mensagem compartilhável pré-formatada */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-300 italic text-center">
            "{shareText}"
          </div>

          {/* Botão de Ação */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleShareClick}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#dc2626] to-[#832E43] hover:from-[#b91c1c] hover:to-[#6b2131] text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/40 transition-all transform active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar Indicação Agora
            </button>

            {shareStatus && (
              <div 
                role="status"
                aria-live="polite"
                className="text-xs text-emerald-400 bg-emerald-950/60 py-2.5 px-4 rounded-xl border border-emerald-800/40 text-center font-medium animate-fadeIn flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{shareStatus}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
