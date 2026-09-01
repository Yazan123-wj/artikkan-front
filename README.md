# Artikkan frontend

Phase 0 foundation for Artikkan, a luxury furniture, accessories, interiors, and craftsmanship brand based in Qatar.

This repository is a bilingual Next.js App Router site (English `/en`, Arabic `/ar`). Homepage sections, navigation, and the scroll-based hero are implemented later, one section at a time.

Brand fonts and colors are **not confirmed**. Temporary neutrals and system font stacks live in `src/styles/`. Replace them when Artikkan provides approved values.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` before deploying.

## Localization

`next-intl` prefixes every route with `/en` or `/ar`. Locale routing lives in `src/i18n/`. Navigation labels come from `src/config/navigation.ts` and `src/messages/{en,ar}.json`. Use `LocalizedLink` for internal links so the locale stays on the URL.

Arabic sets `dir="rtl"` and `lang="ar"`. English sets `dir="ltr"` and `lang="en"`.

## Design tokens

CSS custom properties are in `src/styles/tokens.css`, with typography, layout utilities, and motion helpers in the same folder. Map approved brand colors and fonts there — do not scatter values through sections.

## Responsive foundation

Work mobile-first. A section is finished only when desktop, tablet, mobile, and Arabic RTL are implemented and checked.

Breakpoints:

| Range | Width |
|---|---|
| Small mobile | 320–374px |
| Standard mobile | 375–430px |
| Tablet | 768–1023px |
| Laptop | 1024–1439px |
| Desktop | 1440–1919px |
| Large desktop | 1920px+ |

Use shared tokens for gutters, section spacing, and type. Prefer CSS and Tailwind screens (`sm`, `md`, `lg`, `xl`, `2xl`) over JavaScript for layout. `hover:` utilities apply only on fine-pointer hover devices.

Layout helpers in `src/styles/utilities.css`:

- `container-standard`, `container-wide`, `container-narrow`, `container-full`
- `full-bleed`, `media-full`, `media-cover`
- `grid-responsive-2` / `3` / `4`
- `split`, `stack`, `stack-to-row`
- `min-h-svh`, `min-h-dvh`, `h-viewport-safe`
- `touch-target` (44×44px), `interactive`

Image `sizes` presets live in `src/lib/responsive.ts`. Set `--media-focus` and `--media-focus-rtl` for crop. Use `100dvh` / `100svh`, not `100vh`.

### Required viewport checks

Test every section at 320×568, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, and 1920×1080.

When a section ships, report:

1. Desktop behavior
2. Tablet behavior
3. Mobile behavior
4. Arabic RTL behavior
5. Responsive testing completed

### Navigation

`src/config/navigation.ts` is the only link list. Future desktop header and mobile menu belong in `src/components/navigation/desktop/` and `src/components/navigation/mobile/`. Do not duplicate nav data.

### Hero sequences

Desktop and mobile canvas sequences are separate assets. Do not load desktop frames on mobile. Do not crop the desktop sequence to invent a mobile composition.

## Adding a homepage section

Create sections in `src/components/sections/home/`. Give a section its own folder when it has more than one file:

```text
src/components/sections/home/hero/
├── hero.tsx
├── hero.types.ts
├── hero.utils.ts
└── index.ts
```

Simple sections can be a single file. Do not hard-code page gutters or section spacing; use `Section` and `Container`.

## Hero image sequence

The homepage hero will later use a canvas frame sequence controlled by GSAP ScrollTrigger. Do not embed text in frames. Prepare assets here:

```text
public/media/hero/desktop/sequence/
public/media/hero/mobile/sequence/
public/media/hero/fallback/
```

Filename convention:

```text
hero-desktop-0001.webp
hero-mobile-0001.webp
hero-poster.webp
hero-fallback.mp4
```

Use zero-padded four-digit frame numbers. Prefer WebP or AVIF. Add a static poster for reduced motion. Configuration types live in `src/types/hero-sequence.ts`.

## Image filename convention

Use lowercase kebab-case, grouped by purpose:

```text
public/images/brand/artikkan-wordmark.svg
public/images/products/{slug}-01.webp
public/images/projects/{slug}-01.webp
public/images/journal/{slug}-cover.webp
```

Include a fallback social image at `public/images/brand/og-default.jpg` when it is available.

## Folder architecture

```text
src/
├── app/                 # App Router, locale segment, SEO files
├── components/          # layout, navigation, sections, ui, motion, shared
├── config/              # site, navigation, social links
├── data/placeholders/   # future asset config only
├── hooks/               # GSAP context, media query, reduced motion
├── i18n/                # next-intl routing
├── lib/                 # metadata, GSAP registration, utilities
├── messages/            # en.json, ar.json
├── styles/              # tokens, typography, utilities, motion
└── types/
```

A temporary development header exists only so routes can be tested. It will be replaced by the real navigation in the next phase.
