---
name: presuntamente-design
description: Use this skill to generate well-branded interfaces and assets for presuntamente.org, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping with the gov-retro Spanish aesthetic.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files. The README is the canonical entry point — it documents the brand, the content fundamentals, the visual foundations and the iconography rules.

## Quick map

- `README.md` — full guide (brand, content tone, visual foundations, iconography).
- `colors_and_type.css` — tokens. Drop into a page with `@import "colors_and_type.css"` and you have the whole token system: palette (light + dark), epistemic-state colors, source-level badge colors, fluid type scale, spacing, borders, radii, motion.
- `assets/` — wordmark SVGs (`wordmark.svg`, `wordmark-inverso.svg`). No symbol, no isotype — the word is the mark.
- `preview/` — small specimen cards (one concept each). Open any of them as a quick reference for how a specific piece looks.
- `ui_kits/web/` — full clickable prototype of the site (home, case page, library, about) with React+Babel JSX components. Use it as a source of patterns when assembling new screens.

## Aesthetic rule of thumb

**Densidad administrativa > generosidad editorial.** If a screen feels like an expediente de oficina or a ministerial portal (Junta Consultiva, Sede Electrónica de la AEAT, antigua Moncloa, BOE), it is right. If it feels like Substack / Medium / a magazine, it is wrong. Concretely:

- Listings are **tables** with thin borders, not stacks of card-like blog posts.
- Filters live inside a `--color-surface-muted` block and look like an administrative form.
- Badges are **rectangular** with a 1px border. Never pill-shaped.
- Identifiers (procedure number, BOE id, hash, slug) are visible monospace, not hidden.
- Sections are numbered (1., 1.1., 2.7.3) following administrative tradition.
- The header is a **navy band** with a white **brand block** on the left (logo + wordmark + institutional subtitle), nav text in negative, ES/CAT on the right, mustard accent line on the bottom edge. No big editorial H1 occupies half the screen.

## Working rules

If you are asked to make a **visual artifact** (slide, mock, throwaway prototype, marketing page):

1. Always import `colors_and_type.css`. Never invent new colors. The palette is austere on purpose.
2. Use the **Gill Sans stack** for sans (`var(--font-sans)`): `Gill Sans Nova → Gill Sans → Lato → Source Sans 3 → system`. Apple users get Gill Sans natively, Adobe-Fonts users get Gill Sans Nova, everyone else falls back to humanist open fonts. Use **Source Serif 4** for display (optional, case-page headline), **JetBrains Mono** for every judicial identifier (procedure number, BOE id, hash, slug).
3. Two accents: `--color-accent` is institutional dark blue `#1f3a68` (primary, for headers / focus / links / N1 badges) and `--color-accent-secondary` is mustard `#c89b00` (structural second color, for phase badges, sub-headings, page-id eyebrows, and the thin band beneath the navy header). Background is **off-white `#fafafa`** (NOT beige, NOT cream). Density and bands of color do the heavy lifting; whitespace does not.
4. Transmit any epistemic state through **three channels**: color + textual label + icon. Never color alone. **Never red** for epistemic states. Reasons are semantic, not political: (a) UI convention red=error/danger; (b) "desmentido" exculpates the person, so red would invert the message; (c) "investigado" in red pre-judges guilt, violating presumption of innocence. All colors carry party associations in Spain; mitigated by always using muted/desaturated tones, not by avoiding specific hues.
5. **N1–N4 badges:** gradient of fill on the same navy accent (N1 solid navy, N2 medium navy, N3 light navy soft, N4 outline-only). Never different colors per level.
6. **Persona vs Organización:** must be distinguishable at first glance. Persona = initials in a thin-bordered square + role badge. Organización = geometric glyph by type (gavel for judiciary, column for fiscalía/partido, factory for empresa, building for organismo público, asterisk for asociación) + type badge.
7. **Photos** of a Persona only on her individual page, only if `es_figura_publica`, only with verified free license, never humiliating shots (paseíllo / detención). Mandatory caption: autor + licencia + año. Otherwise fallback to initials.
8. **Money + Acronym micro-components**: `<Money amount="53,5 M€">` chip (1px navy border, surface-muted fill, mono). `<Acronym>UDEF</Acronym>` auto-resolves to `/organizaciones/<slug>` (dotted underline + tooltip). **Never** auto-link to Wikipedia.

