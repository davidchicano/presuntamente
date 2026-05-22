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
/.agents/skills/            ← skills locales del proyecto (canónico)
/.claude/skills/            ← symlinks de compatibilidad → /.agents/skills/
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

### Repositorio multiagéntico en paralelo

**Asume siempre que otro agente o el maintainer puede estar editando otros archivos en paralelo sobre la misma working copy.** Norma incorporada el 2026-05-22 tras un incidente real: un `git commit` arrastró al staging todos los archivos modificados/untracked del working directory de una sesión paralela del maintainer (PR3 del caso Begoña Gómez mientras se trabajaba PR1 del caso González Amador). El commit se deshizo con `git reset HEAD~1` no destructivo y se rehizo con archivos explícitos, sin pérdida de trabajo. Para que no se repita:

1. **Antes de cualquier `git add`**, lanza `git status -s` y clasifica visualmente cada línea: ¿es mío o de la otra sesión? Los archivos `M` (modified) y `??` (untracked) que no formen parte del cambio que estás haciendo son trabajo paralelo de otro: NO los toques.
2. **Stagea siempre por ruta explícita**. Nunca uses `git add .`, `git add -A`, `git add -u` ni patrones genéricos (`git add content/`). Lista las rutas concretas una por una. Si son muchas, agrúpalas en bloques temáticos y haz varios `git add ARCHIVO1 ARCHIVO2 ...` distintos, pero siempre con rutas concretas.
3. **Justo después de `git add` y antes del `git commit`**, vuelve a lanzar `git status -s` y confirma que sólo aparecen como `A` (added) los archivos que querías stagear, y que los `M` / `??` ajenos siguen fuera del staging.
4. **Si dependes de un archivo creado por la sesión paralela** (p. ej. una organización nueva referenciada por uno de tus documentos), no lo incluyas en tu commit. Sustituye la referencia por otra org ya commiteada en main, o duplica el nombre si choca y resuelve cuando ambos commits hayan aterrizado. Lo último que quieres es introducir una dependencia cruzada con un archivo que aún no está en el árbol git.
5. **Las herramientas que afectan al working directory global** (cambios de schema, ediciones a `src/lib/*`, edición de `ROADMAP.md`) son especialmente delicadas si la otra sesión también las toca. Para `ROADMAP.md` en particular, lee primero la versión actual del fichero (puede haber cambiado mientras trabajabas), añade tu sección sin pisar la suya, y commitea de forma independiente al cambio de datos.

Si detectas que la sesión paralela ya ha commiteado algo entremedias (`git log` muestra un commit que no es tuyo intercalado), no es un problema: tus commits posteriores se aplican normalmente sobre la nueva HEAD.

### Granularidad de commits

**Un commit por sesión de trabajo / objetivo coherente, no por bloque interno arbitrario.** Norma incorporada el 2026-05-22 por feedback del maintainer ("no nos paramos a revisar todos los commits uno por uno"). La política actual de **no push** significa que el log local no es un changelog público todavía; lo lee el maintainer al revisar la sesión, no la comunidad.

Como guía operativa:

- **PR1 del caso X** ⇒ idealmente **un único commit** que arranque caso + personas + organizaciones + documentos + hitos + hechos + roles. Mensaje extenso en el cuerpo describiendo el bloque.
- **PR2/PR3+ del caso X** ⇒ un commit por PR (no por sub-bloque interno).
- **Cambios mixtos que combinen naturalezas distintas** (p. ej. cambio de schema + datos del caso, o cambio de componente UI + datos) sí merecen commits separados: la trazabilidad ahí compensa.
- **Cambios mecánicos masivos** (rename de slugs en muchos ficheros, p. ej.) se mantienen como un único commit por la legibilidad.

Excepción legítima al "uno por sesión": si la sesión incluye un cambio editorialmente delicado del que el maintainer podría querer revertir aisladamente (cambiar un nombre propio, modificar la calificación de un hecho de `acreditado` a `atribuido`, retirar una persona), aislar esa decisión en su propio commit ayuda al rollback selectivo. En el resto de los casos, un commit grande con un mensaje claro es preferible a cinco commits pequeños del mismo bloque.

## Git hooks (`hooks/`)

El repo trae hooks de git versionados en `/hooks/` (no `.git/hooks/`, que no se versiona). Para activarlos en una máquina nueva ejecuta una vez:

```
git config core.hooksPath hooks
```

Hooks vigentes:

- **`hooks/pre-commit`** — Si entran nuevos documentos N4 (artículos de prensa) en el staging, los archiva automáticamente en `archive.org` y añade `url_archivo` al YAML antes de cerrar el commit. Cumple V-13 (mirror permanente para fuentes N4) sin que nadie tenga que recordarlo.
  - **No bloquea nunca el commit**: si archive.org no responde / hay timeout / no hay red, avisa y deja pasar. Los YAMLs sin `url_archivo` se reintentan en el siguiente commit que toque docs.
  - Si una sesión añade muchos documentos a la vez puede tardar ~10-20 segundos por URL. Para saltárselo puntualmente: `git commit --no-verify`.
  - Sin autenticación: usa el endpoint anónimo de archive.org, cuota 8.000 captures/día (sobra varios órdenes de magnitud).

Comandos relacionados:

- `pnpm archive:dry` — Lista qué documentos N4 del repo no tienen `url_archivo` (dry-run, no llama a archive.org).
- `pnpm archive:catchup` — Archiva TODO el backlog pendiente del repo (no solo lo del staging). Útil al activar el hook por primera vez o cuando se acumula backlog por sesiones con archive.org caído.

## Skills locales (`.agents/skills/`)

Skills planeadas para usar con Claude Code en este repo:

- `investigar-caso` — arrancar un caso nuevo desde URL/nombre.
- `incorporar-hito` — añadir Hito + Hechos + Documento desde un PDF de auto.
- `revisar-señales` — procesar bandeja del watcher (`content/signals.yaml`).
- `validar-repo` — ejecutar `pnpm validate` con output amigable (capa schema / V-rules mecánicas).
- `revisar-caso` — auditoría editorial cualitativa por LLM de un caso entero (capa que `validar-repo` no cubre: reglas P del doc 02, presunción de inocencia en el lenguaje, uso correcto de N4, ausencia de cuota política). Sirve tanto para revisar PRs externas de contribuyentes (`gh pr checkout <num>` + `/revisar-caso <slug>` en local) como para auto-revisarse cuando se trabajan varios casos en paralelo. Detalle del diseño en cuatro capas y checklist inicial en [`/ROADMAP.md`](ROADMAP.md) §"Después de Fase 1".
- `rectificar` — gestionar solicitud de rectificación entrante.
- `anonimizar` — V-17: gestionar anonimización de persona privada.

En Fase 0 son placeholders; se implementan según se necesiten.

**Convención clave**: las skills se moldean con la experiencia, **no se fijan upfront**. Cada caso investigado refina la skill correspondiente. La primera versión es la mínima útil; cada uso aporta mejoras. No esperar a "diseñar la skill perfecta" antes de usarla.

**Ubicación canónica:** las skills viven en `/.agents/skills/`. Para mantener compatibilidad con Claude Code, cada entrada de `/.claude/skills/` debe ser un symlink relativo a su equivalente en `/.agents/skills/`.

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
