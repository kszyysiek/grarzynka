# Handoff Spec: KANELO — strona produktowa (one-page, 3D scroll)

> Stan na 2026-10-18, branch `claude/intelligent-faraday-qyy48m`. Źródło prawdy: kod w repo
> (`app/globals.css`, `tailwind.config.js`, `components/*`). Brak pliku Figma — wartości
> spisane z implementacji.

## Overview

Jednostronicowa strona premium dla modularnego systemu aluminiowych lameli fasadowych
(KANELO, Hanau). Cel: przekonać architektów / inwestorów wizualnie (rendery, sceny WebGL
sterowane scrollem), a potem zebrać zapytanie (muster, ilości, projekt, dokumentacja).

Ścieżka użytkownika: Preloader → podróż 3D przez willę (jako hero, 8 stacji: dzień → zmierzch z LED w profilach → wejście → hala z kolorową ścianą i SPI → salon → pergola → basen, bar, donice → płot) → sekcje produktowe
(formaty, materiał, profile, światło) → konfiguratory (wizualizacja, rundgang, kalkulator)
→ projekty → kontakt.

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind 3 · Framer Motion 11 ·
Lenis (smooth scroll) · three.js + React Three Fiber + drei + postprocessing.

## Layout

| Element | Specyfikacja | Dlaczego |
|---|---|---|
| Kontener | `.container-wide`: `max-width: 88rem`, padding poziomy `clamp(1.5rem, 5vw, 4rem)` | Szeroki, „edytorialny” rytm; płynne marginesy bez skoków na breakpointach |
| Odstęp sekcji | `.section-pad`: `clamp(5rem, 10vw, 9rem)` góra/dół | Dużo powietrza = odbiór premium |
| Nawigacja | `fixed`, wysokość `h-14` (56px), `z-50` | Offset kotwic Lenis = `-56px`, musi się zgadzać z wysokością nav |
| Siatki treści | `grid-cols-1` → `lg:grid-cols-2` (formularze, kalkulator), `sm:2 / lg:3` (projekty, `gap-px` = linie siatki) | |
| Sekcje sticky 3D | wrapper `height: 1000vh`, wewnątrz `position: sticky; top: 0; height: 100svh` | Długość wrappera = „długość” podróży kamery; `svh` chroni przed skakaniem paska adresu na mobile |

Kolejność sekcji (`app/page.tsx`) i kotwice nawigacji:

| # | Komponent | `id` | W nav |
|---|---|---|---|
| 1 | `ScrollJourney` (WebGL, pełni rolę hero, zawiera `h1`) | `hero` | — |
| 2 | `Marquee` | — | — |
| 3 | — (`Hero.tsx` zostaje w repo, nieużywany) | — | — |
| 4 | `Philosophie` | `system` (cel skip-linka) | System |
| 5 | `ImageBand` (parallax) | — | — |
| 6 | `Formate` | `formate` | Formate |
| 7–10 | `Justierung`, `Material`, `Profilsystem`, `Lichtintegration` | — | — |
| 11 | `Visualisierung` (WebGL) | `visualisierung` | Visualisierung |
| 12 | `Rundgang` (WebGL) | `rundgang` | Rundgang |
| 13 | `Projekte` (+ lightbox) | `projekte` | Projekte |
| 14 | `Kalkulator` | `kalkulator` | Kalkulator |
| 15 | `Technik` | `technik` | Technik |
| 16 | `Anwendung` | — | — |
| 17 | `Kontakt` | `kontakt` | Kontakt |

## Design Tokens Used

### Kolory (`:root` w `app/globals.css`, aliasy w Tailwind)

| Token CSS | Tailwind | Wartość | Użycie |
|---|---|---|---|
| `--color-base` | `base` | `#f2ece2` | Tło główne (krem) |
| `--color-surface` | `surface` | `#e8decf` | Tło sekcji naprzemiennych, track scrollbara |
| `--color-card` | — | `#f8f3ea` | Karty (profile) |
| `--color-accent` | `accent` | `#a3743f` | Brąz: linki, focus ring, wyniki, hover CTA |
| `--color-accent-dim` | `accent-dim` | `#b98f57` | Mosiądz: hover drugorzędny, thumb scrollbara |
| `--color-text` | `ivory`* | `#2c2620` | Tekst / nagłówki, tło `.btn-primary` |
| `--color-text-dim` | — | `rgba(44,38,32,.72)` | Tekst pomocniczy, eyebrow |
| `--color-text-dimmer` | — | `rgba(44,38,32,.52)` | Placeholdery (tylko dekoracyjne — kontrast < 4.5:1) |
| `--color-hairline` | — | `rgba(120,88,52,.20)` | Linie 1px, obramowania pól |
| `--color-hairline-strong` | — | `rgba(120,88,52,.34)` | Obramowanie `.btn-ghost` |

