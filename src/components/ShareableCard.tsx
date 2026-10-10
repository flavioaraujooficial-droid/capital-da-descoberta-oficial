```tsx
import { useState } from 'react';
import { X, Share2, CheckCircle2, MapPin, Sparkles, Copy } from 'lucide-react';

interface CardData {
  artistName: string;
  songName: string;
  decade: string;
  imageUrl: string;
  voter: {
    name: string;
    city: string;
    instagram: string;
  };
}

interface ShareableCardProps {
  open: boolean;
  onClose: () => void;
  cardData: CardData | null;
  onShare: () => void;
}

export function ShareableCard({ open, onClose, cardData }: ShareableCardProps) {
  const [shareStatus, setShareStatus] = useState('');

  if (!open || !cardData) return null;

  const shareText =
    `Votei em "${cardData.songName}", de ${cardData.artistName}, ` +
    'no Festival Capital da Descoberta! 🎶 ' +
    'Participe também e ajude a escolher as atrações do festival!';

  // Compartilha o endereço público principal, sem parâmetros de navegação.
  const shareUrl = `${window.location.origin}/`;

  const handleShareClick = async () => {
    setShareStatus('');

    const shareData = {
      title: 'Festival Capital da Descoberta',
      text: shareText,
      url: shareUrl,
    };

    // Prioriza o compartilhamento nativo, quando disponível.
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setShareStatus('Convite pronto para compartilhar!');
        return;
      } catch (error) {
        // Cancelar a janela de compartilhamento não é um erro.
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
      }
    }

    // Alternativa para computadores e navegadores sem compartilhamento nativo.
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setShareStatus('Convite e link copiados! Agora é só enviar aos amigos.');
    } catch {
      // Última alternativa: permite selecionar e copiar o convite manualmente.
      window.prompt(
        'Copie o convite abaixo e envie aos seus amigos:',
        `${shareText}\n${shareUrl}`,
      );
    }
  };

  const handleCopyLink = async () => {
    setShareStatus('');

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('Link do festival copiado!');
    } catch {
      window.prompt('Copie o endereço do festival:', shareUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a0826] via-[#0d1127] to-[#050714] border border-[#dc2626]/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.3)] space-y-5 my-auto">

        <button
          onClick={onClose}
          aria-label="Fechar cartão"
          className="absolute right-4 top-4 p-2 text-white/60 hover:text-white bg-white/10 rounded-full transition-all hover:scale-110 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative bg-gradient-to-b from-[#161f3d]/80 to-[#080d1e]/90 border border-white/15 rounded-2xl p-6 text-center space-y-4 shadow-2xl overflow-hidden backdrop-blur-md">

          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#dc2626]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Voto Oficial Registrado</span>
          </div>

          <h3 className="text-xs font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-200 to-red-500 uppercase">
            Festival Capital da Descoberta
          </h3>

          <div className="relative w-40 h-40 mx-auto my-2">
            <div className="absolute inset-0 bg-gradient-to-r from-[#dc2626] to-amber-500 rounded-2xl blur-lg opacity-70 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
              <img
                src={cardData.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'}
                alt={`Capa de ${cardData.songName}`}
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

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs space-y-1.5 backdrop-blur-sm shadow-inner">
            <p className="font-extrabold text-white">
              Votado por:{' '}
              <span className="text-amber-300">{cardData.voter?.name}</span>
            </p>

            {cardData.voter?.city && (
              <p className="text-white/80 text-[11px] flex items-center justify-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-[#dc2626]" />
                {cardData.voter.city}
              </p>
            )}

            {cardData.voter?.instagram && (
              <p className="text-[#dc2626] text-[11px] font-bold">
                {cardData.voter.instagram.startsWith('@')
                  ? cardData.voter.instagram
                  : `@${cardData.voter.instagram}`}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Confirmado na Base de Dados</span>
          </div>
        </div>

        <button
          onClick={handleShareClick}
          className="w-full bg-gradient-to-r from-[#dc2626] to-red-700 hover:from-red-600 hover:to-red-800 text-white py-3.5 px-4 rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 border border-red-500/30"
        >
          <Share2 className="h-4 w-4" />
          <span>Compartilhar e convidar amigos</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full bg-white/10 hover:bg-white/15 text-white py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Copy className="h-4 w-4" />
          <span>Copiar link do festival</span>
        </button>

        {shareStatus && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm text-emerald-300 font-semibold"
          >
            {shareStatus}
          </p>
        )}
      </div>
    </div>
  );
}
```

