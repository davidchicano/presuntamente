# Skills locales del proyecto presuntamente

Skills para usar con Claude Code en este repositorio. Se construyen iterativamente con cada uso real (`AGENTS.md` §"Skills locales"); cada SKILL.md tiene una sección `## Histórico` con lecciones de cada caso real.

## Skills implementadas

- **`investigar-caso`** v0 — arrancar un caso nuevo desde URL/nombre/brief. Localiza órgano titular, implicados con rol formal y hitos clave; genera el esqueleto YAML inicial (Caso + 1-2 Hitos + Documentos + 1-3 Roles + Hechos). Aplica los guardarraíles del doc 03 §4 + tensión brief/realidad procesal aprendida con Plus Ultra.
- **`incorporar-hito`** v1 — añadir Hito + Hechos + Documento a un caso existente desde un PDF de auto, una nota CGPJ o cobertura cruzada. Nunca asigna `tipo = acreditado` automáticamente; nunca inventa. Histórico de uso real: Plus Ultra PR1 y PR2.
- **`presuntamente-design`** — diseño visual canónico del sitio. Tokens, componentes, lenguaje gov-retro. User-invocable con `/presuntamente-design`.

## Skills planeadas (placeholders)

- **`revisar-señales`** — procesar `content/signals.yaml`, descartar ruido, proponer PRs por las señales reales.
- **`validar-repo`** — ejecutar `pnpm validate` con output agrupado por entidad y resumen.
- **`rectificar`** — gestionar una solicitud de rectificación entrante (issue con etiqueta `rectificacion`). Aplica el procedimiento del doc 04 §6.
- **`anonimizar`** — V-17: cuando una persona privada cierra todos sus `RolEnCaso`, gestionar revisión de anonimización o retirada de ficha.

## Convención de implementación

Cada skill vivirá en su propio directorio:

```
.agents/skills/
  investigar-caso/
    SKILL.md         ← descripción + instrucciones de uso
    (assets opcionales)
  incorporar-hito/
    SKILL.md
  ...
```

`/.claude/skills/` se mantiene sólo como capa de compatibilidad: sus entradas son symlinks relativos a `/.agents/skills/`.

## Cómo se invocan

Desde Claude Code en este repo: `/<skill-name>` con argumentos opcionales según cada skill.

## Documentos de referencia

- Procedimiento operativo: `docs/diseno/03-estrategia-de-mantenimiento.md`.
- Guardarraíles legales: `docs/diseno/04-riesgos-legales-y-eticos.md`.
- Reglas anti-desinformación que toda skill debe respetar: `docs/diseno/02-ficha-de-caso.md` §4.