\* `ivory` w Tailwind to historyczna nazwa — dziś oznacza **ciemny** kolor tekstu. Nie zmieniać
bez przejrzenia wszystkich `text-ivory`.

**Ciemne sceny (hard-coded, do wyciągnięcia w tokeny):** tło podróży `#151a24`, krem na
ciemnym `#efe6d7`, tekst na ciemnym `rgba(239,230,215,.55–.78)`, złoty akcent `#e8c68e` /
`#c9a166`. Propozycja: `--color-night`, `--color-on-night`, `--color-on-night-dim`,
`--color-gold`.

### Typografia

| Token / klasa | Krój | Rozmiar | Interlinia | Inne |
|---|---|---|---|---|
| `.display-xl` | Cormorant Garamond 300 | `clamp(3.4rem, 9vw, 7.5rem)` | 0.98 | `-0.015em`, `text-wrap: balance` — H1 hero |
| `.display-lg` | Cormorant Garamond 300 | `clamp(2.2rem, 5vw, 4rem)` | 1.1 | `-0.01em` — H2 sekcji |
| `.display-md` | Cormorant Garamond 300 | `clamp(1.6rem, 3vw, 2.4rem)` | 1.2 | H3 |
| `.eyebrow` | Jost 400 | `0.7rem` | — | uppercase, `0.25em`, `--color-text-dim` |
| `.chapter-num` | Cormorant italic | `0.7rem` | — | `0.25em`, accent |
| body | Jost 300 | 16px | 1.7 | antialiased |
| Przyciski | Jost 400 | `0.72rem` | — | uppercase, `0.18em` |
| `.result-value` | Cormorant 400 | `1.35rem` | — | accent |

Fonty ładowane z Google Fonts (`display=swap`). Do rozważenia: `next/font` (self-host, brak
FOUT, lepszy LCP).

### Ruch

| Token | Wartość | Użycie |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` | Wejścia tekstu (hero, preloader), underline nav |
| `ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Wyjazd kurtyny preloadera |
| `duration-400` / `600` | 400 / 600 ms | Przejścia hover (Tailwind `extend`) |
| Reveal sekcji | 0.6–0.9 s, `delay` 0.1–0.5 s, `useInView({ once: true, margin: '-8%' })` | Nagłówki/treść przy wejściu w viewport |
| Lenis | `duration: 1.15`, easing expo-out, kotwice `duration: 1.4`, `offset: -56` | Smooth scroll |

## Components

| Komponent | Wariant | Props / API | Uwagi |
|---|---|---|---|
| `.btn-primary` | solid ciemny | `<a>` / `<button>` + opcjonalnie `.btn-arrow` | Hover → tło accent, tekst `#fff`, letter-spacing 0.18→0.22em, strzałka +6px |
| `.btn-ghost` | outline | j.w. | Hover → border i tekst accent |
| `.segment-btn` | toggle | `aria-pressed`, klasa `.active` | Active = tło `--color-text`, tekst `--color-base` |
| `.filter-btn` | filtr projektów | `.active` | Hover = active (accent) |
| `.input-field` | text / email / tel / textarea | `id` + `<label htmlFor>` | Brak zaokrągleń (`border-radius: 0`), focus = border accent |
| `.frame-ticks` | ramka paneli 3D | — | Narożniki 22px w kolorze accent |
| `Navigation` | transparent / scrolled | — | Próg `scrollY > 60` |
| `ImageBand` | parallax | `src, alt, eyebrow, title, caption, href, cta` | Obraz `y: -10% → 10%` na całym przejściu przez viewport |
| `ScrollJourney` | sticky WebGL | `STATIONS[]: { at, eyebrow, title, text }` | `at` = pozycja 0–1 w `scrollYProgress` |
| `Cursor` | kropka + ring | — | Tylko `(hover: hover) and (pointer: fine)` |
| `Preloader` | kurtyna z licznikiem | stała `DURATION = 1700` | Licznik 0→100 ease-out cubic |

## States and Interactions

