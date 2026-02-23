import Navbar from '@/app/components/Navbar';
import SmoothReveal from '@/app/components/SmoothReveal';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getPage } from '@/lib/shopify';
import DOMPurify from 'isomorphic-dompurify';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meeniye.com';

export const metadata = {
  title: 'Notre Histoire - Meeniyé | Cosmétiques Capillaires Naturels',
  description: 'Découvrez l\'histoire d\'Anolia, fondatrice de Meeniyé, et l\'origine du nom de notre marque inspiré des traditions afro-caribéennes et du peuple marron Boni.',
  alternates: {
    canonical: '/notre-histoire',
  },
  openGraph: {
    title: 'Notre Histoire - Meeniyé',
    description: 'Une marque née de la passion pour la beauté naturelle et ancrée dans les traditions afro-caribéennes',
    url: `${siteUrl}/notre-histoire`,
    siteName: 'Meeniyé',
    images: [
      {
        url: 'https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Anolia_siteinternet_8ef1b3f1-7feb-4d7c-8ed7-ff3c443bb3bb.jpg?v=1764883812',
        width: 1200,
        height: 630,
        alt: 'Anolia, fondatrice de Meeniyé',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notre Histoire - Meeniyé',
    description: 'Une marque née de la passion pour la beauté naturelle et ancrée dans les traditions afro-caribéennes',
    images: ['https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Anolia_siteinternet_8ef1b3f1-7feb-4d7c-8ed7-ff3c443bb3bb.jpg?v=1764883812'],
  },
};

// Filet de sécurité : revalider toutes les 1h si un webhook Shopify est raté
export const revalidate = 3600;

export default async function NotreHistoirePage() {
  // Récupérer le contenu depuis Shopify
  const pageContent = await getPage('notre-histoire');

  // Contenu par défaut si la page Shopify n'existe pas encore
  const defaultContent = `
    <p><strong style="font-size: 1.5rem; color: #077532; display: block; margin-bottom: 0.5rem;">Anolia, fondatrice de Meeniyé.</strong>
    Originaire de Guyane, terre riche en traditions, en diversité culturelle et en savoirs ancestraux, la fondatrice puise dans ses racines une inspiration profonde, nourrie notamment par la richesse de la pharmacopée afro-caribéenne, qui met en lumière des plantes, huiles et ingrédients naturels utilisés depuis des générations pour sublimer et protéger la beauté naturelle. Ce lien avec ces traditions ancestrales est au cœur de sa vision et guide la création de produits authentiques et respectueux de l'environnement.</p>

    <p>Diplômée d'un master en économie, spécialisé en développement durable, elle débute sa carrière dans le secteur associatif en tant que copilote de projets de développement. Elle rejoint ensuite le secteur public, où elle exerce la fonction de chargée des dispositifs d'aides européennes, avant de se réorienter vers une nouvelle filière plus en accord avec ses aspirations personnelles.</p>

    <p>Cherchant une dimension plus humaine et créative dans son épanouissement professionnel, elle se tourne vers la coiffure, domaine qu'elle pratique d'abord par passion. Pour donner forme à cette vocation, elle passe son brevet de technicien supérieur métiers de la coiffure, qu'elle complète par une formation en formulation et en création de marque de produits cosmétiques naturels.</p>

    <h3 style="font-size: 2rem; font-weight: bold; margin-top: 3rem; margin-bottom: 1.5rem;"><span style="color: #077532;">Meeniyé</span>, un nom. Une histoire.</h3>

    <p style="font-size: 1.5rem; font-weight: bold; color: #077532;">"Le nom de ma marque, Meeniyé, est un hommage rendu à ma grand-mère Ameeniyé, femme guyanaise issue du peuple marron Boni.</p>

    <p>Ce prénom, chargé d'histoire et de sens, est une porte ouverte sur mes racines profondes, une reconnexion intime avec une culture forgée par la résistance, la liberté et la créativité."</p>
  `;

  const content = pageContent ? pageContent.body : defaultContent;

  return (
    <>
      <Navbar />

      <main className="bg-[#FFFFFF] text-[#2C3E2F] font-[family-name:var(--font-playfair)] min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Fil d'ariane & Retour */}
          <SmoothReveal direction="up">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#2C3E2F]/75 hover:text-[#077532] transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </SmoothReveal>

          {/* Section Fondatrice - Anolia */}
          <section className="mb-32">
            <SmoothReveal direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#582900]/10 border border-[#582900]/20 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-[#582900]" />
                <span className="text-sm font-medium text-[#582900] tracking-wide uppercase">
                  Notre Histoire
                </span>
              </div>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.1}>
              <div className="space-y-6 text-lg text-[#2C3E2F]/85 leading-relaxed">
                {/* Photo flottante à gauche sur desktop */}
                <div className="float-none lg:float-left lg:w-[45%] lg:mr-8 mb-6 lg:mb-0">
                  <div className="relative aspect-[3/4] max-h-[800px] rounded-3xl overflow-hidden">
                    <Image
                      src="https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Anolia_siteinternet_8ef1b3f1-7feb-4d7c-8ed7-ff3c443bb3bb.webp?v=1765024188"
                      alt="Anolia, fondatrice de Meeniyé"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Contenu dynamique depuis Shopify */}
                <div
                  className="prose prose-lg max-w-none [&>p]:mb-6 [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:text-3xl [&>h3]:font-bold"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content, {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'span', 'div'],
                      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style']
                    })
                  }}
                />
              </div>
            </SmoothReveal>
          </section>

          {/* CTA Section */}
          <SmoothReveal direction="up">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#077532]/20 to-[#582900]/20 p-16">
              <div className="relative text-center">
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tighter mb-6">
                  Découvrez notre gamme complète
                </h2>
                <p className="text-xl text-[#2C3E2F]/75 mb-10 max-w-2xl mx-auto">
                  Des soins professionnels inspirés de la pharmacopée afro-caribéenne
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/products">
                    <button className="px-10 py-5 bg-[#01451c] hover:bg-[#2C3E2F] text-[#FFFFFF] text-sm font-bold tracking-wide uppercase transition-all duration-300 rounded-full">
                      Découvrir nos produits
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="px-10 py-5 bg-white hover:bg-[#F8F9FA] text-[#2C3E2F] border border-[#2C3E2F]/20 text-sm font-bold tracking-wide uppercase transition-all duration-300 rounded-full">
                      Nous contacter
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SmoothReveal>

        </div>
      </main>
    </>
  );
}
