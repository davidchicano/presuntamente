# AGENTS.md — presuntamente

Guía para cualquier agente LLM (Claude Code, Codex, Cursor, etc.) que trabaje en este repositorio. Este fichero es la fuente; `CLAUDE.md` es un symlink a él.

## Qué es este proyecto

**presuntamente** es un inventario interactivo, público y open source de los casos de corrupción más relevantes en España. La misión es **reducir desinformación** ofreciendo una referencia objetiva, trazable y sin cuota política de los procedimientos judiciales relevantes.

- Sitio: `presuntamente.org` (dominio reservado, no comprado todavía).
- Licencia código: AGPL-3.0.
- Licencia contenido editorial: CC BY-SA 4.0.

## Principios irrenunciables

Cualquier acción que hagas debe respetar:

1. **Imputación ≠ condena.** Modelado como `RolEnCaso` con tipos discretos (`investigado`, `procesado`, `acusado`, `condenado`, `absuelto`, `desimputado`) y trayectoria temporal. Nunca afirmaciones que insinúen culpabilidad sin sentencia firme.
2. **Cada afirmación con su fuente y nivel.** Los `Hecho` exigen `Documento` de respaldo con nivel (1-4) visible.
3. **Tratamiento sin cuota política.** Casos vivos o cerrados, de cualquier partido, ordenados por relevancia objetiva.
4. **Presunción de inocencia en el lenguaje.** Verbos prohibidos para hechos no acreditados ("robó", "estafó", "se apropió"). Preferidos: "se investiga", "se atribuye", "consta en el informe X que…".
5. **No exposición innecesaria de personas privadas.** Sólo si tienen rol formal en el procedimiento. V-17: revisión obligatoria de anonimización cuando cierran sus roles.
6. **El git log es el changelog público.** Nunca borres información; corrige con `corregido_por` y conserva el histórico.

## Documentos de diseño

Toda decisión arquitectónica, editorial o legal está justificada en `docs/diseno/`:

- `01-modelo-de-datos.md` — entidades, atributos, 21 reglas CI (V-01..V-21).
- `02-ficha-de-caso.md` — secciones, citación inline, 10 reglas anti-desinformación (P-01..P-10).
- `03-estrategia-de-mantenimiento.md` — watchers, pipeline, uso de LLM con guardarraíles.
- `04-riesgos-legales-y-eticos.md` — marco legal, disclaimer, protocolo querella.
- `05-arquitectura-tecnica.md` — stack.
- `06-roadmap-por-fases.md` — fases ejecutables.

Si vas a tocar algo no trivial, consulta primero el doc correspondiente.

## Estructura del repositorio

```
/AGENTS.md                  ← este fichero
/CLAUDE.md                  ← symlink → AGENTS.md
/ROADMAP.md                 ← estado vivo del proyecto (leer al iniciar, actualizar al cerrar)
/DESIGN.md                  ← lenguaje visual canónico (Claude Design + Claude Code)
/README.md                  ← descripción público-facing
/CONTRIBUTING.md            ← cómo contribuir
/LICENSE                    ← AGPL-3.0 (código)
/LICENSE-CONTENT.md         ← CC BY-SA 4.0 (contenido editorial)
/LEGAL.md                   ← aviso legal (placeholder hasta publicación con dominio)
/docs/diseno/               ← documentos de diseño
/content/                   ← contenido canónico (YAML)
  casos/<slug>/
    caso.yaml
    NOTES.md                ← anotaciones internas, EXCLUIDO del build público
    hitos/  hechos/
  personas/<slug>.yaml
  organizaciones/<slug>.yaml
  documentos/<slug>.yaml
  delitos/<slug>.yaml
  signals.yaml              ← bandeja del watcher
/schemas/                   ← JSON Schemas que validan los YAML
/scripts/                   ← validación, watchers, builds
/src/                       ← código Astro
  pages/
    index.astro             ← wrapper mínimo → PgHome lang="es"
    cat/                    ← rutas catalanas (vacío en MVP)
  components/
    pages/                  ← Pg* — lógica real de cada página
  layouts/
  styles/
/.claude/skills/            ← skills locales del proyecto
/.github/workflows/         ← CI
```

## Convenciones

### Patrón `Pg*` para páginas

Las `.astro` en `/src/pages/` son **wrappers mínimos**. La lógica real vive en componentes `Pg*` en `/src/components/pages/`. Las páginas pasan `lang` como prop.

```astro
---
// src/pages/index.astro
import PgHome from '@/components/pages/PgHome.astro';
---
<PgHome lang="es" />
```

```astro
---
// src/components/pages/PgHome.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
interface Props { lang?: 'es' | 'ca'; }
const { lang = 'es' } = Astro.props;

// TODO i18n: cuando se active el catalán, añadir rama 'ca'.
const strings = { /* castellano hardcoded */ };
---
<BaseLayout lang={lang} title={...}>...</BaseLayout>
```

### I18n