If you are working on **production code** in the Astro repo (`davidchicano/presuntamente`):

1. Read `DESIGN.md` and `AGENTS.md` in the source repo first. They override anything here on conflict.
2. Stack is fixed: Astro 5 + native CSS (`@layer`, nesting, `light-dark()`, container queries) + Open Props. **No Tailwind, no CSS-in-JS.**
3. Tokens live in `/src/styles/global.css`. Translate from `colors_and_type.css` if you need to seed values.
4. Pages are wrappers; the real logic lives in `Pg*` components under `/src/components/pages/`.

## Language

The product is **Spanish (castellano administrativo neutro)**, with Catalan as a planned second language. Default to Spanish in UI copy unless the user asks for another language.

**Forbidden verbs for non-acreditados:** "robó", "estafó", "se apropió", "saqueó". Replace with "se investiga", "se le atribuye", "consta en…", "fue procesado por…".
**Forbidden editorial adjectives:** "escándalo", "trama", "mafia", "saqueo" — except in direct quotes.

## If invoked without other guidance

Ask the user what they want to build (a slide deck about a case? a new page? a social card?), then ask a few focused questions:

- ¿Qué caso / qué tema?
- ¿Para qué audiencia? (ciudadanía general, periodistas, juristas)
- ¿Lo van a leer en móvil, escritorio, o impreso?
- ¿Castellano o catalán?
- ¿Hay un hecho acreditado central, o el contenido es divulgativo?

Then act as an expert designer and produce HTML artifacts (or production-code patches if working inside the repo).

## What this skill does NOT do

- Does not invent new colors, gradients or animation primitives.
- Does not draw illustrations or photographic content.
- Does not assert guilt of anybody mentioned in a case. The brand IS this constraint.

## Cuando hay cambios sustanciales de diseño en el repo

Esta skill es **una copia local** del design system. La fuente original vive en la plataforma **Claude Design** de Anthropic (separada de Claude Code), conectada al GitHub del proyecto. Cuando el maintainer aplica cambios sustanciales de diseño desde Claude Code — nuevas reglas en `DESIGN.md`, cambios de tokens en `/src/styles/global.css`, nuevos componentes visuales canónicos, ajustes a familias de badges, etc. — **el bundle local de esta skill queda desactualizado respecto a Claude Design**.

**Regla operativa para el agente:** después de cerrar un cambio sustancial de diseño en el repo, recordar explícitamente al maintainer:

> "Acabo de cambiar el sistema de [badges / tokens / componente X / etc.] en `DESIGN.md` y `global.css`. Si quieres mantener Claude Design sincronizado, te pego abajo un prompt para que se lo pases a la plataforma y regenere el bundle. Cuando Claude Design devuelva el bundle actualizado, dímelo y lo importo aquí (`/.agents/skills/presuntamente-design/`) con un `git diff` para revisar."

Y entregar al maintainer un prompt autocontenido (siguiendo el formato del que está en `/.agents/skills/presuntamente-design/sync-prompt-template.md` cuando exista, o redactando uno ad-hoc). El prompt debe:

1. Pedirle a Claude Design que **lea el repo actualizado** (DESIGN.md + global.css + componentes).
2. Resumir qué subsistema ha cambiado y qué hay que regenerar (tokens, previews, UI kit, assets).
3. Pedir que produzca un bundle alineado con la nueva fuente de verdad.

**Qué NO hacer:** intentar regenerar previews o assets desde Claude Code (no tenemos la herramienta de diseño nativa de Claude Design). El agente solo escribe el código + el prompt; Claude Design hace el bundle.

**Qué considerar cambio sustancial** (dispara la convención):

- Cambios en `DESIGN.md` que afecten a un componente o familia de componentes.
- Cambios en tokens de `/src/styles/global.css` (colores semánticos, fuentes, escala, espaciado).
- Nuevas reglas de comportamiento visual (familias de badges, vocabularios visuales, restricciones cromáticas).
- Cambios en `OrgGlyph`, `PersonaCard`, `OrgCard`, badges, layout chrome.

**Qué NO se considera sustancial** (no necesita sync):

- Ajustes de copy.
- Bugs CSS aislados.
- Cambios de contenido (nuevos casos, nuevos hitos).
- Cambios en componentes `Pg*` que no introducen vocabulario visual nuevo.
