# Archivado en archive.org

> Archivos clave: [`scripts/archivar-n4.mjs`](../../../scripts/archivar-n4.mjs) · comandos `pnpm archive:catchup` / `pnpm archive:dry`.

## Qué hace

Captura snapshots en [web.archive.org](https://web.archive.org) de URLs periodísticas y rellena `url_archivo` en los YAML, cumpliendo el espíritu de V-13 (mirror permanente ante desaparición o edición del original).

## Fuentes que archiva

| Ruta | Campo origen | Filtro |
|------|----------------|--------|
| `content/documentos/*.yaml` | `url_canonica` | `nivel_fuente: 4`, sin `url_archivo` ni `url_archivo_no_disponible` |
| `content/cobertura-mediatica/*.yaml` | `url` (por noticia en `noticias[]`) | sin `url_archivo` en ese ítem |
| `content/casos/*/caso.yaml` | `url` (por fuente en `contenido_no_modelado[].fuentes[]`) | sin `url_archivo` en esa fuente |

## Cómo se dispara

**Sólo manual.** No hay hook de git en el repo: los agentes suelen commitear en sandbox sin red y un pre-commit que llame a archive.org bloquearía o ralentizaría commits legítimos.

```bash
pnpm archive:dry      # lista pendientes
pnpm archive:catchup  # archiva todo el backlog
pnpm archive:catchup -- --caso=begona-gomez   # solo un caso (documentos + cobertura)
pnpm archive:catchup -- --caso=begona-gomez --limit=3   # prueba acotada
```

Opcional: `--staged-only` procesa sólo YAML en staging (útil antes de un commit si quieres archivar incrementos pequeños a mano, sin hook).

Flujo recomendado: commitear contenido con `url_archivo` vacío si hace falta; el maintainer ejecuta `pnpm archive:catchup` cuando tenga red y commitea los YAML actualizados en un paso aparte.

## Velocidad y límites de archive.org

El cuello de botella habitual es **`/save/`** (archive.org descarga la página en vivo: 30 s–2 min por URL). El script evita `/save/` cuando puede:

1. **`GET archive.org/wayback/available?url=…`** — si ya hay snapshot, escribe esa URL en `url_archivo` y muestra `OK (reuse)` (~1–3 s).
2. Solo si no hay snapshot (o con `--force-save` / `ARCHIVAR_SKIP_REUSE=1`) llama a **`/save/`** → `OK (capture)`.

**Pausa entre URLs en catchup:** 0,8 s tras `reuse`; 2 s (default) tras `capture` o fallo. Override: `ARCHIVAR_WAIT_MS=500`.

Si acabas de un catchup largo interrumpido, conviene **esperar unos minutos** antes de relanzar: la IP puede estar rate-limited temporalmente.

**Cuota:** endpoint anónimo ~8.000 capturas/día (sobra para este repo). Reutilizar snapshots no consume captura nueva.

## Estado actual

**Entregado 2026-05-26:** documentos N4 + cobertura mediática vía `scripts/archivar-n4.mjs`. **Ampliado 2026-06-18:** fuentes de `contenido_no_modelado[].fuentes[]`. **Retirado 2026-05-26:** hook `hooks/pre-commit` (incompatible con commits en sandbox sin red).

Backlog típico sin catchup: Kitchen (N4 sin `url_canonica`), cobertura de Begoña (29 noticias sin mirror), documentos N4 sueltos con URL pero sin pasar catchup.

## Decisiones editoriales y aprendizajes

- El archivado es **post-commit**, no condición del commit. Los agentes pueden dejar `url_archivo` vacío y anotar en `notas`; el maintainer corre catchup con red.
- Paywall / anti-bot (HTTP 520): marcar `url_archivo_no_disponible` en documentos N4 con justificación; confiar en respaldo cruzado (doc 01).
- **HTTP 520/523 de archive.org en `--catchup` = error transitorio de su CDN/origen (Cloudflare), no fallo nuestro.** Los `OK (reuse)` reutilizan un snapshot existente; los `FAIL ... respuesta sin Location utilizable` son capturas frescas que su infraestructura no completó en ese momento. Quedan sin `url_archivo` (inocuo, conservan `url_canonica`): reintentar más tarde. Solo marcar `url_archivo_no_disponible` si falla de forma persistente.
- **Bug del inyector con `url_canonica` plegado, corregido 2026-06-04.** `insertUrlArchivoDocumento` insertaba `url_archivo` en `idx+1`, partiendo un escalar `url_canonica: >-` (cuyo valor vive en líneas indentadas) y rompiendo el YAML. Incidente real: 3 documentos de `barcenas-caja-b` rotos por sucesivos `archive:catchup`. Arreglado para avanzar hasta el final del bloque antes de insertar. Si se vuelve a tocar el inyector, conservar el manejo de escalares plegados/literales.

## Pendientes operativos

- [ ] Ejecutar `pnpm archive:catchup` para vaciar backlog histórico (Kitchen, cobertura Begoña, etc.).
