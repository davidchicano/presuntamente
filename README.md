# presuntamente

Inventario interactivo, público y open source de los casos de corrupción más relevantes en España.

## Misión

Ofrecer una **referencia objetiva, trazable y sin cuota política** sobre los procedimientos judiciales relevantes en España, para reducir desinformación y permitir al ciudadano formarse una opinión a partir de hechos verificables.

- Cada afirmación cita su fuente y su nivel de fuente.
- Lo acreditado, lo investigado, lo desmentido y lo exculpatorio aparecen claramente diferenciados.
- Imputación ≠ condena: se respeta la presunción de inocencia en datos y lenguaje.
- Todo el contenido y el código son abiertos.

## Estado

Fase 1.0 (integración del design system) ✅ — el sitio se construye estático con Astro 5 sobre los YAML del propio repo. Primer caso fichado: **Plus Ultra**. Inventario actual: 1 caso · 5 personas · 9 organizaciones · 6 documentos · 4 hitos · 5 hechos · 6 roles.

Todavía **no hay versión pública desplegada**: el dominio `presuntamente.org` está registrado en Cloudflare Registrar (alta del 23 de mayo de 2026) y tres canales editoriales operan vía Cloudflare Email Routing — `contacto@presuntamente.org`, `rectificacion@presuntamente.org` y `aportar@presuntamente.org` (este último activado el 25 de mayo de 2026, cauce editorial documentado en [`CONTRIBUTING.md`](CONTRIBUTING.md) y `docs/diseno/04-riesgos-legales-y-eticos.md` §6bis). La publicación pública del sitio depende además de (a) apertura del apartado de correos del responsable a efectos LSSI y (b) revisión del aviso legal con abogado especializado (ver [`LEGAL.md`](LEGAL.md)). Mientras tanto el sitio funciona localmente con `pnpm dev` y el catálogo evoluciona en este repositorio.

Estado vivo y backlog detallado en [`ROADMAP.md`](ROADMAP.md).

## Stack

- [Astro 5](https://astro.build) (static build) + CSS nativo + [Open Props](https://open-props.style/) como capa base.
- Content Collections sobre los YAML de [`/content/`](content/), validados también por JSON Schema vía [`pnpm validate`](scripts/validate.mjs).
- [Pagefind](https://pagefind.app) para búsqueda full-text estática.
- pnpm 11, Node 24 (ver [`.nvmrc`](.nvmrc)).

## Licencias

- **Código**: AGPL-3.0 (ver [`LICENSE`](LICENSE)).
- **Contenido editorial** (fichas, textos, datos estructurados): CC BY-SA 4.0 (ver [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)).

## Contribuir

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md). Hoy se aceptan:

- **Aportes editoriales** — fuentes que faltan, correcciones fácticas menores o ideas sobre el sitio — por correo a `aportar@presuntamente.org` o issue [`sugerencia-fuente`](.github/ISSUE_TEMPLATE/sugerencia-fuente.yml). Por defecto anónimos; acreditación opt-in si se solicita explícitamente. Detalle en `/aportar`.
- **Rectificaciones** — si te consideras aludido y discrepas, cauce LO 2/1984 — por correo a `rectificacion@presuntamente.org` o issue [`rectificacion`](.github/ISSUE_TEMPLATE/rectificacion.yml).

El modelo de PR formales se activará en Fase 4 (apertura editorial); hasta entonces el maintainer único trabaja en commits directos a `main`.

## Documentación de diseño

[`docs/diseno/`](docs/diseno/) contiene los documentos de diseño completos del proyecto: modelo de datos, UX de ficha, mantenimiento, riesgos legales, arquitectura técnica y roadmap.

## Para agentes (LLM)

Si llegas aquí como agente LLM, lee [`AGENTS.md`](AGENTS.md) antes de hacer cualquier cambio.
