import { getCollection } from '@/lib/shopify';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import SmoothReveal from '@/app/components/SmoothReveal';
import ImageParallaxZoom from '@/app/components/ImageParallaxZoom';
import AddToCartButton from '@/app/components/AddToCartButton';
import { ArrowLeft, Smartphone, Laptop, Watch, Headphones, Package } from 'lucide-react';
import { notFound } from 'next/navigation';

// Mapper les catégories Shopify aux icônes Lucide
const getCategoryIcon = (category) => {
  const categoryLower = (category || '').toLowerCase();

  if (categoryLower.includes('phone') || categoryLower.includes('mobile')) return Smartphone;
  if (categoryLower.includes('laptop') || categoryLower.includes('computer')) return Laptop;
  if (categoryLower.includes('watch')) return Watch;
  if (categoryLower.includes('headphone') || categoryLower.includes('audio') || categoryLower.includes('écouteur')) return Headphones;

  return Package; // Icône par défaut pour accessoires/autres
};

// Mapper les catégories Shopify (en anglais) vers les noms français
const getCategoryDisplayName = (category) => {
  const categoryMapping = {
    'Mobile & Smart Phones': 'Smartphones',
    'Laptops': 'Ordinateurs portables',
    'Smart Watches': 'Montres Connectées',
    'Over-Ear Headphones': 'Écouteurs & Audio',
    'Accessories': 'Accessoires'
  };

  return categoryMapping[category] || category;
};

export async function generateMetadata({ params }) {
  const { tag: handle } = await params;

  try {
    const collection = await getCollection(handle);

    if (!collection) {
      return {
        title: 'Collection non trouvée - TechStore',
      };
    }

    return {
      title: `${collection.title} - TechStore`,
      description: collection.description || `Découvrez notre collection ${collection.title.toLowerCase()}`,
    };
  } catch (error) {
    return {
      title: 'Collection - TechStore',
    };
  }
}

export default async function CollectionPage({ params }) {
  const { tag: handle } = await params;

  let collection = null;

  try {
    // ✅ Utilise l'API Collections Shopify (filtrage serveur optimal)
    collection = await getCollection(handle, 100);
  } catch (error) {
    console.error('Error fetching collection:', error);
  }

  if (!collection) {
    notFound();
  }

  // Ajouter des tags dynamiques basés sur les tags Shopify
  const enhancedProducts = collection.products.map((product) => {
    let displayTag = null;
    if (product.tags) {
      if (product.tags.includes('new') || product.tags.includes('New') || product.tags.includes('nouveautés')) displayTag = 'New';
      else if (product.tags.includes('bestseller') || product.tags.includes('Bestseller')) displayTag = 'Bestseller';
      else if (product.tags.includes('limited') || product.tags.includes('Limited')) displayTag = 'Limited';
      else if (product.tags.includes('promo') || product.tags.includes('Promo')) displayTag = 'Promo';
    }
    return { ...product, displayTag };
  });

  return (
    <>
      <Navbar />

      <main className="bg-[#FFFFFF] text-[#2C3E2F] font-[family-name:var(--font-playfair)] min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Fil d'ariane & Retour */}
          <SmoothReveal direction="up">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#2C3E2F]/75 hover:text-[#077532] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </SmoothReveal>

          {/* En-tête de collection */}
          <SmoothReveal direction="up" delay={0.1}>
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#077532]/10 border border-[#077532]/20 rounded-full mb-6">
                <div className="h-2 w-2 bg-[#01451c] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#077532] tracking-wide uppercase">
                  Collection
                </span>
              </div>

              <h1 className="text-[clamp(3rem,8vw,6rem)] font-black tracking-tighter mb-4">
                {collection.title}
              </h1>

              {collection.description && (
                <p className="text-xl text-[#2C3E2F]/75 mb-6">
                  {collection.description}
                </p>
              )}

              <p className="text-lg text-[#2C3E2F]/70">
                {collection.products.length} produit{collection.products.length > 1 ? 's' : ''} disponible{collection.products.length > 1 ? 's' : ''}
              </p>
            </div>
          </SmoothReveal>

          {/* Grille de produits */}
          {collection.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enhancedProducts.map((product, i) => (
                <SmoothReveal key={product.id} direction="up" delay={i * 0.05}>
                  <Link href={`/products/${product.handle}`} className="block group">
                    <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                      <ImageParallaxZoom
                        src={product.image}
                        alt={product.name}
                        height="100%"
                        zoomIntensity={1.1}
                      />

                      <div className="absolute inset-0 bg-[#FFFFFF]/0 group-hover:bg-[#FFFFFF]/20 transition-all duration-500" />

                      {product.displayTag && (
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded ${
                            product.displayTag === 'New' ? 'bg-[#582900] text-[#2C3E2F]' :
                            product.displayTag === 'Bestseller' ? 'bg-[#582900] text-[#FFFFFF]' :
                            product.displayTag === 'Promo' ? 'bg-[#582900] text-[#FFFFFF]' :
                            'bg-[#01451c] text-[#FFFFFF]'
                          }`}>
                            {product.displayTag}
                          </span>
                        </div>
                      )}

                      {/* Bouton Add to Cart en overlay */}
                      <AddToCartButton
                        variantId={product.variantId}
                        productName={product.name}
                        variant="overlay"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#077532] font-medium tracking-wide uppercase">
                          {getCategoryDisplayName(product.category)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold group-hover:text-[#077532] transition-colors duration-300">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${product.price}</span>
                        {(() => {
                          const Icon = getCategoryIcon(product.category);
                          return <Icon className="w-6 h-6 text-[#077532]" />;
                        })()}
                      </div>
                    </div>
                  </Link>
                </SmoothReveal>
              ))}
            </div>
          ) : (
            <SmoothReveal direction="up">
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏷️</div>
                <h2 className="text-2xl font-bold mb-2">Aucun produit disponible</h2>
                <p className="text-[#2C3E2F]/75 mb-8">
                  Aucun produit n&apos;a été trouvé dans cette collection pour le moment.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-4 bg-[#01451c] hover:bg-[#2C3E2F] text-[#FFFFFF] font-medium tracking-wide uppercase transition-all duration-300"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </SmoothReveal>
          )}

        </div>
      </main>
    </>
  );
}
