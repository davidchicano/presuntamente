# Resumen Al grano

> Archivos clave: pendiente de implementar

## Qué hace

Ofrece en la ficha de caso una version accesible y esquematica del resumen ejecutivo, activable con un toggle publico llamado provisionalmente "Al grano".

## Para qué sirve

Permite que una persona sin tiempo o sin vocabulario juridico entienda rapidamente que se investiga, quien tiene rol formal, que esta probado, que no esta probado y por que importa.

## Cómo funciona

La version pre-launch deberia ser contenido editorial controlado, no generacion en runtime.

Modelo propuesto:

- `resumen_ejecutivo`: prosa formal actual.
- `resumen_al_grano` o `resumen_accesible`: version breve en bullets/frases cortas.

El toggle cambia la visualizacion entre version completa y "Al grano". Pagefind y SEO deben tratarse con cuidado para no indexar dos textos contradictorios ni duplicar en exceso.

## Estado actual

No implementada. El ROADMAP la recogia como "Resumen para perezosos"; tras la discusion del 2026-05-25 el encuadre preferido es "Al grano" como copy publico provisional, con criterio de lectura facil y lenguaje juridicamente prudente.

## Decisiones editoriales y aprendizajes

- **Mas claro no significa mas agresivo.** La version accesible mantiene presuncion de inocencia, fuentes y cautelas.
- **Evitar tono de tertulia.** Se puede ser directo sin usar verbos prohibidos ni caricaturizar el caso.
- **"Al grano" es mejor copy publico que "para perezosos".** Es popular y directo sin insultar al lector.
- **Debe decidirse pronto.** Si se mete despues de decenas de casos, habra que reescribir mucho contenido.
- **Puede apoyarse en Lectura Facil, pero no limitarse a ella.** La referencia UNE-153101 es util por prudencia, aunque el producto puede tener voz propia.

## Ideas futuras

### v1 pre-launch

- Añadir campo de resumen accesible al schema de caso.
- Crear version "Al grano" para los casos publicables actuales.
- Toggle en el resumen ejecutivo de ficha de caso.
- Checklist en `revisar-caso` para verbos prohibidos y afirmaciones sin respaldo tambien sobre el texto accesible.

### v1.x

- Version "Al grano" para cronologia.
- Version "Al grano" por hecho sensible.
- Persistencia de preferencia del lector entre paginas.

### Sin compromiso

- Skill LLM para proponer borradores de `resumen_al_grano`, siempre con revision humana antes de publicar.

## Pendientes operativos

- [ ] Decidir nombre de campo (`resumen_al_grano` vs `resumen_accesible`).
- [ ] Decidir copy final del toggle.
- [ ] Resolver impacto SEO/Pagefind.
- [ ] Crear guia de estilo breve para esta voz.
