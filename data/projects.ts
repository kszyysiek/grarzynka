export interface Project {
  id: string;
  title: string;
  location: string;
  categories: Array<'aussen' | 'innen' | 'decke'>;
  timeOfDay: Array<'tag' | 'nacht'>;
  format: '90' | '30' | '15' | 'rhythmus';
  description: string;
  images: string[];
}

export const PROJECTS: Project[] = [
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
