import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Philosophie from '@/components/Philosophie';
import Formate from '@/components/Formate';
import Justierung from '@/components/Justierung';
import Material from '@/components/Material';
import Lichtintegration from '@/components/Lichtintegration';
import Visualisierung from '@/components/Visualisierung';
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
        <Philosophie />
        <Formate />
        <Justierung />
        <Material />
        <Lichtintegration />
        <Visualisierung />
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
