'use client';

import { Truck } from 'lucide-react';

export default function TopBanner() {
  return (
    <div className="bg-[#582900] text-white py-3 md:py-2 px-4 text-center text-xs md:text-sm font-medium fixed top-0 left-0 right-0 z-50">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <div className="flex items-center gap-1">
          <Truck className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Livraison France, DOM-TOM & Suisse</span>
        </div>
        <span className="hidden md:inline">-</span>
        <span className="whitespace-nowrap">Gratuite dès 70€ (France) | 100€ (DOM-TOM & Suisse)</span>
      </div>
    </div>
  );
}
