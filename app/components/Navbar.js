'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import Link from 'next/link';

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cartCount, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si on est tout en haut (< 100px), toujours afficher
      if (currentScrollY < 100) {
        setIsVisible(true);
      }
      // Si on remonte (scrolling up), afficher
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      // Si on descend (scrolling down), cacher
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        isVisible
          ? 'top-8 bg-white/95 backdrop-blur-xl border-b border-[#582900]/10 shadow-lg'
          : '-top-32 bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 mt-2">
          <div className="flex items-center justify-between">
            {/* Menu Hamburger - Gauche */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-[#2C3E2F] hover:text-[#077532] transition-colors p-2 flex items-center"
              aria-label="Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo - Centre */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center mb-4 mt-2">
              <img
                src="/logorefined-2.png"
                alt="Meeniyé"
                className="h-16 md:h-17 w-auto"
              />
            </Link>

            {/* Icône Panier - Droite */}
            <button
              onClick={openDrawer}
              className="relative text-[#2C3E2F] hover:text-[#077532] transition-colors p-2 flex items-center"
              title="Ouvrir le panier"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#582900] text-[#FFFFFF] text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu déroulant */}
      {showMobileMenu && (
        <div className="fixed top-30 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-b border-[#582900]/10 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
            <div className="flex flex-col gap-6">
              <div className="relative">
                <button
                  onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                  className="text-lg font-semibold text-[#2C3E2F]/75 hover:text-[#077532] transition-colors tracking-wide flex items-center gap-2"
                >
                  Nos gammes complètes
                  <svg
                    className={`w-5 h-5 transition-transform ${showCategoriesMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showCategoriesMenu && (
                  <div className="mt-4 ml-6 flex flex-col gap-4">
                    <Link
                      href="/collections/hydratation-intense"
                      onClick={() => setShowMobileMenu(false)}
                      className="text-base text-[#2C3E2F]/70 hover:text-[#077532] transition-colors"
                    >
                      Gamme Hydratation Intense
                    </Link>
                    <Link
                      href="/collections/gamme-revigorante"
                      onClick={() => setShowMobileMenu(false)}
                      className="text-base text-[#2C3E2F]/70 hover:text-[#077532] transition-colors"
                    >
                      Gamme Revigorante
                    </Link>
                    <Link
                      href="/collections/serums-traitants"
                      onClick={() => setShowMobileMenu(false)}
                      className="text-base text-[#2C3E2F]/70 hover:text-[#077532] transition-colors"
                    >
                      Sérums Traitants
                    </Link>
                    <Link
                      href="/collections/produits-unite"
                      onClick={() => setShowMobileMenu(false)}
                      className="text-base text-[#2C3E2F]/70 hover:text-[#077532] transition-colors"
                    >
                      Produits à l&apos;unité
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/products"
                onClick={() => setShowMobileMenu(false)}
                className="text-lg font-semibold text-[#2C3E2F]/75 hover:text-[#077532] transition-colors tracking-wide"
              >
                Tous nos produits
              </Link>

              <Link
                href="/notre-histoire"
                onClick={() => setShowMobileMenu(false)}
                className="text-lg font-semibold text-[#2C3E2F]/75 hover:text-[#077532] transition-colors tracking-wide"
              >
                Notre histoire
              </Link>

              <Link
                href="/espace-pro"
                onClick={() => setShowMobileMenu(false)}
                className="text-lg font-semibold text-[#2C3E2F]/75 hover:text-[#077532] transition-colors tracking-wide"
              >
                Espace pro
              </Link>

              <Link
                href="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="text-lg font-semibold text-[#2C3E2F]/75 hover:text-[#077532] transition-colors tracking-wide"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
