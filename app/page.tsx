import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ImageBand from '@/components/ImageBand';
import Philosophie from '@/components/Philosophie';
import Formate from '@/components/Formate';
import Justierung from '@/components/Justierung';
import Material from '@/components/Material';
import Profilsystem from '@/components/Profilsystem';
import Lichtintegration from '@/components/Lichtintegration';
import Visualisierung from '@/components/Visualisierung';
import Rundgang from '@/components/Rundgang';
import Projekte from '@/components/Projekte';
import Kalkulator from '@/components/Kalkulator';
import Technik from '@/components/Technik';
import Anwendung from '@/components/Anwendung';
import Kontakt from '@/components/Kontakt';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Preloader />
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <Philosophie />
        <ImageBand
          src="/renders/villa-day.jpg"
          alt="Wohnhaus mit vertikaler KANELO Lamellenfassade bei Tageslicht"
          eyebrow="Außenfassade · Hinterlüftet"
          title="Ein Haus, das seine Struktur trägt."
          caption="Vertikale Aluminiumlamellen als durchgängige Gebäudehülle — präzise Gliederung vom Sockel bis zur Attika."
          href="#projekte"
          cta="Projekte ansehen"
        />
        <Formate />
        <Justierung />
        <Material />
        <Profilsystem />
        <Lichtintegration />
        <Visualisierung />
        <Rundgang />
        <Projekte />
        <Kalkulator />
        <Technik />
        <Anwendung />
        <Kontakt />
      </main>
      <Footer />
    </>
  );
}
