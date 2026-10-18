# Prompty do fotorealistycznych zdjęć: podróż przez willę KANELO

Prompty są po angielsku, bo generatory (Midjourney, Flux, GPT Image, Nano Banana, Imagen)
rozumieją angielski najlepiej. Każdy prompt odpowiada jednej stacji podróży 3D na stronie.

## Wzorce stylu

Zdjęcia referencyjne od klienta (czarna, gęsto żebrowana elewacja z pionowymi liniami LED;
żebrowana ściana-brama z numerem domu; ściana ogrodowa z pionowymi listwami LED; willa z
górną bryłą w ciepłym tonie). Przy generowaniu dołączaj je jako obrazy referencyjne.

## Jak uzyskać spójną serię

1. **Najpierw wygeneruj ujęcie 1 (willa za dnia)** i wybierz najlepszą wersję.
2. Do kolejnych ujęć **dołączaj je jako obraz referencyjny** (image reference / style
   reference). Wtedy dom, kolor profili i styl zostają te same.
3. Do każdego promptu dodawaj **blok wspólny** (niżej) i **prompt negatywny**.
4. Format: **16:9**, rozdzielczość jak najwyższa (min. 2400 px szerokości, bo zdjęcia idą na
   pełny ekran).
5. Gotowe pliki wrzuć do `public/renders/podroz/` jako `01-dzien.jpg`, `02-zmierzch.jpg` itd.

## Zatwierdzony dom (ujęcie 1)

Plik: `public/renders/podroz/01-dzien.jpg`. Do każdego kolejnego ujęcia dołączaj go jako
referencję i dopisz:

```
Keep the villa from the reference exactly the same: two-storey modern villa; lower cubes
clad in black vertical ribbed aluminium with full-height recessed warm LED lines; a
cantilevered upper volume with a warm wood-clad fascia, large glazing and a balcony with a
black ribbed parapet; wood-lined entrance recess washed by an LED line; light concrete
driveway with thin joints, concrete planters with ornamental grasses and ground spotlights,
multi-stem birch trees, black ribbed side fence. The garden pergola is warm BRONZE
anodised aluminium (same bronze as the door and window frames), never white. The ribbed
feature wall in the living room is light champagne / pale sand.
```

## Blok wspólny (dopisz na końcu każdego promptu)

```
Product: KANELO "Kamm" ribbed aluminium cladding: dense, perfectly uniform vertical ribs,
thin fins about 30 mm apart and 32 mm deep with narrow deep grooves between them, like a
fine metal comb or corrugated slat wall, continuous from ground to roof and wrapping
seamlessly around the corners with crisp mitred edges. Matte black / dark anthracite
anodised cast aluminium with a very fine texture (accent volumes may use a warm bronze
wood-like tone). Light is built into the wall: full-height vertical warm 2700 K LED lines
recessed in the grooves at regular intervals, plus short vertical LED bars in garden walls.
The ribbed cladding is the hero of the image.
Style: high-end architectural photography, photorealistic, shot on a full-frame camera with
a tilt-shift lens, verticals perfectly straight, perfectly evenly spaced ribs, crisp detail,
deep realistic shadows, editorial luxury architecture magazine look, 16:9.
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
Aerial three-quarter view of a large, ultra-modern architect-designed villa, late
afternoon soft sunlight. Bold minimalist composition of long horizontal volumes: a wide
glazed ground floor and a dramatic, much longer upper volume that cantilevers boldly over
the entrance and the terrace, with razor-thin flat roof edges and frameless floor-to-ceiling
glass. The building is large and generous, around 40 metres long, with a monumental
presence. All volumes are wrapped floor-to-roof in the ribbed cladding. In front of the house, open to the street with no front fence, a generous wide
driveway and forecourt in large-format light stone paving, framed by low clipped hedges and
lined with slim bronze lamella bollard lights. Lush planting: beds of rounded shrubs along
the facade, ornamental multi-stem trees, manicured lawn islands. Clear sky with a hint of
haze.
```

## 2. Zmierzch: zapalają się LED-y w profilach

```
Same large cantilevered villa at blue hour, camera at eye level at the end of the wide stone driveway looking
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
under a bronze anodised aluminium bioclimatic pergola with adjustable roof louvres (Tarasola style),
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
glowing turquoise pool, the outdoor bar, the bronze louvred pergola on the terrace and the
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

## Zatwierdzone ujęcia (Videoslash)

| # | Ujęcie | Plik |
|---|---|---|
| 1 | Willa za dnia | `public/renders/podroz/01-dzien.jpg` (referencja: https://cdn.videoslash.com/assets/creative/cmvdn7yna016u01phhvjy1auu/cmve68zeh03xr01phgxvn19fv/references/input_images-1.jpg) |
| 2 | Zmierzch | https://cdn.videoslash.com/assets/creative/cmvdn7yna016u01phhvjy1auu/cmve68zeh03xr01phgxvn19fv/generated-1792348904911.jpg |
| 5 | Salon (brązowa pergola, TV) | https://cdn.videoslash.com/assets/creative/cmvdn7yna016u01phhvjy1auu/cmve6rn1t041h01phbq76wl16/generated-1792349773582.jpg |
