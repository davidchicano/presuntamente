# Página /personas

> Componente: `src/components/pages/PgPersonas.astro` · Wrapper: `src/pages/personas/index.astro`

## Estado actual

Listado tabular con filtros (búsqueda, figura pública/privada) + cinco columnas tras el sprint del 2026-05-26 (tarde):

1. **Persona** — nombre completo + etiqueta itálica en gris pálido al lado del nombre («figura pública» / «persona privada»), y debajo mini-descripción de `biografia_corta` (recortada a ~110 caracteres).
2. **Rol procesal principal** — `RolBadge` del rol más fuerte de la persona (priorizando condenado > imputación activa > funcional).
3. **Organización principal** — organización derivada del vínculo de cargo más reciente donde la persona es sujeto (de naturalezas `cargo_*` y `nombramiento_por_gobierno`). Enlace a la página de la organización.
4. **Cargo actual** — `cargo_publico_actual` literal.
5. **Casos** — número de casos en los que la persona aparece.

## Ideas futuras

### v1 pre-launch

- Pulir descripciones cortas (`biografia_corta`) de las personas modeladas para que rindan bien en la mini-descripción. Algunas son largas; conviene tener una versión corta canónica.

### v1.x

- Filtro adicional por «rol procesal principal».
- Filtro adicional por «organización principal» (auto-completado).
- Indicar cargos históricos compactados cuando no haya `cargo_publico_actual`.

### Sin compromiso

- Vista alternativa tarjeta para móvil.

## Aprendizajes y decisiones editoriales

- **«Figura pública» como texto plano, no badge.** El badge daba demasiado peso visual a un dato secundario; texto pálido en gris cumple igual. Decisión maintainer 2026-05-26 (tarde).
- **Mini-descripción supera al cargo solo.** El cargo se ve igualmente en la columna propia; la mini-descripción aporta contexto adicional ("ministro de…", "ex consejero…", "abogado defensor de…") más informativo que la repetición.
- **Organización principal derivada del vínculo más reciente.** Si la persona tiene varios cargos a la vez (es habitual: cargo público + cargo orgánico de partido), gana el vigente y, entre vigentes, el más reciente. Lo hace explícito el ordenamiento por `vigente DESC, desde DESC` antes de tomar el primero.

## Pendientes operativos

- [x] Sustituir badge de figura pública por texto pálido. **Entregado 2026-05-26 (tarde).**
- [x] Mini-descripción de `biografia_corta`. **Entregado 2026-05-26 (tarde).**
- [x] Columna «Organización principal». **Entregado 2026-05-26 (tarde).**
- [ ] Pulir `biografia_corta` de personas con texto demasiado largo en el primer fragmento.