| Element | Stan | Zachowanie |
|---|---|---|
| Nav | top (`scrollY ≤ 60`) | Tło transparent, linki `rgba(239,230,215,.78)`, logo `#efe6d7` (jasne na ciemnym hero) |
| Nav | scrolled | Tło `rgba(242,236,226,.9)` + `blur(12px)`, hairline na dole, linki `--color-text-dim`; przejście 500 ms |
| Link nav | hover | Podkreślenie 1px accent, `scaleX 0→1` od lewej, 450 ms expo-out; wyjście w prawo |
| Hamburger (< lg) | open | Dwie kreski → X (rotate ±45°), menu `height 0→auto` 350 ms, linki stagger 50 ms, `x: -12→0` |
| Link w menu mobile | click | Zamyka menu + smooth scroll do kotwicy |
| Kursor | default | Kropka w kolorze brązu + ring na sprężynie (`stiffness 260, damping 26, mass .6`) |
| Kursor | nad interaktywnym | Ring się powiększa (300 ms ease-out) |
| Karta projektu | hover | Zdjęcie `scale 1.05` (700 ms), overlay z opisem `opacity 0→1` (400 ms) |
| Karta projektu | click | Otwiera lightbox; klik w tło lub przycisk „Schließen” zamyka |
| Segmenty (Visualisierung / Rundgang / Kalkulator) | active | `aria-pressed="true"`, styl `.active`; zmiana sceny/obliczeń natychmiast |
| Kalkulator | zmiana wartości | Wyniki w regionie `aria-live="polite"`, wiersze fade 300–350 ms |
| Formularz kontaktowy | submit | `mailto:` z gotowym tematem i treścią; komunikat „E-Mail geöffnet ✓” przez 5 s |
| Formularz | błąd walidacji | Natywna walidacja HTML5 (`required` na name, email) — **brak własnych stylów błędu** |

## Responsive Behavior

| Breakpoint | Zmiany |
|---|---|
| Desktop ≥ 1024px (`lg`) | Pełna nav w poziomie (8 linków, `gap-7`); formularz i kalkulator w 2 kolumnach; projekty w 3 kolumnach; własny kursor przy precyzyjnym wskaźniku |
| Tablet 640–1023px (`sm`–`md`) | Hamburger; projekty w 2 kolumnach; pola formularza parami (`sm:grid-cols-2`); od `md` wskaźnik scrolla w hero; kontrolki Visualisierung w 3 kolumnach |
| Mobile < 640px | Jedna kolumna wszędzie; typografia skaluje się przez `clamp()` (bez skoków); sticky sceny w `100svh`; brak własnego kursora |

Sceny WebGL: `dpr={[1, 1.5]}` (ograniczenie kosztu GPU na ekranach retina), canvas montowany
tylko gdy sekcja jest w zasięgu `±600px` (IntersectionObserver), bo pętla RAF poza ekranem
głodzi kompozytor na słabszych GPU.

## Edge Cases

- **Brak WebGL / słaby GPU:** dziś canvas się po prostu nie wyrenderuje, a sekcja zostaje
  ciemnym polem z podpisami. **Do zrobienia:** fallback w postaci statycznego renderu
  (`public/renders/*`) przy braku kontekstu WebGL lub przy `navigator.hardwareConcurrency ≤ 4`.
- **Wolne łącze:** preloader trwa zawsze ok. 1.95 s (licznik nie jest powiązany z realnym
  ładowaniem). Obrazy poza hero mają `loading="lazy"`. Sceny 3D ładowane `dynamic(..., { ssr: false })`.
- **Reduced motion:** Lenis wyłączony, animacje i przejścia CSS skrócone do 0.01 ms,
  marquee zatrzymany. Sceny WebGL **nadal** jadą za scrollem — to akceptowalne, bo ruch
  idzie za gestem użytkownika, ale warto rozważyć statyczny render.
- **Długie teksty / tłumaczenia:** nagłówki mają `text-wrap: balance` i `max-width` w `ch`
  (np. H1 `13ch`). Niemieckie złożenia mogą przepełnić kolumny poniżej 360px — dodać
  `hyphens: auto` przy `lang="de"`. Etykiety nav: przy dłuższych przekładach 8 linków nie
  zmieści się w `lg` (1024px), więc trzeba przesunąć próg do `xl`.
- **Brak klienta poczty:** `mailto:` nic nie robi, a użytkownik i tak widzi „E-Mail geöffnet ✓”.
  **Do zrobienia:** prawdziwy endpoint (Route Handler + Resend/SMTP) ze stanami
  loading / success / error.
- **Brak zdjęcia projektu:** brak placeholdera. Ustalić tło `--color-surface` + nazwa projektu.

## Animation / Motion

