import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify';
import SmoothReveal from '@/app/components/SmoothReveal';
import ScrollProgress from '@/app/components/ScrollProgress';
import Navbar from '@/app/components/Navbar';
import AddToCartButton from '@/app/components/AddToCartButton';
import Link from 'next/link';
import { Truck, RotateCcw, Lock, ArrowLeft } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';

// Mapper les catégories Shopify (en anglais) vers les noms français
const getCategoryDisplayName = (category) => {
  const categoryMapping = {
    'Shampoos': 'Shampoings',
    'Conditioners': 'Après-shampoings',
    'Masks': 'Masques',
    'Creams': 'Crèmes',
    'Gels': 'Gels',
    'Balms': 'Baumes',
    'Serums': 'Sérums',
    'Hair Care': 'Soins Capillaires'
  };

  return categoryMapping[category] || category;
};

// Générer les metadata dynamiques pour le SEO
export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meeniye.com';

  return {
    title: `${product.name} | Meeniyé - Cosmétiques Capillaires Naturels`,
    description: product.description || `Découvrez ${product.name}, soin capillaire naturel pour cheveux crépus, frisés et bouclés. Formule issue de la pharmacopée afro-caribéenne.`,
    alternates: {
      canonical: `/products/${product.handle}`,
    },
    openGraph: {
      title: `${product.name} - Meeniyé`,
      description: product.description,
      url: `${siteUrl}/products/${product.handle}`,
      siteName: 'Meeniyé',
      images: [
        {
          url: product.images[0]?.url,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Meeniyé`,
      description: product.description,
      images: [product.images[0]?.url],
    },
  };
}

// Générer les pages statiques au build time pour de meilleures performances
export async function generateStaticParams() {
  try {
    const products = await getProducts(50);
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Permettre la génération dynamique des pages pour les nouveaux produits
// Si un produit n'était pas dans generateStaticParams, il sera rendu à la demande (SSR)
export const dynamicParams = true;

// Revalider les pages statiques toutes les 10 minutes pour économiser les crédits Netlify
export const revalidate = 600; // 10 minutes

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  // Sélectionner le premier variant disponible par défaut
  const defaultVariant = product.variants.find(v => v.availableForSale) || product.variants[0];

  return (
    <>
      <ScrollProgress color="#582900" height={3} />
      <Navbar />

      <main className="bg-[#FFFFFF] text-[#2C3E2F] font-[family-name:var(--font-playfair)] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-20">
          {/* Retour à l'accueil */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#2C3E2F]/75 hover:text-[#077532] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Images Section */}
            <div className="space-y-4">
              <SmoothReveal direction="left">
                <div className="relative aspect-[3/4] max-h-[700px] rounded-2xl overflow-hidden bg-[#F8F9FA]">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#2C3E2F]/70">
                      Aucune image disponible
                    </div>
                  )}
                </div>
              </SmoothReveal>

              {/* Images secondaires */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {product.images.slice(1, 5).map((image, i) => (
                    <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F8F9FA]">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </SmoothReveal>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-8">
              <div>
                <SmoothReveal direction="right">
                  <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tighter mb-6">
                    {product.name}
                  </h1>
                </SmoothReveal>

                <SmoothReveal direction="right" delay={0.2}>
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-4xl font-bold text-[#077532]">
                      {product.currency} € {product.price.toFixed(2)}
                    </span>
                  </div>
                </SmoothReveal>
              </div>

              <SmoothReveal direction="right" delay={0.3}>
                <div className="border-t border-[#2C3E2F]/10 pt-8">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <div
                    className="text-[#2C3E2F]/80 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(product.descriptionHtml || product.description, {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code'],
                        ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
                      })
                    }}
                  />
                </div>
              </SmoothReveal>

              {/* Variants */}
              {product.variants.length > 1 && (
                <SmoothReveal direction="right" delay={0.4}>
                  <div className="border-t border-[#2C3E2F]/10 pt-8">
                    <h3 className="text-lg font-bold mb-4">Variantes disponibles</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant, i) => (
                        <button
                          key={i}
                          disabled={!variant.availableForSale}
                          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                            variant.availableForSale
                              ? 'border-[#2C3E2F]/20 hover:border-[#077532] hover:bg-[#077532]/10'
                              : 'border-[#2C3E2F]/10 text-[#2C3E2F]/70 cursor-not-allowed opacity-50'
                          } ${i === 0 && variant.availableForSale ? 'border-[#077532] bg-[#077532]/10' : ''}`}
                        >
                          <span className="block text-sm font-medium">{variant.title}</span>
                          {variant.title !== 'Default Title' && (
                            <span className="block text-xs text-[#2C3E2F]/75 mt-1">
                              €{variant.price.toFixed(2)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </SmoothReveal>
              )}

              {/* Add to Cart */}
              <SmoothReveal direction="right" delay={0.5}>
                <div className="border-t border-[#2C3E2F]/10 pt-8 space-y-4">
                  <AddToCartButton
                    variantId={defaultVariant.id}
                    productName={product.name}
                    variant="default"
                  />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#2C3E2F]/5 hover:border-[#077532]/30 transition-colors">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-[#582900]" />
                      <div className="text-xs text-[#2C3E2F]/70">Livraison gratuite</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#2C3E2F]/5 hover:border-[#077532]/30 transition-colors">
                      <RotateCcw className="w-8 h-8 mx-auto mb-2 text-[#077532]" />
                      <div className="text-xs text-[#2C3E2F]/70">Retour 30 jours</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#2C3E2F]/5 hover:border-[#077532]/30 transition-colors">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-[#582900]" />
                      <div className="text-xs text-[#2C3E2F]/70">Paiement sécurisé</div>
                    </div>
                  </div>
                </div>
              </SmoothReveal>

              {/* Product Details */}
              <SmoothReveal direction="right" delay={0.6}>
                <div className="border-t border-[#2C3E2F]/10 pt-8">
                  <h3 className="text-lg font-bold mb-4">Détails du produit</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-[#2C3E2F]/5">
                      <span className="text-[#2C3E2F]/70">Catégorie</span>
                      <span className="font-medium">{getCategoryDisplayName(product.category)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#2C3E2F]/5">
                      <span className="text-[#2C3E2F]/70">Disponibilité</span>
                      <span className="font-medium text-green-500">En stock</span>
                    </div>
                    {product.tags.length > 0 && (
                      <div className="flex justify-between py-2 border-b border-[#2C3E2F]/5">
                        <span className="text-[#2C3E2F]/70">Tags</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {product.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded bg-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SmoothReveal>
            </div>
          </div>

          {/* Back to Shop Button */}
          <SmoothReveal direction="up" delay={0.7}>
            <div className="mt-16 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-[#2C3E2F]/10 hover:border-[#077532]/50 text-[#2C3E2F] text-sm font-medium tracking-wide uppercase transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour à la boutique
              </Link>
            </div>
          </SmoothReveal>
        </div>
      </main>
    </>
  );
}
