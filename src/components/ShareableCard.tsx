import { X, Share2, Download, Award, Music, MapPin, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import type { Territory } from '@/data/territories';
import type { VoterInfo } from './LoginModal';

type ShareableCardProps = {
  open: boolean;
  onClose: () => void;
  cardData: {
    artistName: string;
    songName: string;
    decade: string;
    imageUrl: string;
    voter: VoterInfo;
    territory: Territory;
  } | null;
  onShare: () => void;
};

export function ShareableCard({ open, onClose, cardData, onShare }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!open || !cardData) return null;

  const handleDownload = () => {
    onShare();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#060a17] border border-[#832E43]/40 p-6 sm:p-7 shadow-2xl text-[#FFEFDE]">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-[#FFEFDE]/60 hover:text-[#FFEFDE] hover:bg-black/60 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* O CARD VISUAL (Estilo Crachá VIP / Ingresso Oficial) */}
        <div 
          ref={cardRef} 
          className="relative overflow-hidden rounded-2xl bg-[#06101E] border border-[#dc2626]/40 p-5 shadow-xl text-center mb-5"
        >
          {/* Efeitos de Luz de Fundo (Glow) */}
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#dc2626]/20 blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl"></div>

          {/* Selo Superior / Crachá VIP */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/30 text-[#dc2626] text-[11px] font-semibold tracking-wider uppercase mb-4">
            <Award className="h-3.5 w-3.5" />
            Voto Oficial • Capital da Descoberta
          </div>

          {/* Foto do Artista com Borda Estilizada */}
          <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-2xl border-2 border-[#dc2626]/50 shadow-lg">
            <img 
              src={cardData.imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"} 
              alt={cardData.artistName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Dados da Música e Artista */}
          <div className="space-y-1.5 mb-5">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-medium">
              <Music className="h-3.5 w-3.5" />
              <span>{cardData.decade}</span>
            </div>
            <h4 className="text-xl font-black tracking-tight text-white line-clamp-1">
              {cardData.songName}
            </h4>
            <p className="text-sm font-medium text-[#FFEFDE]/80 line-clamp-1">
              {cardData.artistName}
            </p>
          </div>

          {/* Divisor Elegante */}
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#dc2626]/40 to-transparent"></div>

          {/* Assinatura do Eleitor e Localização */}
          <div className="flex flex-col items-center gap-1 text-xs text-[#FFEFDE]/70">
            <div className="flex items-center gap-1 font-bold text-white">
              <Sparkles className="h-3 w-3 text-[#dc2626]" />
              <span>{cardData.voter.name}</span>
            </div>
            <div className="flex items-center gap-1 text-[#FFEFDE]/50">
              <MapPin className="h-3 w-3 text-[#dc2626]" />
              <span>{cardData.voter.city} • {cardData.territory.name}</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2.5">
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] py-3 text-sm font-bold text-white shadow-lg shadow-[#dc2626]/20 transition-all"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar no WhatsApp / Redes
          </button>
          
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#06101E] border border-[#832E43]/30 py-2.5 text-sm font-medium text-[#FFEFDE]/80 hover:text-white hover:border-[#832E43] transition-all"
          >
            <Download className="h-4 w-4" />
            Baixar Imagem do Card
          </button>
        </div>

      </div>
    </div>
  );
}
