# Página /sobre

> Componente: `src/components/pages/PgSobre.astro` · Wrapper: `src/pages/sobre/index.astro`

## Estado actual

Página institucional con diez bloques numerados:

1. **Qué es** — misión, frase rectora y cuatro ejes de filosofía (trazabilidad, sin fuente no hay dato, sin ideología, rigurosidad).
2. **Principios editoriales** — siete reglas operativas (las seis de AGENTS + rigurosidad frente a ambigüedad).
3. **Cómo se mantiene vivo** — vigilancia de fuentes, bandeja de señales, incorporación por deltas, IA con guardarraíles y revisión humana (sin prometer tiempo real).
4. **Colaborar** — texto de aportes + CTA a `/aportar`; aludido → ancla `#correcciones`.
5. **Niveles N1–N4** · 6. **Roles** · 7. **Tipos de hecho** · 8. **Lenguaje**.
9. **Correcciones y rectificación** — LO 2/1984 + CTA a `/rectificar` + historial público (sin repetir carriles de aportar).
10. **Licencias y código**.

CTA desde la home «Cómo se redacta» apunta aquí. Canon de mantenimiento detallado: [doc 03 — "Estrategia de mantenimiento"](docs/diseno/03-estrategia-de-mantenimiento.md).

## Ideas futuras

### v1.x

- Enlace desde «Cómo colaborar» a skill o checklist público para aportantes con PDF de auto.
- Fecha de `ultima_revision_editorial` agregada en un párrafo de mantenimiento (dato vivo del build).

### Sin compromiso

- Diagrama del pipeline señal → diff → merge (mermaid en doc, no duplicado en página).

## Aprendizajes y decisiones editoriales

- **2026-05-27:** §4 Colaborar = aportes + botón `/aportar`; §9 Correcciones = rectificación + botón `/rectificar`. Detalle operativo solo en esas páginas.
- **IA:** Se describe como aceleración con guardarraíles y revisión humana ([doc 03 — "Uso de LLM"](docs/diseno/03-estrategia-de-mantenimiento.md#4-uso-de-llm-para-diffs-revisables)), no como sustituto de criterio ni garantía de neutralidad.
- **Actualización:** «Vigilancia + incorporación documentada», no «casi real-time».

## Pendientes operativos

- [ ] Revisión humana Bloque C del copy de mantenimiento/colaborar tras primer tráfico desde redes.
- [ ] Cuando se abran PRs externos, actualizar párrafo «código» en sección 4 con enlace a guía CONTRIBUTING ampliada.
