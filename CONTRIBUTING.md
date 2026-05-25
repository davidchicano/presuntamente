# Cómo contribuir a presuntamente

> Esta guía es preliminar. Versión completa cuando el proyecto entre en Fase 4 del roadmap (apertura editorial).

## Antes de cualquier cosa

Lee [`AGENTS.md`](AGENTS.md) y los principios del proyecto. Toda contribución debe respetar:

- Imputación ≠ condena.
- Cada afirmación con fuente y nivel.
- Tratamiento sin cuota política.
- Presunción de inocencia en el lenguaje.

## Aportar fuentes, correcciones o ideas

Si tienes mejor acceso a fuentes o mejor conocimiento de un caso que el equipo del sitio, puedes aportar al inventario sin saber git ni exponerte en un issue público. Tres tipos de aporte aceptados bajo el mismo cauce editorial:

- **Pista a fuente o hito que falta**: sentencia, auto, BOE, informe institucional, cobertura periodística cruzada de una línea editorial no representada.
- **Corrección fáctica menor**: errata, fecha equivocada, órgano mal asignado, segundo apellido incorrecto, link roto, atribución de delito que no encaja con el auto.
- **Idea o sugerencia sobre el sitio**: feature deseada, mejora de UX, observación editorial general.

**Cauce principal**: correo a `aportar@presuntamente.org` (operativo desde el 25 de mayo de 2026 vía Cloudflare Email Routing, reenviado al maintainer). Por defecto el aporte es **anónimo**: el commit que incorpore tu pista cita la fuente verificada, no a ti. Si quieres ser acreditado, pídelo explícitamente en el correo y se añadirá un trailer `Aporte-externo: <nombre o medio>` al commit.

**Alternativa para usuarios de GitHub**: issue con etiqueta `sugerencia-fuente` (template en [`.github/ISSUE_TEMPLATE/sugerencia-fuente.yml`](.github/ISSUE_TEMPLATE/sugerencia-fuente.yml)). El issue es público; si necesitas privacidad, usa el correo.

Procedimiento editorial completo, alcance (qué se acepta y qué no, qué no depositamos), plazos comprometidos (5 días hábiles acuse, 30 días resolución) y tratamiento RGPD en [`docs/diseno/04-riesgos-legales-y-eticos.md`](docs/diseno/04-riesgos-legales-y-eticos.md) §6bis.

## Proponer una rectificación

**Si te consideras aludido** por una información publicada y discrepas, el cauce es distinto del de aportación: es el derecho de rectificación de la Ley Orgánica 2/1984. Ver [`LEGAL.md`](LEGAL.md). Resumen: issue con etiqueta `rectificacion` (template en [`.github/ISSUE_TEMPLATE/rectificacion.yml`](.github/ISSUE_TEMPLATE/rectificacion.yml)) o correo a `rectificacion@presuntamente.org` (operativo vía Cloudflare Email Routing desde el 2026-05-23, reenviado al maintainer). Plazos comprometidos: acuse 48 h hábiles, resolución provisional 7 días hábiles.

## Para colaboradores con permisos (futuro)

Pendiente: protocolo de PR cuando entren colaboradores externos a partir de Fase 4 del roadmap. Mientras tanto, el maintainer único trabaja en **commits directos a `main`** (sin ramas ni Pull Requests) y el push lo lanza siempre él, no los agentes. Detalle en [`AGENTS.md`](AGENTS.md) §"Workflow de rama y PRs".

Política prevista: ver `docs/diseno/03-estrategia-de-mantenimiento.md` y `docs/diseno/04-riesgos-legales-y-eticos.md`.

## Para desarrollo local

```bash
pnpm install
pnpm dev        # arrancar Astro en local
pnpm validate   # validar todos los YAML del repo contra los schemas
pnpm build      # build estático del sitio + índice Pagefind
pnpm preview    # servir dist/ con el índice de búsqueda construido
```

Node 24 (ver [`.nvmrc`](.nvmrc)). pnpm 11 (declarado en `package.json` → `packageManager`).
