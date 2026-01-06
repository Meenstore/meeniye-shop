'use client';

import { Truck, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBanner() {
  const [showLaunchBanner, setShowLaunchBanner] = useState(false);

  useEffect(() => {
    // Date de lancement : 19 janvier 2026
    const launchDate = new Date('2026-01-19T00:00:00');
    const now = new Date();

    // Afficher le bandeau d'annonce uniquement avant la date de lancement
    setShowLaunchBanner(now < launchDate);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Bandeau d'annonce d'ouverture (temporaire jusqu'au 19 janvier) */}
      {showLaunchBanner && (
        <div className="bg-[#077532] text-white py-2 px-4 text-center text-xs md:text-sm font-semibold">
          <div className="flex items-center justify-center gap-1">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Ouverture de la boutique en ligne prévue autour du 19 janvier</span>
          </div>
        </div>
      )}

      {/* Bandeau de livraison permanent */}
      <div className="bg-[#582900] text-white py-3 md:py-2 px-4 text-center text-xs md:text-sm font-medium">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Livraison France, DOM-TOM & Suisse</span>
          </div>
          <span className="hidden md:inline">-</span>
          <span className="whitespace-nowrap">Gratuite dès 70€ (France) | 100€ (DOM-TOM & Suisse)</span>
        </div>
      </div>
    </div>
  );
}
