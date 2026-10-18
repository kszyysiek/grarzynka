# Prompty do fotorealistycznych zdjęć: podróż przez willę KANELO

Prompty są po angielsku, bo generatory (Midjourney, Flux, GPT Image, Nano Banana, Imagen)
rozumieją angielski najlepiej. Każdy prompt odpowiada jednej stacji podróży 3D na stronie.

## Jak uzyskać spójną serię

1. **Najpierw wygeneruj ujęcie 1 (willa za dnia)** i wybierz najlepszą wersję.
2. Do kolejnych ujęć **dołączaj je jako obraz referencyjny** (image reference / style
   reference). Wtedy dom, kolor profili i styl zostają te same.
3. Do każdego promptu dodawaj **blok wspólny** (niżej) i **prompt negatywny**.
4. Format: **16:9**, rozdzielczość jak najwyższa (min. 2400 px szerokości, bo zdjęcia idą na
   pełny ekran).
5. Gotowe pliki wrzuć do `public/renders/podroz/` jako `01-dzien.jpg`, `02-zmierzch.jpg` itd.

## Blok wspólny (dopisz na końcu każdego promptu)

```
Product: KANELO vertical aluminium lamella system: slim rectangular extruded aluminium
profiles (30 mm and 15 mm wide, 40 mm deep) mounted vertically with narrow 30–38 mm gaps,
warm bronze anodised finish with a soft satin sheen; some profiles carry a recessed linear
LED channel emitting a thin, continuous line of warm 2700 K light.
Style: high-end architectural photography, photorealistic, shot on a full-frame camera with
a tilt-shift lens, verticals perfectly straight, natural materials, crisp detail on the
aluminium edges, subtle reflections, editorial luxury real-estate magazine look, 16:9.
```

## Prompt negatywny (wspólny)

```
cartoon, 3d render look, CGI, plastic, low poly, distorted lines, bent verticals,
warped lamellas, uneven gaps, text, watermark, logo, people, cars, oversaturated,
HDR halos, fisheye, blurry, noise
```

---

## 1. Willa za dnia (hero)

```
Aerial three-quarter view of a contemporary two-storey luxury villa on a landscaped plot,
late afternoon soft sunlight. Flat-roofed cubic volumes: a cream rendered ground floor with
large glazing and a dark upper volume fully clad in vertical bronze aluminium lamellas.
The entrance is framed by lamella piers under a slim dark canopy. In front of the house,
open to the street (no front fence), a generous wide driveway and forecourt in large-format
light stone paving, framed by low clipped hedges, lined with slim bronze lamella bollard
lights. Lush planting: planting beds of rounded shrubs along the facade, ornamental trees,
manicured lawn islands. Clear sky with a hint of haze.
```

## 2. Zmierzch: zapalają się LED-y w profilach

```
Same villa at blue hour, camera at eye level at the end of the wide stone driveway looking
up toward the facade. The sky is deep blue, the house is lit only by architecture lighting:
thin vertical lines of warm LED light glow inside the bronze lamella facade of the upper
floor and at the entrance piers; slim lamella bollards with LED lines guide along both
sides of the driveway between low hedges and shrubs. Warm interior light spills through
the large ground-floor windows. Calm, cinematic, high contrast between cool sky and warm
light lines.
```

## 3. Zbliżenie na wejście

```
Close-up of the villa entrance at night, frontal, symmetrical composition. A tall dark
bronze pivot/sliding door, slightly open, set between two piers of vertical bronze aluminium
lamellas. Integrated vertical LED lines between the lamellas cast warm grazing light down
the profiles, a linear LED in the canopy soffit above washes the threshold. Light stone
forecourt paving leading to the door, rounded shrubs at its sides, inviting warm glow from
the hall inside.
```

## 4. Hol: kolorowa ściana i światło SPI

```
Interior of a minimalist double-height entrance hall at night. The main feature wall is
made of vertical aluminium lamellas anodised in a curated palette: champagne gold, steel
blue, copper, sage green, dusty rose and pearl, arranged in vertical bands. Between the
bands run slim addressable SPI pixel LED lines showing a live light scene: a smooth
gradient of colours flowing upward, each pixel visible as a tiny dot of light. Dark
polished floor reflecting the coloured light, a single linear LED in the ceiling. Moody,
gallery-like atmosphere.
```

## 5. Ogromny salon

```
Huge open-plan living room of the villa at night, wide-angle view. A large cream modular
sofa on a textured rug, a dark bronze coffee table, a wall clad in wide dark bronze
folded aluminium lamellas with a long built-in linear fireplace and a vertical LED line,
thin linear LED lights recessed in the ceiling, a sculptural indoor plant. The far wall is
floor-to-ceiling glass sliding doors, partly open onto a lit garden terrace with a pergola
and a glowing pool beyond.
```

## 6. Wyjście do ogrodu pod pergolą (Tarasola)

```
View from the open glass doors of the living room out onto the terrace at night, passing
under a white aluminium bioclimatic pergola with adjustable roof louvres (Tarasola style),
slim square posts and a perimeter LED line under the beams. Two loungers under the pergola.
Beyond it: a turquoise illuminated swimming pool and a garden enclosed by a bronze lamella
fence with a soft light line at its base.
```

> Nazwy „Tarasola” używaj tylko za zgodą firmy. Bez zgody usuń ją z promptu, a opis pergoli
> zostaw.

## 7. Basen, bar i donice

```
Luxury garden at night: a rectangular swimming pool with underwater turquoise lighting and
a stone deck. Beside it an outdoor bar whose front is clad in vertical bronze aluminium
lamellas, with a light stone countertop, a warm LED line under the counter and three
minimalist bar stools. Around the pool, square and long planters clad on all sides in the
same bronze lamellas, each with integrated LED: a light line at the base and at the
corners, softly uplighting the lamellas. The planters overflow with flowers in pink, white,
lavender, yellow and coral with lush green foliage.
```

## 8. Oddalenie od strony ogrodu i płot

```
High aerial view from behind the garden at night, looking back at the whole villa. In the
foreground the long garden boundary fence made of vertical bronze aluminium lamellas on a
stone plinth, with a continuous warm LED line along its base. Behind it: lit planters, the
glowing turquoise pool, the outdoor bar, the white louvred pergola on the terrace and the
glass rear facade of the house with warm interior light, upper floor clad in lamellas with
vertical LED lines. Side fences of the same lamellas frame the garden; the street side of the plot stays open
with a green, planted driveway. Quiet, prestigious, cinematic.
```

---

## Wskazówki do poprawek

- **Lamele wychodzą krzywe lub nierówne?** Dopisz `perfectly straight, evenly spaced
  vertical aluminium lamellas` i zmniejsz „kreatywność” (stylize / creativity).
- **Za mało widać produkt?** Dopisz `the lamella cladding is the hero of the image`.
- **Kolor profili nie ten?** Podaj nazwę wykończenia z Waszej oferty (np. `champagne
  anodised`, `black anodised`, `RAL 7016`) zamiast `bronze`.
- **Światło LED za mocne lub za słabe?** `subtle LED accent` / `strong glowing LED lines`.
