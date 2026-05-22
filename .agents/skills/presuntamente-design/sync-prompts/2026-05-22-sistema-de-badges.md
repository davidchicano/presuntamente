# Prompt para Claude Design — sync del sistema de badges (2026-05-22)

Pega esto en Claude Design (plataforma) para que regenere el bundle de design system alineado con la nueva fuente de verdad. Claude Design tiene acceso al repo `davidchicano/presuntamente` de GitHub, así que solo necesita el enfoque.

---

Hola. He rediseñado por completo el sistema de badges de presuntamente.org desde Claude Code, y la fuente de verdad ahora es la rama `main` del repo `davidchicano/presuntamente` (lee directamente desde GitHub).

**Qué quiero de ti en esta iteración:** regenerar el bundle de design system (tokens, previews, UI kit) para reflejar el sistema nuevo. **No quiero que diseñes nada nuevo** — la fuente está cerrada en el repo. Solo traducir y dejar el bundle al día.

## Empieza leyendo

1. `DESIGN.md` en raíz del repo, especialmente la **§2bis "Sistema de badges"** (es nueva entera) y la matización en §2 sobre la excepción del rojo.
2. `src/styles/global.css` — sección "Roles procesales — F-estado" y "Roles funcionales — F-función" para los tokens, y la sección "Badges" para las reglas CSS canónicas.
3. `src/components/RolBadge.astro` — el componente que centraliza el routing rol→familia visual.
4. `src/components/EpistemicBadge.astro`, `src/components/PhaseBadge.astro`, `src/components/LevelBadge.astro`, `src/components/Hito.astro` — los otros componentes que pintan badges.
5. `src/lib/labels.ts` — la función `rolFamilia()` que dice a qué familia visual cae cada rol.
6. `schemas/rol-en-caso.schema.json` — el enum actualizado de roles, ahora con `condenado_no_firme` y `condenado_firme` separados.

## Qué cambió respecto al bundle anterior

- **De 5 familias visuales a 4**: F1 Nivel, F-estado (épistemico+rol procesal del lado acusado), F4 Fase, F-función (aparato judicial + acusación civil + categorías).
- **F-estado**: ahora reusa el `•` dot para Hecho epistémico Y rol procesal de Persona. Contexto desambigua. Mismo color para `investigado` epistémico y rol `investigado` procesal — eso es intencional y coherente.
- **F-función**: nuevo contenedor unificado para todo lo "no estado": rectángulo + `▌` border-left 4px + glyph monocromo + fondo neutro. Glyphs en caracteres con cobertura humanista (`§` aparato judicial, `‡` acusación civil, `§/◆/¶` categorías de hito).
- **Rol `condenado` separado en `condenado_no_firme` y `condenado_firme`**: la presunción de inocencia formal cae solo con firmeza, así que el badge UI los distingue (rojo apagado outline vs rojo chillón fill).
- **Rol `investigado` queda fuera del rojo**. Va en navy outline, mismo color que el caso base. Razón editorial dura: ser investigado no implica gravedad procesal — una persona puede ser investigada y ser inocente. El rojo entra solo a partir de `condenado_no_firme`. La progresión es navy (investigado) → mostaza (procesado/acusado) → rojo (condenado).

## Qué quiero que regeneres del bundle

1. **`colors_and_type.css`**: añadir los tokens nuevos (`--color-rol-investigado`, `--color-rol-procesado`, `--color-rol-procesado-text`, `--color-rol-acusado`, `--color-rol-acusado-text`, `--color-rol-acusado-bg`, `--color-rol-condenado-no-firme`, `--color-rol-condenado-firme`, `--color-rol-absuelto`, `--color-rol-desimputado`, `--color-rol-testigo`, `--color-rol-aparato`, `--color-rol-acusacion-civil`).
2. **`preview/comp_badges.html`**: reescribir entero. Debe mostrar las 4 familias con todos sus valores reales:
   - F1 Nivel: N1 N2 N3 N4.
   - F-estado epistémico: acreditado, investigado, atribuido (dashed), exculpatorio, desmentido, no_concluyente (dashed).
   - F-estado rol procesal: investigado, procesado, acusado, condenado_no_firme, condenado_firme, absuelto, desimputado, testigo.
   - F4 Fase: instrucción, fase intermedia, juicio oral, sentencia firme, archivado (cada uno con su barra de progreso `[█░░░]` ... `[████]`).
   - F-función: aparato judicial (§ + navy), acusación civil (‡ + azul suave), hito jurisdiccional (§ + navy), hito político (◆ + mostaza), hito mediático (¶ + gris).
3. **`preview/comp_hito.html`**: si existe, actualizar para reflejar el badge de categoría con border-left + glyph (ya no es solo glyph con fondo neutro plano).
4. **`preview/comp_persona_card.html`** y **`preview/comp_org_card.html`**: actualizar para que los badges de rol reflejen el nuevo sistema (dot para roles de F-estado, border-left+glyph para los demás).
5. **`ui_kits/web/`**: revisar páginas Ficha de Caso y Ficha de Persona para que reflejen el nuevo render de badges.
6. **`SKILL.md` y `README.md`**: actualizar las secciones que describan badges. Mantener la regla "nunca rojo" del bundle, pero añadir la excepción documentada: rojo solo en `condenado_no_firme` y `condenado_firme` de F-estado.

## Restricciones a respetar (las mismas de siempre)

- DESIGN.md prevalece sobre cualquier doc del bundle.
- Stack institucional: Gill Sans / Lato, no introducir fuentes nuevas.
- Sin Tailwind. CSS nativo + tokens del bundle.
- Glyphs en caracteres con cobertura humanista (`§`, `‡`, `◆`, `¶`). NO usar `⚖` ni `⚑` — muchas fuentes no los cubren y se ven irreconocibles a 12px.
- Sin emoji a color. Si necesitas un símbolo nuevo, comprobar que está en Lato y Gill Sans.
