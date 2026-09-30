import React from 'react';
import { Share2, X, Music, CheckCircle2 } from 'lucide-react';

interface ShareableCardProps {
  open: boolean;
  onClose: () => void;
  cardData: {
    artistName: string;
    songName: string;
    decade?: string;
    imageUrl?: string;
    voter?: {
      name: string;
      city: string;
      instagram?: string;
    };
  } | null;
  onShare?: () => void;
}

export function ShareableCard({ open, onClose, cardData, onShare }: ShareableCardProps) {
  if (!open || !cardData) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-[#0b1329] border border-[#dc2626]/40 rounded-3xl p-5 shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-b from-[#111c3a] to-[#060a17] border border-[#dc2626]/30 rounded-2xl p-6 text-center space-y-4 text-white relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#dc2626] text-[10px] font-extrabold uppercase tracking-widest">
            <Music className="h-3 w-3" />
            Voto Oficial Registrado
          </div>

          <h2 className="text-[#FFEFDE] text-xs uppercase tracking-wider font-semibold opacity-80">
            Festival Capital da Descoberta
          </h2>

          <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-[#dc2626]/40">
            <img
              src={cardData.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
              alt={cardData.songName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white leading-tight">
              {cardData.songName}
            </h3>
            <p className="text-sm font-medium text-[#dc2626]">
              {cardData.artistName}
            </p>
          </div>

          <hr className="border-white/10 my-2" />

          {cardData.voter && (
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs space-y-1">
              <p className="font-bold text-white">
                Votado por: <span className="text-[#FFEFDE]">{cardData.voter.name}</span>
              </p>
              <p className="text-white/70">
                📍 {cardData.voter.city}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-1 text-[10px] text-white/40 pt-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>Voto Registrado</span>
          </div>
        </div>

        <button
          onClick={onShare}
          className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 rounded-xl font-bold text-xs shadow-lg transition-all"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar Voto
        </button>

      </div>
    </div>
  );
}
