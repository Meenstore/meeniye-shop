import HeroCarousel from './components/HeroCarousel';
import SmoothReveal from './components/SmoothReveal';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import AddToCartButton from './components/AddToCartButton';
import RevealText from './components/RevealText';
import ImageParallaxZoom from './components/ImageParallaxZoom';
import { getProducts } from '@/lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meeniye.com';

export const metadata = {
  title: 'Meeniyé - Cosmétiques Capillaires Naturels - Cheveux Crépus, Frisés & Bouclés',
  description: 'Découvrez Meeniyé : soins capillaires professionnels issus de la pharmacopée afro-caribéenne pour cheveux crépus, frisés et bouclés. Livraison France, DOM-TOM, Suisse.',
  keywords: 'cosmétiques capillaires naturels, cheveux crépus, cheveux frisés, cheveux bouclés, pharmacopée afro-caribéenne, soins capillaires naturels, produits cheveux afro',
  authors: [{ name: 'Meeniyé' }],
  openGraph: {
    title: 'Meeniyé - Cosmétiques Capillaires Naturels',
    description: 'Expertise alliant tradition et recherche. Formules issues de la pharmacopée afro-caribéenne.',
    url: siteUrl,
    siteName: 'Meeniyé',
    images: [
      {
        url: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/collectioncomplete.png?v=1764929709',
        width: 1200,
        height: 630,
        alt: 'Gamme complète Meeniyé - Cosmétiques capillaires naturels',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meeniyé - Cosmétiques Capillaires Naturels',
    description: 'Expertise alliant tradition et recherche. Formules issues de la pharmacopée afro-caribéenne.',
    images: ['https://cdn.shopify.com/s/files/1/0995/3204/6676/files/collectioncomplete.png?v=1764929709'],
  },
};

// Revalider la page toutes les 5 minutes (aligné avec getProducts)
export const revalidate = 300;

export default async function HomePage() {
  // Récupérer les produits depuis Shopify
  let products = [];

  try {
    products = await getProducts(50);
  } catch (error) {
    console.error('Error fetching Shopify data:', error);
    products = [];
  }

  // Filtrer les best-sellers
  const bestSellers = products.filter(p =>
    p.tags && (p.tags.includes('bestseller') || p.tags.includes('Bestseller'))
  ).slice(0, 5);

  // Image hero statique (3e image du carousel)
  const heroImage = {
    src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo1_Shamp_menthe_poivree_modele_homme_copie_4.webp?v=1765198712',
    alt: 'Gamme de produits capillaires Meeniyé'
  };

  /* Images du hero carousel - COMMENTÉ (utilisation d'une image statique à la place)
  const heroImages = [
    {
      src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo8large.webp?v=1765140338',
      alt: 'Meeniyé - Soins capillaires naturels pour cheveux crépus'
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/baume_adoucissant_menthe_poivree_-_large_d8903916-e70e-47b2-9e0c-9520269e5400.webp?v=1765141049',
      alt: 'Baume adoucissant menthe poivrée Meeniyé'
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo1_Shamp_menthe_poivree_modele_homme_copie_4.webp?v=1765198712',
      alt: 'Gamme de produits capillaires Meeniyé'
    },
  ];
  */

  return (
    <>
      <ScrollProgress color="#582900" height={3} />
      <Navbar />

      <main className="bg-[#FFFFFF] text-[#2C3E2F] font-[family-name:var(--font-playfair)]">

        {/* Hero Section avec image statique */}
        <section className="relative min-h-[80vh] overflow-hidden mt-28">
          {/* Image hero avec effet parallax zoom */}
          <ImageParallaxZoom
            src={heroImage.src}
            alt={heroImage.alt}
            height="85vh"
            zoomIntensity={1.15}
          />

          {/* Carrousel commenté - pour réactiver, décommenter heroImages et HeroCarousel
          <HeroCarousel
            images={heroImages}
            height="80vh"
            zoomIntensity={1.30}
            autoplayDelay={5000}
          />
          */}

          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#582900]/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#582900]/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#077532]/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        </section>

        {/* Texte principal */}
        <section className="py-20 px-6 md:px-12 bg-[#FFFFFF]">
          <div className="max-w-5xl mx-auto">
            <SmoothReveal direction="up">
              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tight leading-tight mb-12 text-center">
                Révélez la beauté de vos <span className="text-[#077532]">cheveux crépus</span>
              </h1>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.1}>
              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-[#2C3E2F]/90">
                <p>
                  Révélez la beauté de vos cheveux crépus grâce à une expertise alliant tradition et recherche.
                  Nos formules puisent dans les trésors de la pharmacopée afro-caraïbéenne pour offrir des soins
                  professionnels d'exception, performants et respectueux de la fibre capillaire. Chaque produit a
                  été conçu pour hydrater, nourrir, protéger et magnifier vos cheveux tout en apportant douceur et
                  vitalité à votre cuir chevelu.
                </p>

                <p>
                  Que vous soyez particulier en quête de soins naturels de qualité ou professionnel passionné,
                  découvrez nos gammes complètes adaptées à tous les besoins, disponible en ligne et auprès de nos
                  salons partenaires.
                </p>

                <p className="text-center text-2xl font-bold text-[#077532] pt-6">
                  Offrez à vos cheveux l'alliance parfaite entre nature, science et savoir-faire expert.
                </p>
              </div>
            </SmoothReveal>
          </div>
        </section>

        {/* Galerie de 4 photos horizontales */}
        <section className="py-20 px-6 md:px-12 bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo2_femme_gel_menthe-3.webp?v=1765142771',
                  alt: 'Soins capillaires Meeniyé'
                },
                {
                  src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Photo7_serum_apaisant_recadrage_souhaite.webp?v=1765126146',
                  alt: 'Sérum apaisant Meeniyé'
                },
                {
                  src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Photo13_gel_gombo.webp?v=1765126260',
                  alt: 'Gel de gombo Meeniyé'
                },
                {
                  src: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo12_recadrage_souhaite.webp?v=1765126332',
                  alt: 'Produits capillaires Meeniyé'
                }
              ].map((photo, i) => (
                <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                  <div className="relative h-96 rounded-2xl overflow-hidden group">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </SmoothReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Section Performance Professionnelle */}
        <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <RevealText className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tight mb-8 leading-tight">
                Une performance professionnelle,
              </RevealText>
              <RevealText delay={0.4} className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tight mb-10 leading-tight text-[#077532]">
                pure et naturelle
              </RevealText>
              <RevealText delay={0.8} className="text-2xl md:text-3xl text-[#2C3E2F]/70 font-light tracking-wide">
                pour des cheveux visiblement plus sains
              </RevealText>
            </div>
          </div>
        </section>

        {/* Section Best-sellers - Horizontal */}
        <section className="py-20 px-6 md:px-12 bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <SmoothReveal direction="up">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight mb-16 text-center">
                Nos <span className="text-[#582900]">Best-sellers</span>
              </h2>
            </SmoothReveal>

            <div className="overflow-x-auto pb-8">
              <div className="flex gap-6 min-w-max">
                {bestSellers.length > 0 ? (
                  bestSellers.map((product, i) => (
                    <SmoothReveal key={product.id} direction="up" delay={i * 0.1}>
                      <Link href={`/products/${product.handle}`}>
                        <div className="w-80 group cursor-pointer">
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded bg-[#582900] text-[#FFFFFF]">
                                Best-seller
                              </span>
                            </div>

                            <AddToCartButton
                              variantId={product.variantId}
                              productName={product.name}
                              variant="overlay"
                            />
                          </div>

                          <h3 className="text-xl font-bold mb-2 group-hover:text-[#077532] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-2xl font-bold text-[#077532]">{product.price}€</p>
                        </div>
                      </Link>
                    </SmoothReveal>
                  ))
                ) : (
                  // Placeholder si pas de best-sellers
                  <>
                    <div className="w-80">
                      <div className="aspect-[3/4] rounded-2xl bg-[#F8F9FA] mb-4" />
                      <div className="h-6 bg-[#F8F9FA] rounded mb-2 w-3/4" />
                      <div className="h-8 bg-[#F8F9FA] rounded w-1/4" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/products">
                <button className="px-10 py-5 bg-[#01451c] hover:bg-[#2C3E2F] text-[#FFFFFF] font-bold tracking-wide uppercase transition-all duration-300 rounded-full">
                  Voir tous les produits
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section Lignes de produits - Horizontal */}
        <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <SmoothReveal direction="up">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight mb-16 text-center">
                Nos <span className="text-[#077532]">lignes de produits</span>
              </h2>
            </SmoothReveal>

            <div className="overflow-x-auto pb-8">
              <div className="flex gap-8 min-w-max">
                {[
                  {
                    name: 'Shampoings',
                    image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Photo5_shamp_gombo_menthe_femme.webp?v=1765126832',
                    link: '/collections/shampoings'
                  },
                  {
                    name: 'Masques / Après-shampoings',
                    image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/masque_as_hydratation_intense-copie2.webp?v=1765022042',
                    link: '/collections/masques-apres-shampoings'
                  },
                  {
                    name: 'Crèmes hydratantes',
                    image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/creme_hydratante_menthe_poivree2.webp?v=1765023191',
                    link: '/collections/cremes'
                  },
                  {
                    name: 'Gels de gombo',
                    image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/gel_gombo-copie2.webp?v=1765023486',
                    link: '/collections/gels'
                  },
                  {
                    name: 'Baumes',
                    image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo15_baume_adoucissant_modele.webp?v=1765127118',
                    link: '/collections/baumes'
                  },
                  {
                    name: 'Sérums traitants',
                    image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/photo16_recadrage_souhaite.webp?v=1765127386',
                    link: '/collections/serums-traitants'
                  }
                ].map((category, i) => (
                  <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                    <Link href={category.link}>
                      <div className="w-72 group cursor-pointer">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            sizes="288px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E2F]/60 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-2xl font-bold text-[#FFFFFF]">{category.name}</h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SmoothReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Ingrédients phares */}
        <section className="py-20 px-6 md:px-12 bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto">
            <SmoothReveal direction="up">
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight mb-16 text-center">
                Nos <span className="text-[#077532]">ingrédients phares</span>
              </h2>
            </SmoothReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  name: 'Gombo',
                  subtitle: 'Hydratation profonde',
                  description: 'Riche en mucilages, le gombo apporte une hydratation intense, démêle naturellement et définit les boucles tout en laissant les cheveux doux, brillants et souples.',
                  image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/GOMBO-2.jpg?v=1765155543',
                  color: '#077532'
                },
                {
                  name: 'Beurre de cacao',
                  subtitle: 'Nutrition & protection',
                  description: 'Ultra-nourrissant, le beurre de cacao scelle l\'hydratation, renforce la fibre capillaire et protège les cheveux crépus des agressions extérieures pour une chevelure plus forte et éclatante.',
                  image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/CACAO_d177cf6e-bade-4c3a-8333-a4c82ee38917.jpg?v=1765155534',
                  color: '#582900'
                },
                {
                  name: 'Protéine de riz',
                  subtitle: 'Force & volume',
                  description: 'Légère et fortifiante, la protéine de riz aide à réparer la fibre, redonne du corps et booste le volume, pour des cheveux plus résistants, souples et pleins de vitalité.',
                  image: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/riz2.webp?v=1765024526',
                  color: '#582900'
                }
              ].map((ingredient, i) => (
                <SmoothReveal key={i} direction="up" delay={i * 0.15}>
                  <div className="group">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={ingredient.image}
                        alt={ingredient.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E2F]/70 to-transparent" />
                    </div>

                    <h3 className="text-3xl font-bold mb-2" style={{ color: ingredient.color }}>
                      {ingredient.name}
                    </h3>
                    <h4 className="text-xl font-semibold mb-4 text-[#2C3E2F]">
                      {ingredient.subtitle}
                    </h4>
                    <p className="text-[#2C3E2F]/80 leading-relaxed">
                      {ingredient.description}
                    </p>
                  </div>
                </SmoothReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA vers Notre Histoire */}
        <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#077532]/10 to-[#582900]/10">
          <div className="max-w-4xl mx-auto text-center">
            <SmoothReveal direction="up">
              <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold tracking-tight mb-6">
                Découvrez notre histoire
              </h2>
              <p className="text-xl text-[#2C3E2F]/80 mb-10 leading-relaxed">
                Meeniyé, une marque née de la passion pour la beauté naturelle et ancrée dans les traditions afro-caribéennes
              </p>
              <Link href="/notre-histoire">
                <button className="px-10 py-5 bg-[#01451c] hover:bg-[#2C3E2F] text-[#FFFFFF] font-bold tracking-wide uppercase transition-all duration-300 rounded-full">
                  Notre histoire
                </button>
              </Link>
            </SmoothReveal>
          </div>
        </section>

      </main>
    </>
  );
}
