import { X, Share2, Download, Award, Music, MapPin, Sparkles } from 'lucide-react';
import { useRef } from 'react';

// Tipagem simplificada para evitar erros no Vercel
export type VoterInfo = {
  name: string;
  city: string;
  instagram?: string;
};

type ShareableCardProps = {
  open: boolean;
  onClose: () => void;
  cardData: {
    artistName: string;
    songName: string;
    decade: string;
    imageUrl: string;
    voter: VoterInfo;
  } | null;
  onShare: () => void;
  onDownload?: () => void;
};

export function ShareableCard({ open, onClose, cardData, onShare, onDownload }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!open || !cardData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#060a17] border border-[#dc2626]/30 p-5 shadow-2xl text-[#FFEFDE] max-h-[95vh] overflow-y-auto">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* O CARD VISUAL (Pronto para Story do Insta / Status do WhatsApp) */}
        <div 
          ref={cardRef} 
          className="relative overflow-hidden rounded-2xl bg-[#06101E] border border-[#dc2626]/40 p-5 shadow-xl text-center mb-4 mt-2"
        >
          {/* Efeitos de Luz de Fundo (Glow de Festival) */}
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#dc2626]/25 blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/15 blur-2xl"></div>

          {/* Selo Superior */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/30 text-[#dc2626] text-[10px] font-bold tracking-wider uppercase mb-3">
            <Award className="h-3.5 w-3.5" />
            Voto Oficial • Capital da Descoberta
          </div>

          {/* Capa do Artista / Disco */}
          <div className="relative mx-auto mb-3 h-28 w-28 overflow-hidden rounded-2xl border-2 border-[#dc2626]/50 shadow-xl">
            <img 
              src={cardData.imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"} 
              alt={cardData.artistName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Informações da Música */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Music className="h-3.5 w-3.5" />
              <span>{cardData.decade || "Trilha Sonora da Minha Vida"}</span>
            </div>
            <h4 className="text-xl font-black tracking-tight text-white line-clamp-1">
              {cardData.songName}
            </h4>
            <p className="text-sm font-medium text-[#FFEFDE]/80 line-clamp-1">
              {cardData.artistName}
            </p>
          </div>

          {/* Divisor */}
          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-[#dc2626]/40 to-transparent"></div>

          {/* Dados do Eleitor e Cidade */}
          <div className="flex flex-col items-center gap-0.5 text-xs">
            <div className="flex items-center gap-1 font-bold text-white">
              <Sparkles className="h-3 w-3 text-[#dc2626]" />
              <span>{cardData.voter.name}</span>
            </div>
            <div className="flex items-center gap-1 text-[#FFEFDE]/60 text-[11px]">
              <MapPin className="h-3 w-3 text-[#dc2626]" />
              <span>{cardData.voter.city} — Bahia</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2">
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] py-3 text-sm font-bold text-black shadow-lg transition-all"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar no WhatsApp
          </button>
          
          <button
            onClick={onDownload || onShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] py-2.5 text-sm font-semibold text-white transition-all"
          >
            <Download className="h-4 w-4" />
            Baixar Imagem para o Instagram
          </button>
        </div>

      </div>
    </div>
  );
}
