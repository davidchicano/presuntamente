# Página /

> Componente: `src/components/pages/PgInicio.astro` · Wrapper: `src/pages/index.astro`

## Estado actual

Landing institucional con cuatro bloques:

1. **Hero** — kicker + título + lede + dos CTAs (`Explorar casos`, `Cómo se redacta`) + sello aside con cifras del inventario.
2. **Tres reglas** del proyecto (cita siempre, sin cuota política, presunción de inocencia).
3. **Casos destacados** — stack vertical de ≥2 casos publicables más activos. Grid 2 columnas (~2/3 + ~1/3): izquierda con badges, nombres y resumen ejecutivo íntegro (`descripcion_corta`); derecha con meta (organización afectada, partidos, último hito). Borde izquierdo azul → mostaza en hover.
4. **Cuatro secciones** del sitio (Casos, Personas, Organizaciones, Biblioteca) en grid 2×2 unificado dentro del contenedor (sin márgenes negativos), alturas iguales, CTA al pie.
5. **Disclaimer final** de presunción de inocencia.

Ranking del bloque «Casos destacados»: actividad reciente (último hito) ↓ + nivel de relevancia editorial (capital > alta > media > baja) como desempate. Filtra estados no publicables (`pendiente`, `borrador`, `retirado_*`).

## Ideas futuras

### v1 pre-launch (revisión editorial humana, Bloque C)

- Pulir el hero para primer impacto en visitantes que entran desde redes sociales — copy del kicker, título y lede son la primera lectura crítica para periodistas y afectados.
- Pulir el copy de las tres reglas para que se lean sin necesidad de entrar en `/sobre`.
- Revisar tono del disclaimer final (¿demasiado seco? ¿demasiado pomposo?).

### v1.x

- Tercer destacado opcional cuando haya 8+ casos publicables.
- ~~A/B copy del kicker~~ — **Cerrado 2026-05-27:** kicker `sin ruido, sin ideología, con fuente` (sustituye «sin financiación», que sonaba a auto-publicidad en la primera lectura; el modelo de sostenimiento queda para `/sobre`).
- Sello aside del hero: dejar fija la fecha de última actualización del inventario y/o nº de casos beta_publica vs publicado.

### Sin compromiso

- Animación sutil de aparición del hero (no usar bibliotecas pesadas).
- Banner discreto cuando hay un hito muy reciente en un caso destacado (anuncio "ALGO PASA EN").

## Aprendizajes y decisiones editoriales

- **Casos destacados es prueba social, no propaganda.** El bloque enseña cómo es una ficha real del inventario, con sus campos visibles. La selección debe priorizar movimiento procesal (actividad reciente), no relevancia mediática ni ideológica.
- **Estado de publicación visible.** Beta pública / publicado se distinguen explícitamente con `EstadoPublicacionBadge`; no se esconde que hay fichas en distintos grados de madurez.
- **Partidos afectados son chips, no narrativa.** En la landing el chip dice "PSOE" o "PP" pero sin tipo de afectación; el detalle del por qué vive en la ficha.
- **No mostrar conteo de hitos** en el preview: es un dato seco que no marketing nada. Cambio 2026-05-26 (tarde).
- **"Caso destacado" → "Casos destacados".** Plural y ≥2 elimina la sensación de monocaso. Cambio 2026-05-26 (tarde).
- **El preview muestra organización afectada con RolBadge**, no string libre. Coherencia visual con el listado y la ficha de caso.
- **Kicker del hero (2026-05-27):** tercer eje `con fuente` en lugar de `sin financiación` — la landing promete trazabilidad editorial, no el modelo de sostenimiento (eso va en `/sobre`).

## Pendientes operativos

- [x] Mostrar al menos 2 casos en el bloque destacado. **Entregado 2026-05-26 (tarde).**
- [x] Enriquecer preview con datos relevantes (estado, org afectada, partidos, último hito truncado). **Entregado 2026-05-26 (tarde).**
- [ ] Pulir copy del hero y tres reglas. Bloque C de revisión editorial humana. Filosofía y mantenimiento del hilo de lanzamiento viven en [`/sobre`](sobre.md) (2026-05-27).
- [ ] Decidir si la landing debe enlazar a `/sobre/clasificacion-medios` (futuro) o a `/sobre` global cuando exista metodología pública de medios.
