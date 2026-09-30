import React from 'react';
import { X, Share2, CheckCircle2, Music, MapPin } from 'lucide-react';

interface ShareableCardProps {
  open: boolean;
  onClose: () => void;
  cardData: any;
  onShare: () => void;
}

export function ShareableCard({ open, onClose, cardData }: ShareableCardProps) {
  if (!open || !cardData) return null;

  const handleShareClick = async () => {
    const shareText = `Votei em ${cardData.songName} de ${cardData.artistName} no Festival Capital da Descoberta! Vote você também:`;
    const shareUrl = window.location.href;

    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: 'Meu Voto - Capital da Descoberta',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Compartilhamento cancelado.');
      }
    } else {
      // Fallback para Desktop: Copiar link com o texto
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Link de compartilhamento copiado para a área de transferência!');
      } catch (err) {
        alert('Copie o link da página para compartilhar!');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0b1329] border border-[#dc2626]/40 rounded-3xl p-6 shadow-2xl space-y-5 my-auto">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-white/60 hover:text-white bg-white/5 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* CARTÃO VISUAL DE VOTO */}
        <div className="bg-gradient-to-b from-[#111c38] to-[#060a17] border border-white/10 rounded-2xl p-5 text-center space-y-4 shadow-inner relative overflow-hidden">
          
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#dc2626] bg-[#dc2626]/10 px-3 py-1 rounded-full border border-[#dc2626]/20">
            <Music className="h-3 w-3" />
            <span>Voto Oficial Registrado</span>
          </div>

          <h3 className="text-xs font-black tracking-widest text-white/80 uppercase">
            Festival Capital da Descoberta
          </h3>

          {/* CAPA DA MÚSICA / ARTISTA */}
          <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
            <img
              src={cardData.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'}
              alt={cardData.songName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-black text-white leading-tight px-2">
              {cardData.songName}
            </h2>
            <p className="text-sm font-bold text-[#dc2626] mt-1">
              {cardData.artistName}
            </p>
          </div>

          {/* DADOS DO VOTANTE */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs space-y-1">
            <p className="font-extrabold text-white">
              Votado por: <span className="text-white/90">{cardData.voter?.name}</span>
            </p>
            {cardData.voter?.city && (
              <p className="text-white/70 text-[11px] flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3 text-[#dc2626]" />
                {cardData.voter.city}
              </p>
            )}
            {cardData.voter?.instagram && (
              <p className="text-[#dc2626] text-[11px] font-semibold">
                {cardData.voter.instagram.startsWith('@') ? cardData.voter.instagram : `@${cardData.voter.instagram}`}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-semibold pt-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Voto Registrado no Supabase</span>
          </div>
        </div>

        {/* BOTÃO COMPARTILHAR */}
        <button
          onClick={handleShareClick}
          className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3.5 px-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Share2 className="h-4 w-4" />
          <span>Compartilhar Voto</span>
        </button>
      </div>
    </div>
  );
}
