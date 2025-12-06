import Navbar from '@/app/components/Navbar';
import SmoothReveal from '@/app/components/SmoothReveal';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meeniye.com';

export const metadata = {
  title: 'Notre Histoire - Meeniyé | Cosmétiques Capillaires Naturels',
  description: 'Découvrez l\'histoire d\'Anolia, fondatrice de Meeniyé, et l\'origine du nom de notre marque inspiré des traditions afro-caribéennes et du peuple marron Boni.',
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

export default function NotreHistoirePage() {
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
                  <div className="relative h-[500px] rounded-3xl overflow-hidden">
                    <Image
                      src="https://cdn.shopify.com/s/files/1/0995/3204/6676/files/Anolia_siteinternet_8ef1b3f1-7feb-4d7c-8ed7-ff3c443bb3bb.webp?v=1765024188"
                      alt="Anolia, fondatrice de Meeniyé"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF]/60 via-transparent to-transparent" />

                    {/* Badge décoratif */}
                    <div className="absolute top-8 right-8 bg-[#582900]/90 backdrop-blur-sm px-6 py-3 rounded-full">
                      <span className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wide">Fondatrice</span>
                    </div>
                  </div>
                </div>

                <p>
                  <strong className="text-[#077532] text-2xl block mb-2">Anolia, fondatrice de Meeniyé.</strong>
                  Originaire de Guyane, terre riche en traditions, en diversité culturelle et en savoirs ancestraux, la fondatrice puise dans ses racines une inspiration profonde, nourrie notamment
                  par la richesse de la pharmacopée afro-caraïbéenne, qui met en lumière des plantes, huiles et ingrédients
                  naturels utilisés depuis des générations pour sublimer et protéger la beauté naturelle. Ce lien avec ces
                  traditions ancestrales est au cœur de sa vision et guide la création de produits authentiques et respectueux
                  de l&apos;environnement.
                </p>

                    <p>
                      Diplômée d&apos;un master en économie, spécialisé en développement durable, elle débute sa carrière dans le
                      secteur associatif en tant que copilote de projets de développement. Elle rejoint ensuite le secteur public,
                      où elle exerce la fonction de chargée des dispositifs d&apos;aides européennes, avant de se réorienter vers une
                      nouvelle filière plus en accord avec ses aspirations personnelles.
                    </p>

                    <p>
                      Cherchant une dimension plus humaine et créative dans son épanouissement professionnel, elle se tourne vers
                      la coiffure, domaine qu&apos;elle pratique d&apos;abord par passion. Pour donner forme à cette vocation, elle passe son
                      brevet de technicien supérieur métiers de la coiffure, qu&apos;elle complète par une formation en formulation et en
                      création de marque de produits cosmétiques naturels.
                    </p>

                    <p>
                      Elle débute sa nouvelle carrière dans un salon spécialisé à Genève (Suisse), où elle cumule simultanément les
                      responsabilités de chargée des affaires commerciales et d&apos;experte capillaire dédiée aux cheveux texturés, un
                      poste valorisant son savoir-faire technique et relationnel. Parallèlement elle met toute son énergie et sa
                      passion à élaborer sa propre gamme de produits cosmétiques, alliant rigueur et passion. Après s&apos;être forgée
                      une solide expérience dans des salons spécialisés à Genève, elle s&apos;investit aujourd&apos;hui avec passion dans le
                      développement d&apos;une marque porteuse de sens.
                    </p>

                    <p>
                      Femme engagée et déterminée, elle consacre depuis plus de trois ans et demi une énergie constante à la
                      formulation de ses produits. Elle est animée par la volonté de proposer le meilleur à celles et ceux qui
                      recherchent des solutions authentiques inspirées des trésors de la pharmacopée afro-caraïbéenne. Son immersion
                      quotidienne dans l&apos;univers des cheveux texturés lui a permis de développer une expertise précieuse, essentielle
                      pour comprendre les besoins spécifiques des cheveux crépus, frisés et bouclés.
                    </p>

                    <p>
                      Cette connaissance fine et cette double maîtrise guident la création de chaque produit de sa gamme, afin
                      d&apos;offrir des soins professionnels parfaitement adaptés et efficaces, élaborés en parfaite connaissance des
                      besoins spécifiques des cheveux crépus souvent méconnus.
                    </p>

                    <p className="text-xl font-semibold text-[#077532] italic border-l-4 border-[#077532] pl-6">
                      Pour elle, le soin des cheveux crépus va bien au-delà de l&apos;esthétique : &quot;c&apos;est un chemin de développement
                      personnel, d&apos;acceptation de soi et d&apos;émancipation du regard des autres&quot;.
                    </p>

                    <p>
                      Elle propose à chaque femme et à chaque homme un accompagnement sur mesure, encourageant chacune et chacun
                      à embrasser son authenticité et à célébrer son histoire.
                    </p>

                    <p>
                      Dans ce projet, elle met en avant la diversité et l&apos;unicité de chaque parcours capillaire, plaçant le respect
                      et l&apos;écoute au cœur de sa démarche. Sa marque invite à une (re)découverte de soi, une connexion à ses racines,
                      à son histoire, à sa force affirmant que chaque texture, chaque boucle raconte une histoire à valoriser.
                    </p>

                    <h3 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tighter leading-tight mt-12 mb-6">
                      <span className="text-[#077532]">Meeniyé</span>, un nom. Une histoire.
                    </h3>

                    <p className="text-2xl font-bold text-[#077532]">
                      &quot;Le nom de ma marque, Meeniyé, est un hommage rendu à ma grand-mère Ameeniyé, femme guyanaise
                      issue du peuple marron Boni.
                    </p>

                    <p>
                      Ce prénom, chargé d&apos;histoire et de sens, est une porte ouverte sur mes racines profondes, une reconnexion
                      intime avec une culture forgée par la résistance, la liberté et la créativité.
                    </p>

                    <p>
                      Les marrons Boni ont bravé l&apos;oppression du système esclavagiste pour fonder des sociétés libres le long du
                      fleuve Maroni, dans cet écrin luxuriant où la forêt amazonienne donne vie à la mémoire des Ancêtres. Ce
                      peuple de guerriers est connu pour sa grande résilience et son histoire de liberté.
                    </p>

                    <p>
                      Après leur auto libération, les Boni ont élaboré une culture, une langue et des savoirs nouveaux. Ils
                      symbolisent la force, la résistance et la paix retrouvée.
                    </p>

                    <p>
                      Ma grand-mère, dont le prénom a inspiré le nom de la marque, incarne ces valeurs essentielles à travers
                      son parcours de vie, marqué par la ténacité, l&apos;amour et la sagesse.
                    </p>

                    <p>
                      Au-delà de cette symbolique forte, la marque s&apos;appuie sur une philosophie ancestrale du soin, inspirée de
                      la pharmacopée afro-caraïbéenne. Meeniyé est ainsi une véritable célébration de la beauté noire, enracinée
                      dans la nature et la culture, puisant sa force dans un héritage historique et familial. C&apos;est une marque
                      qui invite à la reconnexion avec soi-même, avec ses racines, avec la richesse d&apos;un peuple et de plusieurs
                      continents.
                    </p>

                    <p className="text-xl font-semibold text-[#582900]">
                      Elle traduit aussi ce lien profond entre générations. On retrouve dans Meeniyé la complicité et la douceur
                      d&apos;une grand-mère et de sa petite-fille, liées par l&apos;amour, la transmission et la mémoire.&quot;
                    </p>
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
