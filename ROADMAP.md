# Roadmap operativo de presuntamente

> **Estado vivo del proyecto.** Primer fichero al abrir; último al cerrar sesión.
>
> Roadmap conceptual: [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md). Histórico largo: [`docs/roadmap/`](docs/roadmap/README.md).

**Última actualización:** 2026-05-28 (lanzamiento real + primer ciclo de actualidad post-launch, PR1+PR2). Sitio publicado, tweet hecho, tráfico real. **Caso nuevo `leire-diez`** (7º publicable, `pin_destacado: 2`) con auto Pedraz 26-may, registro UCO Ferraz 27-may, imputaciones a la dirigencia PSOE; 16 vínculos institucionales (3 afectación + 13 cargos/nombramientos incluyendo BOE-A-2018-8601 RD 616/2018 nombramiento Fernández Guerrero SEPI descargado + nota FESOFI N3 Leire Correos). **PU actualizado** con hito aplazamiento 26-may, cascada `sintesis_caso` (estado_actual + hechos_clave) y `RelacionEntreCasos` con Leire por nexo SEPI/Fernández Guerrero (`pin_destacado: 1`). Override editorial `pin_destacado` añadido al schema + sort de PgInicio. Schema vínculos ampliado con enum `cargo_funcionarial_carrera` para cargos de carrera (caso Sánchez Yepes capitán UCO). Skill nueva [`/actualizar-caso`](.agents/skills/actualizar-caso/SKILL.md) v1 con guardarraíles (queries cruzadas obligatorias, sumarios bajo secreto no se modelan, agencias EFE no cuentan como línea propia, cascada exhaustiva sobre todo `caso.yaml`). 0 bloqueantes tras auditoría paralela `/revisar-caso` PU+Leire (10 sugerencias resueltas). `pnpm validate` 782 OK + build 223 páginas.

**Anterior (2026-05-27, auditoría prelaunch).** 6 sub-agentes Sonnet con `/revisar-caso` cerraron luz verde para tweet. Detalle: [`docs/roadmap/historial-2026-05.md`](docs/roadmap/historial-2026-05.md).

---

## Dónde está cada cosa

| Qué | Dónde |
|-----|-------|
| Histórico mayo 2026 | [`docs/roadmap/historial-2026-05.md`](docs/roadmap/historial-2026-05.md) |
| Fases cerradas | [`docs/roadmap/fases-cerradas.md`](docs/roadmap/fases-cerradas.md) |
| Aprendizajes largos | [`docs/roadmap/aprendizajes.md`](docs/roadmap/aprendizajes.md) |
| Diseño duradero | [`docs/diseno/`](docs/diseno/) |
| Reglas agentes | [`AGENTS.md`](AGENTS.md) |
| Backlog por página / feature | [`docs/web/pages/`](docs/web/pages/) · [`docs/web/features/`](docs/web/features/) |

---

## Estado actual

