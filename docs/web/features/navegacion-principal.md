# Navegación principal (header)

> Archivos clave: [`src/layouts/BaseLayout.astro`](../../../src/layouts/BaseLayout.astro) (datos `navGroups` + markup desktop/móvil) · [`src/styles/global.css`](../../../src/styles/global.css) (`.site-nav`, `.site-nav__group`, panel móvil)

## Qué hace

Lista las secciones públicas del inventario en el header navy: Casos, entidades (Personas · Organizaciones · Delitos) y referencia (Biblioteca · Cifras · Sobre). Utilidades a la derecha: Buscar, idioma, Aportar; hamburguesa solo en `<720px`.

## Para qué sirve

Orientar al visitante (periodista, contribuyente, lector casual) sin ocultar rutas detrás de dropdowns. Casos sigue siendo destino de un clic.

## Cómo funciona

- **`navGroups`**: tres clusters IA (2026-05-25, Sobre absorbido en referencia para evitar grupo huérfano al hacer wrap):
  1. `core` — Casos
  2. `inventario` — Personas, Organizaciones, Delitos
  3. `referencia` — Biblioteca, Cifras, Sobre
- **Desktop ancho (`>1180px`)**: grid `brand · nav · [1fr] · utilidades`. Nav a `max-content` (tamaño fijo 13px); el espaciador empuja Buscar/idioma/Aportar a la derecha. Hover a altura completa en **todos** los enlaces, incluidos los de grupo.
- **Tablet (`721–1180px`)**: 2 filas, nav abajo ancho completo, 14px fijo.
- **Mobile (`≤720px`)**: hamburguesa; nav en panel con cabeceras `Inventario` / `Referencia`.
- Entre grupos: tick mostaza corto. Intra-grupo: padding compacto (10px).

## Estado actual

- **2026-05-25 (d)**: hover full-height restaurado en grupos; eliminado `clamp()`; nav `max-content` + columna `1fr` empuja utilidades a la derecha.

## Decisiones editoriales y aprendizajes

- **No hamburguesa en tablet** — el nav debe seguir siendo visible hasta mobile real.
- **No encoger tipografía** — el nav empuja; por debajo de 1180px pasa a 2 filas.
- **Tres clusters, no cuatro** — Sobre junto a Biblioteca/Cifras evita wrap huérfano.
- **2 filas antes que recortar** — por debajo de 1180px el nav gana fila propia a ancho completo en lugar de comprimirse en `1fr` con overflow oculto.

## Ideas futuras

- v1.x: si en 721–1180 aún aprieta con catalán activo, acortar label «Organizaciones» solo en ese rango vía CSS `font-size: 0` + `::after` (último recurso).

## Pendientes operativos

- [ ] Verificar visualmente en `1280`, `1100`, `900`, `721` y `375`.
- [ ] Sincronizar [`SiteChrome.jsx`](../../../.agents/skills/presuntamente-design/ui_kits/web/SiteChrome.jsx) del UI kit si se usa para mocks.
