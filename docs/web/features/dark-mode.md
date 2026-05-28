# Modo claro / oscuro

> Archivos clave: `src/styles/global.css` (`:root[data-theme="dark"]`) · `src/layouts/BaseLayout.astro` (script inline + botón `.site-theme` + handler) · `src/components/ThemeToggle.astro` (cuerda móvil) · `src/scripts/conexiones.ts` (paleta del grafo)

## Qué hace

El sitio se sirve en claro u oscuro. El visitante alterna entre ambos con un **botón en el header** (desktop, a la derecha de "Aportar") o tirando de una **cuerda de lámpara** que cuelga del menú hamburguesa (móvil); la elección persiste entre visitas.

## Para qué sirve

Lectura cómoda de día y de noche sin abandonar la estética gov-retro. El tema arranca según la preferencia del sistema operativo y, en cuanto el visitante tira de la cuerda, queda fijado a su elección manual.

## Cómo funciona

- **Atributo `data-theme` en `<html>`** como fuente única de verdad. `light` (defecto del sistema de tokens) o `dark`.
- **Tokens dark** centralizados en un único bloque `:root[data-theme="dark"]` de `global.css`. Cada familia cromática de `:root` (base, accent, epistémicos, roles, niveles N1-N4, eje editorial, naturaleza, partidos, fase, header) tiene su variante dark ahí. **Regla:** si añades una familia de tokens en `:root`, añade su override en ese bloque o derivará a colores de claro sobre fondo oscuro (bug de contraste).
- **Script inline blocking en el `<head>`** (`BaseLayout.astro`): lee `localStorage['pst-theme']`; si no hay elección explícita, cae a `prefers-color-scheme`. Fija `data-theme` antes del primer paint → sin FOUC. No-JS = claro (aceptado).
- **Toggle desktop**: botón `.site-theme` en el header (markup en `BaseLayout.astro`), a la derecha de "Aportar", estilo ghost sobre la banda navy. Icono sol/luna que indica la ACCIÓN (luna en claro, sol en oscuro). Conmuta al instante.
- **Toggle móvil**: `ThemeToggle.astro` pinta el tirador (icono + etiqueta "Apagar/Encender la luz") y la cuerda + perilla al fondo del menú hamburguesa, junto al idioma. El handler de click (en `BaseLayout.astro`) anima el tirón sólo para la cuerda (`.theme-pull`) y conmuta `data-theme` a mitad de gesto; el botón plano del header conmuta directo. Ambos persisten en `localStorage`.
- **Responsive**: el botón del header se oculta `<720px` (ahí manda la cuerda); la cuerda sólo se monta en el menú móvil.
- **Banner del header**: NO sigue al `--color-accent` (que en dark se aclara para enlaces). Usa `--color-header-bg` (navy profundo fijo). La caja de marca se queda como **placa clara** también en dark porque el isótipo es un PNG navy+blanco no recoloreable; el lockup mantiene colores light congelados (overrides en la sección header de `global.css`).
- **Texto sobre relleno de color**: `--color-accent-fg` (blanco en claro, casi-negro en dark) para texto sobre `--color-accent`; `--color-accent-secondary-fg` análogo para mostaza. Tooltips/cabeceras sobre `--color-fg` usan `--color-bg` (se invierte solo).
- **Grafo `/conexiones`**: Cytoscape pinta en canvas y no hereda las CSS custom properties, así que `conexiones.ts` resuelve la paleta en JS (`graphColors()` → `GRAPH_COLORS_LIGHT` / `_DARK`) y reaplica el estilo al vuelo con un `MutationObserver` sobre `data-theme`.

## Estado actual

- Claro y oscuro completos: header, dropdowns, cuerda, listados, ficha de caso (badges fase / rol / nivel / epistémico / partido / naturaleza / eje), grafo, swimlane/trayectoria, citaciones inline.
- Desktop: botón `.site-theme` a la derecha de "Aportar". Móvil: cuerda al fondo del menú hamburguesa (cuelga dentro, sobre el filete tricolor, porque el panel recorta con overflow para animar).
- Verificado en preview claro/oscuro, desktop y móvil; el grafo restila en vivo al cambiar de tema.

## Decisiones editoriales y aprendizajes

- **`data-theme` en vez de duplicar `@media prefers-color-scheme`.** El maintainer venía sufriendo deriva: los tokens dark estaban incompletos y dos componentes traían su propio `@media (prefers-color-scheme: dark)` que un toggle manual nunca habría respetado. Fuente única + tokens completos elimina la deriva. Se eliminó también un `html.theme-dark` muerto en `Aclaracion.astro` (ninguna parte fijaba esa clase).
- **Tokens epistémicos como texto vs relleno.** `--color-acreditado/investigado/...` se usan como TEXTO en badges (se aclaran en dark) y como RELLENO sólido en swimlane/trayectoria (ahí el texto pasa a `--color-bg` oscuro en dark para contrastar sobre el relleno claro).
- **Placa de marca clara en dark.** Alternativa descartada: placa oscura → el logo navy desaparece. La placa clara es patrón ministerial (sello sobre su placa) y mantiene identidad.
- **No-JS = claro.** Se priorizó cero duplicación de tokens (anti-deriva) sobre dar dark-by-system a visitantes sin JS, caso muy marginal.

## Ideas futuras

- Opción explícita "seguir al sistema" (hoy implícita sólo mientras no haya elección manual).
- Sustituir el PNG del isótipo por SVG con `currentColor` para poder recolorear el logo y, si se quisiera, oscurecer la placa de marca en dark.

## Pendientes operativos

- Regenerar OG images si en algún momento se quiere variante dark (hoy las social cards son claras, lo cual es correcto).
