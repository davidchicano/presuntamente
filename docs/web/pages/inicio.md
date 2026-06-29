# Página /

> Componente: `src/components/pages/PgInicio.astro` · Wrapper: `src/pages/index.astro`

## Estado actual

Landing institucional con cuatro bloques:

1. **Hero** — kicker + título + lede + dos CTAs (`Explorar casos`, `Cómo se redacta`) + sello aside con cifras del inventario.
2. **Tres reglas** del proyecto (cita siempre, sin cuota política, presunción de inocencia).
3. **Casos destacados** — stack vertical de 3 casos publicables más activos o fijados editorialmente. Grid 2 columnas (~2/3 + ~1/3): izquierda con badges, nombres y resumen ejecutivo íntegro (`descripcion_corta`); derecha con meta (organización afectada, partidos, último hito). Borde izquierdo azul → mostaza en hover.
4. **Cuatro secciones** del sitio (Casos, Personas, Organizaciones, Biblioteca) en grid 2×2 unificado dentro del contenedor (sin márgenes negativos), alturas iguales, CTA al pie.
5. **Disclaimer final** de presunción de inocencia.

Ranking del bloque «Casos destacados»:

1. **Override editorial `pin_destacado`** (campo opcional en `caso.yaml`, entero positivo). Los casos pineados van primero, ordenados asc por valor del pin (1 antes que 2 antes que 3). Pensado para forzar visibilidad cuando la mecánica natural no coincide con el criterio editorial del momento.
2. **Algoritmo natural** para los no pineados: actividad reciente (último hito) ↓ + nivel de relevancia editorial (capital > alta > media > baja) como desempate.

Filtra estados no publicables (`pendiente`, `borrador`, `retirado_*`).

## Ideas futuras

### v1 pre-launch (revisión editorial humana, Bloque C)

- Pulir el hero para primer impacto en visitantes que entran desde redes sociales — copy del kicker, título y lede son la primera lectura crítica para periodistas y afectados.
- Pulir el copy de las tres reglas para que se lean sin necesidad de entrar en `/sobre`.
- Revisar tono del disclaimer final (¿demasiado seco? ¿demasiado pomposo?).

### v1.x

- ~~Tercer destacado opcional cuando haya 8+ casos publicables.~~ **Cerrado 2026-06-29:** la portada muestra 3 destacados para cubrir el frente de actualidad Plus Ultra + Leire Díez + Koldo.
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
- **`pin_destacado` como válvula editorial (2026-05-28):** la mecánica natural de "último hito + relevancia" puede contradecir el criterio del maintainer cuando un caso es el tema del día por intensidad mediática pero su último hito formal es ligeramente anterior al de otro caso. En vez de trampear fechas o forzar hitos por filtración del sumario, se introduce `pin_destacado` (entero positivo, asc) como override explícito. Vaciar cuando deje de aplicar. Primer uso: PU=1 + Leire=2 al arrancar el caso Leire Díez por imputación a la dirigencia PSOE el 27-may-2026 con auto Pedraz más reciente que el último hito de PU (aplazamiento 26-may).
- **Tercer destacado (2026-06-29):** el bloque pasa de 2 a 3 tarjetas para que Koldo pueda aparecer junto a Plus Ultra y Leire Díez tras su promoción a beta pública y la localización del primario CENDOJ de la Sentencia TS 418/2026. Pins vigentes: PU=1, Leire=2, Koldo=3.

## Pendientes operativos

- [x] Mostrar al menos 2 casos en el bloque destacado. **Entregado 2026-05-26 (tarde).**
- [x] Mostrar 3 casos destacados cuando la actualidad editorial lo pida. **Entregado 2026-06-29.**
- [x] Enriquecer preview con datos relevantes (estado, org afectada, partidos, último hito truncado). **Entregado 2026-05-26 (tarde).**
- [ ] Pulir copy del hero y tres reglas. Bloque C de revisión editorial humana. Filosofía y mantenimiento del hilo de lanzamiento viven en [`/sobre`](sobre.md) (2026-05-27).
- [ ] Decidir si la landing debe enlazar a `/sobre/clasificacion-medios` (futuro) o a `/sobre` global cuando exista metodología pública de medios.