Estructura ES + CAT desde día 1 (carpetas `/src/pages/cat/` listas). MVP castellano hardcoded en `Pg*` con `// TODO i18n` donde irán los catalanes. Migración a `astro-i18n` nativo cuando toque.

### NOTES.md por caso

Cada `/content/casos/<slug>/NOTES.md` contiene anotaciones internas: contexto, "ojo con esta fuente porque…", decisiones tomadas, recordatorios para el LLM. **Excluido del build del sitio público.** Vive sólo en el repo para humanos y agentes.

### Privacidad

Este repo es público. **No incluyas datos personales del maintainer** (dirección, teléfono, info que pueda avergonzarle). Tono puede ser personal y transparente; contenido no autobiográfico.

### Commits

- Git configurado con email noreply de GitHub (`<id>+davidchicano@users.noreply.github.com`).
- Mensajes en español, imperativo presente: "Añade ficha Plus Ultra", "Corrige tipo de hecho en pieza X".
- Una idea por commit. Commits pequeños y coherentes.

### Workflow de rama y PRs

**Política actual (decidida por el maintainer el 2026-05-21):** trabajar **directamente sobre `main`**, sin ramas ni Pull Requests, mientras dure el MVP y hasta que el maintainer indique lo contrario.

**El agente HACE commits, NUNCA HACE push** (norma reforzada por el maintainer el 2026-05-21). El push a `origin/main` lo decide y lo lanza el maintainer cuando le viene bien. El agente acumula commits coherentes en la rama local y se detiene antes de `git push`. Si necesita publicar algo, **pregunta primero**. Esta norma vale igual aunque `pnpm validate` y `pnpm build` estén verdes.

Razón: en fase MVP el repo tiene un solo maintainer y los ciclos de feedback se hacen en sesiones de Claude Code, no en una review formal de GitHub. Las ramas + PRs ralentizan sin aportar, pero el push sí es un acto editorial que decide el maintainer (puede querer revisar el árbol de commits, esperar a juntar varios bloques, o vetar uno antes de que salga al repositorio público).

**Cuando el maintainer reactive el modelo de ramas + PRs** (esperable cuando entren contribuyentes externos o cuando se establezcan CODEOWNERS), volver a:
- Una rama por unidad de cambio coherente.
- PR descriptivo con qué, por qué y fuentes.
- CI verde antes de merge.
- Self-merge sólo del maintainer.

Si una sesión va a tocar algo arriesgado (migración, refactor amplio, cambio que rompe convenciones), aún en política directa el agente debe **proponer crear una rama puntual y preguntar** antes de meter el cambio en main.

## Skills locales (`.claude/skills/`)

Skills planeadas para usar con Claude Code en este repo:

- `investigar-caso` — arrancar un caso nuevo desde URL/nombre.
- `incorporar-hito` — añadir Hito + Hechos + Documento desde un PDF de auto.
- `revisar-señales` — procesar bandeja del watcher (`content/signals.yaml`).
- `validar-repo` — ejecutar `pnpm validate` con output amigable.
- `rectificar` — gestionar solicitud de rectificación entrante.
- `anonimizar` — V-17: gestionar anonimización de persona privada.

En Fase 0 son placeholders; se implementan según se necesiten.

**Convención clave**: las skills se moldean con la experiencia, **no se fijan upfront**. Cada caso investigado refina la skill correspondiente. La primera versión es la mínima útil; cada uso aporta mejoras. No esperar a "diseñar la skill perfecta" antes de usarla.

## Workflow para agentes

0. **Lee [`/ROADMAP.md`](ROADMAP.md)** antes de hacer cualquier otra cosa. Es el estado vivo del proyecto: dónde estamos, qué toca, decisiones pendientes, aprendizajes. **Obligatorio.**
1. **Antes de cambiar algo no trivial**: lee el doc de diseño correspondiente en `docs/diseno/`. Si tocas algo visual o de marca, además [`/DESIGN.md`](DESIGN.md). Si el cambio contradice un principio o regla, NO lo hagas; pregunta.
2. **Para crear/modificar contenido**: por defecto, commit directo a `main` (ver §"Workflow de rama y PRs"). **No hagas `git push`** — espera a que el maintainer lo decida. Si el cambio es arriesgado o amplio, propón rama puntual antes de tocar nada.
3. **Valida localmente** antes de pushear: `pnpm validate` y `pnpm build`.
4. **Commits descriptivos**: explica qué, por qué, y cita fuentes en el mensaje.
5. **Si encuentras un dato sensible**: NO lo publiques sin consultar `docs/diseno/04-riesgos-legales-y-eticos.md`.
6. **Al cerrar la sesión o tras un cambio significativo**: actualiza [`/ROADMAP.md`](ROADMAP.md) — backlog, estado, aprendizajes. **Obligatorio.**

## Cuando dudes

Pregunta antes de actuar. Es mejor un issue extra que un PR que viole un principio del proyecto.