- **Fase activa:** **Post-launch temprano.** Fase 0, 1.0 y 1 cerradas; Fase 2 con **7 casos publicables** y 1 borrador (`atico-estepona`). Sitio público, tráfico real.
- **Casos publicables:** `plus-ultra` (pin#1), `leire-diez` (pin#2, nuevo), `begona-gomez`, `gonzalez-amador`, `fiscal-general-del-estado`, `kitchen`, `lezo`.
- **Pre-launch cerrado:** Bloques A, B, C, E.
- **Bloque D:** suficiente. Pendiente v1.x: composición de fuentes citadas, barra proporcional por corriente editorial, pills en §7 cobertura mediática.
- **Próximo paso:** archive.org para los N4 nuevos de PU+Leire (`pnpm archive:catchup`); seguimiento declaración Zapatero 17-18 jun; barrido `/actualizar-caso leire-diez` cuando aparezca nota CGPJ del auto Pedraz o auto íntegro en CENDOJ; pendientes anotados en NOTES Leire (Zarrías consejería Presidencia 1996-2008, BOE cese Fernández 2019, BORME apoderada Leire 2022).
- **Infra:** dominio y emails operativos; Cloudflare Pages servida en apex + `www`; deploy automático en `main`.
- **Dev:** `pnpm dev` → `http://localhost:4321`. **Git:** `main` directo; sin `git add`/`commit`/`push` salvo cierre explícito del maintainer ([`AGENTS.md`](AGENTS.md)).

---

## Contexto operativo imprescindible

- **Misión:** inventario trazable de casos de corrupción relevantes en España; reducir desinformación, no ganar una discusión política.
- **Riesgo principal ahora:** editorial/legal al abrir a periodistas y afectados, no técnico.
- **Prioridad:** barrido de actualidad + deploy controlado antes de revisores externos. Legal/postal queda como deuda temprana post-launch por decisión práctica del maintainer.
- **No hacer por inercia:** más casos por volumen; fotos reales sin consulta legal; inferir bandos desde vínculos; promover a `acreditado` sin primario sólido.
- **Canones por tarea:** modelo [`01`](docs/diseno/01-modelo-de-datos.md) + ficha [`02`](docs/diseno/02-ficha-de-caso.md); legal [`04`](docs/diseno/04-riesgos-legales-y-eticos.md); arquitectura [`05`](docs/diseno/05-arquitectura-tecnica.md); visual [`DESIGN.md`](DESIGN.md).
- **Cierre de cambios:** ficha en `docs/web/pages/` o `docs/web/features/`; aprendizaje largo → `docs/roadmap/`. Validación: `pnpm validate` + `pnpm build` si toca código/contenido.
- **Multiagente:** asumir sesión paralela; worktree si hay paralelismo; no stagear ni commitear salvo cierre explícito.

---

## Backlog inmediato

`[ ]` pendiente · `[x]` hecho. Detalle de ítems cerrados en fichas o histórico.

### Publicación del sitio

- [x] Dominio `presuntamente.org` y Email Routing (`contacto@`, `rectificacion@`, `aportar@`).
- [x] Cloudflare Pages conectado — [`cloudflare-pages-deploy.md`](docs/web/features/cloudflare-pages-deploy.md).
- [x] **URGENTE:** barrido de actualidad en 6 casos publicables. 9 hitos nuevos; NOTES.md actualizados. `pnpm validate` 711 OK + build limpio.
- [x] Auditoría editorial paralela `/revisar-caso` (6 sub-agentes Sonnet); 0 bloqueantes tras 5 fixes finos.
- [x] Activar DNS apex + `www` (Cloudflare).
- [x] Lanzamiento público: `git push origin main` + tweet + tráfico real (2026-05-28).
- [x] Primer ciclo de actualidad post-launch: PU actualizado + caso Leire arrancado publicable.
- [x] Override editorial `pin_destacado` (schema + PgInicio + doc en [`docs/web/pages/inicio.md`](docs/web/pages/inicio.md)).
- [x] Skill nueva [`/actualizar-caso`](.agents/skills/actualizar-caso/SKILL.md) v1.
- [ ] Revisión aviso legal con abogado — **post-launch temprano**.
- [ ] Apartado postal del responsable — **post-launch temprano**.
- [ ] Archive.org para N4 nuevos (`pnpm archive:catchup -- --caso=plus-ultra` y `--caso=leire-diez`).

### Camino al lanzamiento público

#### Bloque A — casos equilibrados `[x]`

Kitchen + Lezo (PP/derechas); primarios retrospectivos en 4 casos. Pendiente PR4+ cuando aparezcan primarios (Calama Plus Ultra, autos BG/GA, amparo TC FGE).

#### Bloque B — revisión LLM `[x]`

`revisar-caso` v1 + pasada 6 casos + BLOQUEANTES críticos resueltos. Opcional: triaje sugerencias no críticas pre-launch.

#### Bloque C — revisión humana pre-launch `[x]`

Cerrado 2026-05-27: auditoría 5 zonas + ejecución. Detalle: [`historial-2026-05.md § Bloque C`](docs/roadmap/historial-2026-05.md#bloque-c--revisión-editorial-humana-pre-launch-2026-05-27).

#### Bloque D — features de enganche

Cerradas (una línea cada una; detalle en ficha):

- [x] `/cifras` · OG images · RSS/Atom · timeline · estado de ficha · síntesis · vínculos institucionales · cobertura mediática general · clasificación editorial medios.
- [x] Mejoras listados · PartidoBadge · iconografía `badge--cat` · `<Aclaracion>` · refactor afectación directa/indirecta · explorador `/conexiones`.
- [x] Poblado CIS/grupos editoriales · skills masivas (`documentar-vinculos` v3, `rastrear-cobertura`, `revisar-caso`) · 26 esqueletos `pendiente` + órganos judiciales.

Pendiente v1.x (no bloquea launch blando):

- [ ] Barra proporcional corriente editorial — [`cobertura-mediatica-general.md`](docs/web/features/cobertura-mediatica-general.md)
- [ ] Composición fuentes citadas (UI) — [`composicion-fuentes-citadas.md`](docs/web/features/composicion-fuentes-citadas.md)
- [ ] Pills §7 cobertura mediática — [`filtros-pills-ficha-caso.md`](docs/web/features/filtros-pills-ficha-caso.md)
- [ ] Fotos reales + logos: pausa hasta criterio legal

#### Bloque E — higiene técnica `[x]`

[`higiene-tecnica.md`](docs/web/features/higiene-tecnica.md)

#### Bloque F — estrategia de lanzamiento

Plan detallado fuera de git. Pre-requisitos: deploy + dominio → lanzamiento blando → 48-72h → lanzamiento real → outreach periodistas.

---

## Fase 2 y casos

| Caso | Estado | Pendiente principal |
|------|--------|---------------------|
| Plus Ultra | publicable · pin#1 | declaración Zapatero 17-18 jun; auto Calama íntegro en CENDOJ; ampliación CNI/Venezuela cuando aparezca auto |
| Leire Díez | publicable · pin#2 (nuevo 28-may) | nota CGPJ del auto Pedraz; auto JI 9 con número; vínculos institucionales formales (PSOE/SEPI); Carmen Pano si adquiere rol formal |
| Begoña Gómez | publicable | UCO prevaricación Cantó (1 fuente, V-13 pendiente); audiencia previa 9-jun |
| González Amador | publicable | informe UCO Quirón (+300 días) |
| FGE | publicable | amparo TC admisibilidad; indulto parcial pendiente CM |
| Kitchen | publicable | sentencia otoño 2026 |
| Lezo | publicable | sentencia Inassa (en curso); pieza golf sep 2027 |
| ático-estepona | borrador | — |
| Koldo/Cerdán | — | Cerdán ya catalogado como persona desde Leire; pendiente arrancar caso formal cuando decida el maintainer |

---

## Trabajo paralelizable

- [x] **Barrido actualidad prelaunch** — 9 hitos incorporados; NOTES.md 6 casos actualizados.
- Caliente: no tocar en paralelo `schemas/caso.schema.json`, `content/casos/*/caso.yaml`, `global.css`.

Resto Bloque D paralelizable: **cerrado** (vínculos, `/conexiones`, cobertura, clasificación medios). Ver [`historial-2026-05.md § 2026-05-26`](docs/roadmap/historial-2026-05.md#cierre-del-sprint-extendido-tarde-noche).

---

## Decisiones pendientes del maintainer

- [ ] Posible `Organizacion.afiliacion_politica` (declarada + percibida) — sin decisión.
- [ ] Criterio legal antes de fotos reales o logos con licencia.
- [ ] Confirmar estrategia de lanzamiento tras activar DNS: revisores externos, espera 48-72h, anuncio público.
- Cerradas (referencia): clasificación editorial medios · vista instituciones · taxonomía afectación — [`08-afectacion-directa-indirecta.md`](docs/diseno/08-afectacion-directa-indirecta.md).

---

## Aprendizajes activos

Sólo lo que afecta sesiones inmediatas. Resto: [`aprendizajes.md`](docs/roadmap/aprendizajes.md).

- **Roadmap acotado** (~150-220 líneas); cierre de sesión ≤3 bullets o 120 palabras; una «Última» + como mucho una «Anterior».
- **Sin signo de sección** ni glyphs decorativos — [`AGENTS.md`](AGENTS.md).
- **Afectación ≠ papel procesal** — acusación popular no es afectación; canon [`08-afectacion`](docs/diseno/08-afectacion-directa-indirecta.md) + [`afectacion-directa-indirecta.md`](docs/web/features/afectacion-directa-indirecta.md).
- **Estado de ficha ≠ estado judicial** — completitud editorial, no culpabilidad.
- **Vínculos ≠ ideología** — cargos formales documentados, no bandos inferidos.
- **Subagentes:** validar CWD/worktree antes de escribir; no `git add`/`commit` en sesión.
- **Pagefind:** requiere build; `/buscar` en preview/producción.
- **Path = schema = nav** cuando el copy visible sea X; prosa descriptiva (H1, CTA) puede divergir.
- **Delegación barata:** contrato cerrado + lectura crítica al volver — [`AGENTS.md`](AGENTS.md).
- **Portales oficiales:** catálogo incremental [`docs/fuentes/`](docs/fuentes/README.md) (CGPJ histórico pre-2024, CENDOJ, BOE fechas).
- **Fichas `docs/web/` descargan el roadmap** — ideas futuras allí, no aquí.

---

## Cómo se mantiene este documento

1. Leer entero al abrir; enlazar a `docs/roadmap/` si hace falta histórico.
2. Al cerrar: actualizar este fichero (breve), ficha `docs/web/` si aplica, `historial-YYYY-MM.md` si el cierre es largo.
3. No duplicar `docs/diseno/` ni convertir esto en diario completo.
