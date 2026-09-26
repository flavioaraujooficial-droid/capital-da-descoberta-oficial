import { Star } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#832E43]/15 mt-12">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#832E43]/40" />
          <Star className="h-3 w-3 text-[#dc2626] fill-[#dc2626]" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#832E43]/40" />
        </div>
        <p className="text-xs text-[#FFEFDE]/40 tracking-wide">
          Festival Capital da Descoberta — Bahia, Brasil | 2026-2027
        </p>
        <p className="mt-1 text-xs text-[#FFEFDE]/20">FlavioAraujo.com</p>
      </div>
    </footer>
  );
}