| Element | Trigger | Animacja | Czas | Easing |
|---|---|---|---|---|
| Preloader — licznik | load | 0→100 | 1700 ms | ease-out cubic |
| Preloader — kurtyna | koniec licznika + 250 ms | `y: 0 → -100%` | 900 ms | `(0.76, 0, 0.24, 1)` |
| Nav | load | fade in | 800 ms, delay 2.1 s | default |
| Hero — tekst | load | fade + slide, kaskada | 1050 ms, delay 2.35 → 3.7 s | `(0.22, 1, 0.36, 1)` |
| Hero — wskaźnik scrolla | ciągle | pulsowanie y | 2 s, nieskończenie | easeInOut |
| Marquee | ciągle | `translateX(0 → -50%)` | 46 s, nieskończenie | linear |
| ScrollJourney — kamera | scroll (1000vh) | kamera po ścieżce klatek kluczowych (`KEYS` z progiem `p`), 8 stacji | sterowane scrollem | damp λ=3.2 |
| ScrollJourney — światło | `p` 0.06→0.24 | dzień → noc, LED-y w profilach włączają się (0.12→0.24), bloom 0.15→1.1 | sterowane scrollem | smoothstep |
| Drzwi wejściowe | `p` 0.33→0.39 | przesuwają się w kieszeń ściany | sterowane scrollem | smoothstep |
| Hala — SPI | ciągle | 6 linii × 44 piksele, przesuw barwy + fala jasności w górę | pętla | — |
| ScrollJourney — podpis stacji | `scrollYProgress` ∈ `[at-.07, at-.02, at+.05, at+.09]` (pierwszy widoczny od startu, ostatni do końca) | opacity `0→1→1→0`, `y: 24→0` | sterowane scrollem | liniowo |
| ScrollJourney — szyna postępu | zmiana stacji | kropka 6→10px, kolor `#e8c68e` | 400 ms | ease |
| ImageBand | scroll | parallax `y: -10% → 10%` | sterowane scrollem | liniowo |
| Reveal sekcji | wejście w viewport (raz) | fade + `y`/`x: 20px` | 600–900 ms | default |
| Kotwica nav | click | Lenis `scrollTo`, offset -56px | 1400 ms | expo-out |

Postprocessing w podróży: Bloom (`intensity 1.0`, `threshold 0.42`), Vignette (`offset .22`,
`darkness .72`), SMAA; tone mapping ACES, ekspozycja 1.14.

## Accessibility Notes

- **Kolejność focusu:** skip link („Zum Inhalt springen”, pojawia się przy focusie, cel
  `#system`) → logo → linki nav → treść sekcji w kolejności DOM → formularz → stopka.
- **Focus ring:** `:focus-visible` = obrys 1px w kolorze accent, `offset 3px`. Na ciemnych
  scenach (`#151a24`) kontrast brązu jest za niski, więc trzeba nadpisać na `#e8c68e`.
- **Przełączniki:** wszystkie segmenty mają `aria-pressed`. Wyniki kalkulatora są w `aria-live="polite"`.
- **Sceny 3D:** `<section aria-label=…>`. Podpisy stacji są w DOM, więc czytnik je odczyta.
  Dekoracje (szyna, gradienty) mają `aria-hidden`.
- **Hamburger:** ma `aria-label` (otwórz/zamknij). **Brakuje** `aria-expanded` i `aria-controls`.
- **Lightbox projektów: wymaga poprawek.** Brakuje `role="dialog"` i `aria-modal`, zamykania
  klawiszem `Esc`, pułapki focusu oraz powrotu focusu na kartę po zamknięciu.
- **Kursor:** systemowy kursor jest ukryty tylko przy precyzyjnym wskaźniku. Na urządzeniach
  dotykowych zostaje bez zmian.
- **Placeholdery** (`--color-text-dimmer`) nie spełniają 4.5:1, więc nie mogą zastępować labeli.
  Labele są obecne.

## Otwarte punkty (priorytet)

1. **P1:** lightbox: dialog a11y (Esc, focus trap, `role="dialog"`).
2. **P1:** formularz: prawdziwa wysyłka i stany loading / error zamiast `mailto:`.
3. **P2:** fallback dla braku WebGL (statyczny render).
4. **P2:** tokeny dla ciemnych scen (`--color-night`, `--color-on-night`, `--color-gold`)
   zamiast hard-coded wartości w `ScrollJourney` i `Navigation`.
5. **P2:** `aria-expanded` / `aria-controls` na hamburgerze. Focus ring na ciemnym tle.
6. **P3:** `next/font` zamiast `@import` z Google Fonts. Zmiana nazwy tokenu `ivory` → `ink`.
