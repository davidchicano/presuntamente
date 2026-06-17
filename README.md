# presuntamente

Inventario interactivo, público y open source de los casos de corrupción más relevantes en España.

## Misión

Ofrecer una **referencia objetiva, trazable y sin cuota política** sobre los procedimientos judiciales relevantes en España, para reducir desinformación y permitir al ciudadano formarse una opinión a partir de hechos verificables.

- Cada afirmación cita su fuente y su nivel de fuente.
- Lo acreditado, lo investigado, lo desmentido y lo exculpatorio aparecen claramente diferenciados.
- Imputación ≠ condena: se respeta la presunción de inocencia en datos y lenguaje.
- Todo el contenido y el código son abiertos.

## Estado

Proyecto en beta pública, publicado en [`presuntamente.org`](https://presuntamente.org/). El catálogo evoluciona en este repositorio y el sitio se despliega automáticamente desde `main`. Las cifras actualizadas del inventario están en la página [`/cifras`](https://presuntamente.org/cifras/).

Estado vivo y backlog detallado en [`ROADMAP.md`](ROADMAP.md).

## Licencias

- **Código**: AGPL-3.0 (ver [`LICENSE`](LICENSE)).
- **Contenido editorial** (fichas, textos, datos estructurados): CC BY-SA 4.0 (ver [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)).

## Cómo participar

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md). Vías abiertas:

- **Aportes editoriales** — fuentes que faltan, correcciones fácticas menores o ideas sobre el sitio — por correo a `aportar@presuntamente.org`. Por defecto anónimos; acreditación opt-in si se solicita explícitamente.
- **Rectificaciones** — si te consideras aludido y discrepas, cauce LO 2/1984 — por correo a `rectificacion@presuntamente.org`.

El maintainer único trabaja en commits directos a `main`; el modelo de Pull Requests formales se activará cuando el proyecto abra la colaboración externa.

## Stack técnico

- [Astro 5](https://astro.build) (build estático) + CSS nativo + [Open Props](https://open-props.style/) como capa base.
- Content Collections sobre los YAML de [`/content/`](content/), validados además por JSON Schema.
- [Pagefind](https://pagefind.app) para búsqueda en el cliente, sin servidor.
- pnpm 11, Node 24 (ver [`.nvmrc`](.nvmrc)).

## Documentación de diseño

[`docs/diseno/`](docs/diseno/) contiene los documentos de diseño completos del proyecto: modelo de datos, ficha de caso, mantenimiento, riesgos legales, arquitectura técnica y roadmap.

## Para agentes (LLM)

Si llegas aquí como agente LLM, lee [`AGENTS.md`](AGENTS.md) antes de hacer cualquier cambio.
