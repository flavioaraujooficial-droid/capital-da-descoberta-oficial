import { useState } from 'react';
import { X, Share2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0B1B33] border border-[#832E43]/40 rounded-2xl p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-6 h-6"/>
        </button>

        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400 shadow-lg">
            <img
              src={cardData.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
              alt={cardData.artistName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{cardData.artistName}</h3>
            <p className="text-sm text-amber-400 font-medium">{cardData.songName}</p>
            <p className="text-xs text-gray-400 mt-1">Indicado por: {cardData.voter.name} ({cardData.voter.city})</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleShareClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#dc2626] to-[#832E43] hover:from-[#b91c1c] hover:to-[#6b2131] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Share2 className="w-5 h-5"/>
              Compartilhar Indicação
            </button>
          </div>

          {shareStatus && (
            <p
              role="status"
              aria-live="polite"
              className="text-xs text-emerald-400 bg-emerald-950/40 py-2 px-3 rounded-lg border border-emerald-800/40"
            >
              {shareStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
