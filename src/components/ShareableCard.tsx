import { useEffect, useRef, useState } from 'react';
import { Download, Share2, X, Check, Star } from 'lucide-react';
import type { VoterInfo } from './LoginModal';
import type { Territory } from '@/data/territories';

export type CardData = {
  artistName: string;
  songName: string;
  decade: string;
  imageUrl: string;
  voter: VoterInfo;
  territory: Territory;
};

type ShareableCardProps = {
  open: boolean;
  onClose: () => void;
  card: CardData | null;
};

export function ShareableCard({ open, onClose, card }: ShareableCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [shared, setShared] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!open || !card) return;
    setImgLoaded(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => {
      imgRef.current = null;
      setImgLoaded(true);
    };
    img.src = card.imageUrl;
  }, [open, card]);

  useEffect(() => {
    if (!open || !card || !imgLoaded) return;
    drawCard();
  }, [open, card, imgLoaded]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !card) return;

    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background — deep navy festival atmosphere
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#06101E');
    bgGrad.addColorStop(0.4, '#0d1b2a');
    bgGrad.addColorStop(1, '#06101E');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Ambient glow circles
    ctx.fillStyle = 'rgba(131, 46, 67, 0.08)';
    ctx.beginPath();
    ctx.arc(540, 200, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(220, 38, 38, 0.05)';
    ctx.beginPath();
    ctx.arc(800, 1600, 180, 0, Math.PI * 2);
    ctx.fill();

    // Top brand mark — star + title
    drawStar(ctx, 540, 80, 24, '#dc2626');
    ctx.fillStyle = '#FFEFDE';
    ctx.font = '700 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CAPITAL DA DESCOBERTA', 540, 140);
    ctx.textAlign = 'left';

    // Cover image area
    const coverY = 190;
    const coverH = 1000;
    if (imgRef.current) {
      ctx.save();
      const r = 32;
      const x = 80;
      const y = coverY;
      const w = 920;
      const h = coverH;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(imgRef.current, x, y, w, h);
      ctx.restore();
    } else {
      const grad = ctx.createLinearGradient(80, coverY, 1000, coverY + coverH);
      grad.addColorStop(0, '#0d1b2a');
      grad.addColorStop(1, '#06101E');
      ctx.fillStyle = grad;
      ctx.fillRect(80, coverY, 920, coverH);
    }

    // Bordô accent line
    ctx.fillStyle = '#832E43';
    ctx.fillRect(80, coverY + coverH + 30, 140, 5);

    // Decade badge — bordô background
    ctx.fillStyle = 'rgba(131, 46, 67, 0.3)';
    ctx.fillRect(80, coverY + coverH + 60, 220, 52);
    ctx.strokeStyle = 'rgba(131, 46, 67, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, coverY + coverH + 60, 220, 52);
    ctx.fillStyle = '#FFEFDE';
    ctx.font = '600 24px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.decade, 100, coverY + coverH + 87);

    // Song name (large, off-white)
    ctx.fillStyle = '#FFEFDE';
    ctx.font = 'bold 52px Arial, sans-serif';
    ctx.textBaseline = 'top';
    const songLines = wrapText(ctx, card.songName, 920);
    let textY = coverY + coverH + 145;
    for (const line of songLines.slice(0, 2)) {
      ctx.fillText(line, 80, textY);
      textY += 62;
    }

    // Artist name
    ctx.fillStyle = '#FFEFDE';
    ctx.globalAlpha = 0.5;
    ctx.font = '400 32px Arial, sans-serif';
    ctx.fillText(card.artistName, 80, textY + 10);
    ctx.globalAlpha = 1;
    textY += 70;

    // Divider
    ctx.fillStyle = 'rgba(131, 46, 67, 0.3)';
    ctx.fillRect(80, textY, 920, 1);
    textY += 30;

    // Voter name — red accent
    ctx.fillStyle = '#dc2626';
    ctx.font = '600 38px Arial, sans-serif';
    ctx.fillText(card.voter.name, 80, textY);
    textY += 52;

    // City + territory
    ctx.fillStyle = '#FFEFDE';
    ctx.globalAlpha = 0.7;
    ctx.font = '400 28px Arial, sans-serif';
    ctx.fillText(`${card.voter.city} — Bahia`, 80, textY);
    textY += 40;

    ctx.fillStyle = '#FFEFDE';
    ctx.globalAlpha = 0.5;
    ctx.font = '400 24px Arial, sans-serif';
    ctx.fillText(card.territory.name, 80, textY);
    textY += 38;

    if (card.voter.instagram) {
      ctx.fillStyle = '#dc2626';
      ctx.globalAlpha = 1;
      ctx.font = '400 26px Arial, sans-serif';
      ctx.fillText(`@${card.voter.instagram}`, 80, textY);
    }
    ctx.globalAlpha = 1;

    // Footer seal
    const footerY = 1780;
    ctx.fillStyle = 'rgba(131, 46, 67, 0.2)';
    ctx.fillRect(80, footerY, 920, 70);
    ctx.strokeStyle = 'rgba(131, 46, 67, 0.3)';
    ctx.strokeRect(80, footerY, 920, 70);

    // Small star in footer
    drawStar(ctx, 110, footerY + 35, 10, '#dc2626');

    ctx.fillStyle = '#FFEFDE';
    ctx.font = '600 28px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('capitaldadescoberta.com.br', 140, footerY + 35);

    ctx.fillStyle = '#FFEFDE';
    ctx.globalAlpha = 0.4;
    ctx.font = '400 20px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Festival Capital da Descoberta', 990, footerY + 35);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    color: string,
  ) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `card-${card?.artistName.replace(/\s/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎶 Eu já deixei minha memória marcada no Capital da Descoberta! Escolhi "${card?.songName}" de ${card?.artistName}.\n\nE você, qual música marcou a sua história na Bahia? Clica aí e participe do festival!\n\n👉 https://capitaldadescoberta.com.br`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  if (!open || !card) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#06101E]/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-[#832E43]/30 bg-[#0d1b2a] p-5 sm:p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#FFEFDE]/40 hover:text-[#FFEFDE] transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-[#dc2626] fill-[#dc2626]" />
          <span className="text-xs uppercase tracking-widest text-[#FFEFDE]/60 font-medium">
            Capital da Descoberta
          </span>
        </div>

        <h2 className="text-lg font-bold text-[#FFEFDE] mb-1">Seu card está pronto!</h2>
        <p className="text-xs text-[#FFEFDE]/40 mb-4">
          Formato Story — pronto para compartilhar
        </p>

        {/* Preview canvas */}
        <div className="rounded-2xl overflow-hidden border border-[#832E43]/20 mb-5 bg-[#06101E]">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: '1080/1920' }}
          />
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3.5 transition-colors shadow-lg shadow-[#dc2626]/20"
          >
            <Download className="h-5 w-5" />
            Baixar Imagem do Card
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 transition-colors shadow-lg shadow-emerald-600/20"
          >
            {shared ? <Check className="h-5 w-5 text-white" /> : <Share2 className="h-5 w-5" />}
            {shared ? 'Compartilhado!' : 'Compartilhar no WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}
