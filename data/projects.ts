export interface Project {
  id: string;
  title: string;
  location: string;
  categories: Array<'aussen' | 'innen' | 'decke'>;
  timeOfDay: Array<'tag' | 'nacht'>;
  format: '90' | '30' | '15' | 'rhythmus';
  description: string;
  images: string[];
  /** Real photography/render in /public — shown instead of the schematic placeholder. */
  photo?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'penthouse-terrasse',
    title: 'Penthouse-Terrasse',
    location: 'Studie · Skyline-Lage',
    categories: ['aussen'],
    timeOfDay: ['nacht'],
    format: 'rhythmus',
    description:
      'Freistehende Lamellenwand als Raumkante einer Dachterrasse. Nach Einbruch der Dunkelheit verwandelt die integrierte LED-Technik die Schattenfugen in warme Lichtlinien — die Wand wird zur Leuchte, ohne eine einzige sichtbare Armatur.',
    images: ['/renders/penthouse-night.jpg'],
    photo: '/renders/penthouse-night.jpg',
  },
  {
    id: 'villa-lamellenfassade',
    title: 'Villa mit Lamellenfassade',
    location: 'Studie · Wohnbau',
    categories: ['aussen'],
    timeOfDay: ['tag'],
    format: 'rhythmus',
    description:
      'Durchgängige Gebäudehülle aus vertikalen Aluminiumlamellen — vom Obergeschoss über den Einschnitt der Fensterbänder bis zur Garagenzone. Die Fassade gliedert den Baukörper, filtert Einblicke und bleibt dabei vollständig hinterlüftet.',
    images: ['/renders/villa-day.jpg'],
    photo: '/renders/villa-day.jpg',
  },
  {
    id: 'empfang-lobby',
    title: 'Empfang & Lobby',
    location: 'Studie · Objektbau',
    categories: ['innen'],
    timeOfDay: ['tag', 'nacht'],
    format: '30',
    description:
      'Raumhohe Lamellenwand als ruhiger Hintergrund eines Empfangsbereichs. Indirekte Lichtvouten oben und unten lösen die Wand vom Boden und von der Decke — das System wirkt schwebend, präzise, selbstverständlich.',
    images: ['/renders/lobby-empfang.jpg'],
    photo: '/renders/lobby-empfang.jpg',
  },
  {
    id: 'studio-rhythmus-nacht',
    title: 'Wandkomposition bei Nacht',
    location: 'Studie · Rhythmus 90 · 30 · 15',
    categories: ['innen'],
    timeOfDay: ['nacht'],
    format: 'rhythmus',
    description:
      'Studioaufnahme einer Wandkomposition im freien Rhythmus, aus den realen Gussprofilen aufgebaut. Nach Einbruch der Dunkelheit übernehmen die LED-Fugen die Zeichnung der Wand.',
    images: ['/renders/gallery/rhythmus-nacht.jpg'],
    photo: '/renders/gallery/rhythmus-nacht.jpg',
  },
  {
    id: 'studio-fine-15',
    title: 'Textur Fine 15',
    location: 'Studie · Format 15 mm',
    categories: ['innen'],
    timeOfDay: ['tag'],
    format: '15',
    description:
      'Das dichteste Raster des Systems: 15-Millimeter-Lamellen in enger Teilung. Aus der Distanz eine ruhige, fast textile Fläche — aus der Nähe präzises Metall.',
    images: ['/renders/gallery/fine-15.jpg'],
    photo: '/renders/gallery/fine-15.jpg',
  },
  {
    id: 'studio-wand-90',
    title: 'Fassadenfeld im Streiflicht',
    location: 'Studie · Format 90 mm',
    categories: ['aussen'],
    timeOfDay: ['tag'],
    format: '90',
    description:
      'Largo-Format unter tief stehender Sonne: Das Streiflicht zeichnet jede Lamelle einzeln und macht die Tiefe des Reliefs sichtbar.',
    images: ['/renders/gallery/wand-90.jpg'],
    photo: '/renders/gallery/wand-90.jpg',
  },
  {
    id: 'residenz-frankfurt',
    title: 'Residenz Frankfurt',
    location: 'Frankfurt am Main, DE',
    categories: ['aussen'],
    timeOfDay: ['tag', 'nacht'],
    format: 'rhythmus',
    description:
      'Vertikale Gliederung einer Wohnfassade in zentraler Lage. Der Rhythmus aus 90- und 30-mm-Lamellen erzeugt eine lebendige Tiefe, die je nach Lichteinfall und Tageszeit variiert.',
    images: ['/renders/project-1-day.jpg', '/renders/project-1-night.jpg'],
  },
  {
    id: 'buerogebaeude-hanau',
    title: 'Bürogebäude Hanau',
    location: 'Hanau, Hessen, DE',
    categories: ['aussen'],
    timeOfDay: ['tag'],
    format: '90',
    description:
      'Einheitliches Largo-90-Format über alle Geschosse. Die breiten Lamellen vermitteln Solidität und Ruhe — kein Detail zu viel.',
    images: ['/renders/project-2-day.jpg'],
  },
  {
    id: 'showroom-muenchen',
    title: 'Showroom München',
    location: 'München, BY, DE',
    categories: ['innen'],
    timeOfDay: ['tag', 'nacht'],
    format: '30',
    description:
      'Innenwandverkleidung mit dem Mezzo-30-Format. Die Schattenfuge wird nachts zur Lichtfuge — eine Verwandlung, die den Raum neu definiert.',
    images: ['/renders/project-3-day.jpg', '/renders/project-3-night.jpg'],
  },
  {
    id: 'penthouse-berlin',
    title: 'Penthouse Berlin',
    location: 'Berlin, DE',
    categories: ['decke', 'innen'],
    timeOfDay: ['nacht'],
    format: 'rhythmus',
    description:
      'Deckenapplikation mit freiem Rhythmus 90·30·15. Die LED-Integration schafft eine indirekte Beleuchtungsebene, die ohne sichtbare Leuchten auskommt.',
    images: ['/renders/project-4-night.jpg'],
  },
  {
    id: 'hotel-dusseldorf',
    title: 'Hotel Düsseldorf',
    location: 'Düsseldorf, NRW, DE',
    categories: ['aussen', 'innen'],
    timeOfDay: ['tag', 'nacht'],
    format: 'rhythmus',
    description:
      'Systemlösung für Außenfassade und Lobbybereich. Derselbe Rhythmus innen wie außen — ein architektonisches Leitmotiv, das Kontinuität schafft.',
    images: [
      '/renders/project-5-day.jpg',
      '/renders/project-5-night.jpg',
    ],
  },
  {
    id: 'villa-wien',
    title: 'Villa Wien',
    location: 'Wien, AT',
    categories: ['aussen'],
    timeOfDay: ['tag', 'nacht'],
    format: '15',
    description:
      'Fine-15-Format für eine feingliedrige, textile Wirkung. Die dichten Lamellen erzeugen eine Oberfläche, die an gewobene Materialien erinnert.',
    images: ['/renders/project-6-day.jpg', '/renders/project-6-night.jpg'],
  },
];
