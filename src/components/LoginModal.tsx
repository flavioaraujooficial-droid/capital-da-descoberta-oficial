import { useState } from 'react';
import { X, Instagram, User, MapPin, Check, Star } from 'lucide-react';
import { BAHIAN_CITIES } from '@/data/artists';
import type { Territory } from '@/data/territories';

export type VoterInfo = {
  name: string;
  city: string;
  instagram: string;
};

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (info: VoterInfo) => void;
  selectedLabel: string;
  territory: Territory;
};

export function LoginModal({ open, onClose, onConfirm, selectedLabel, territory }: LoginModalProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [instagram, setInstagram] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Digite seu nome.');
      return;
    }
    if (!city.trim()) {
      setError('Selecione sua cidade.');
      return;
    }
    onConfirm({
      name: name.trim(),
      city: city.trim(),
      instagram: instagram.trim().replace(/^@/, ''),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#06101E]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-[#832E43]/30 bg-[#0d1b2a] p-6 sm:p-8 shadow-2xl animate-[slideUp_0.3s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#FFEFDE]/40 hover:text-[#FFEFDE] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-[#dc2626] fill-[#dc2626]" />
          <span className="text-xs uppercase tracking-widest text-[#FFEFDE]/60 font-medium">
            Capital da Descoberta
          </span>
        </div>

        <h2 className="text-xl font-bold text-white">Quase lá!</h2>
        <p className="mt-1 text-sm text-[#FFEFDE]/60">
          Confirmando seu voto em:{' '}
          <span className="text-[#dc2626] font-medium">{selectedLabel}</span>
        </p>

        {/* Territory badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#832E43]/15 border border-[#832E43]/30 px-3 py-1">
          <MapPin className="h-3 w-3 text-[#dc2626]" />
          <span className="text-xs text-[#FFEFDE]/70">{territory.name}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#FFEFDE]/50 mb-1.5">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFEFDE]/30" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Seu nome"
                className="w-full rounded-xl bg-[#06101E] border border-[#832E43]/20 pl-10 pr-4 py-3 text-sm text-[#FFEFDE] placeholder:text-[#FFEFDE]/30 outline-none focus:border-[#dc2626]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#FFEFDE]/50 mb-1.5">
              Cidade na Bahia
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFEFDE]/30 z-10" />
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setError('');
                }}
                className="w-full rounded-xl bg-[#06101E] border border-[#832E43]/20 pl-10 pr-4 py-3 text-sm text-[#FFEFDE] outline-none focus:border-[#dc2626]/50 transition-colors appearance-none"
              >
                <option value="">Selecione...</option>
                {BAHIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#FFEFDE]/50 mb-1.5">
              Instagram (opcional)
            </label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFEFDE]/30" />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seuinstagram"
                className="w-full rounded-xl bg-[#06101E] border border-[#832E43]/20 pl-10 pr-4 py-3 text-sm text-[#FFEFDE] placeholder:text-[#FFEFDE]/30 outline-none focus:border-[#dc2626]/50 transition-colors"
              />
            </div>
          </div>

          {/* Social quick login icons */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-[#FFEFDE]/40">Login rápido:</span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:scale-110 transition-transform"
              title="Instagram"
            >
              <Instagram className="h-4 w-4 text-white" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white hover:scale-110 transition-transform text-sm font-bold text-gray-900"
              title="Google"
            >
              G
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 hover:scale-110 transition-transform text-sm font-bold text-white"
              title="Facebook"
            >
              f
            </button>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3 transition-colors shadow-lg shadow-[#dc2626]/20"
          >
            <Check className="h-5 w-5" />
            Confirmar Voto
          </button>
        </form>
      </div>
    </div>
  );
}
