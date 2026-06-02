# Roadmap operativo de presuntamente

> **Estado vivo del proyecto.** Primer fichero al abrir; último al cerrar sesión.
>
> Roadmap conceptual: [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md). Histórico largo: [`docs/roadmap/`](docs/roadmap/README.md).

**Última actualización:** 2026-06-02 (**fugas de comentarios internos — CERRADAS**). Barrido repo-wide de comentarios `#` atrapados en bloques de texto YAML (`|` y `>`) que se renderizaban en casos publicados: **51 líneas internas en 18 ficheros reubicadas a `NOTES.md`** (citando origen), prosa-meta reescrita, y regla **`V-26`** nueva en `validate.mjs` (lee el source crudo del bloque, cubre `|` y `>`) + norma en `AGENTS.md` como guardarraíl durable. `grep dist/` de marcadores = 0; `validate` 1359 OK; build limpio. Detalle en "Fugas de comentarios internos" abajo. **Commiteado en este cierre; `git push` pendiente** (lo decide el maintainer). Follow-up editorial abierto: humanizar la notación `filtrado_verificado` (visible 4× en `leire-diez`/buscador).

**Anterior (2026-05-31 / 05-30).** Sistema de promoción de estados probado a fondo ([`/promover-caso`](.agents/skills/promover-caso/SKILL.md), panel de 3 Sonnet ciegos + autorización del maintainer); `gurtel`→`beta_publica`; lote noos/malaya/palau/tarjetas-black saneado (`noos` VERDE). Antes, tanda masiva: 12 casos nuevos + 8 actualizados (+75 personas, +34 orgs, +105 docs…), commiteada en `093e9ce`. **`main` por delante de `origin` — `git push` pendiente** (lo decide el maintainer). Detalle: [`historial-2026-05.md`](docs/roadmap/historial-2026-05.md).

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

- **Fase activa:** **Post-launch temprano.** Fase 0, 1.0 y 1 cerradas; Fase 2 con **20 casos con contenido modelado** (7 publicables + `gurtel` recién subido a beta + 12 en borrador). Sitio público, tráfico real.
- **Casos públicos (beta+):** `plus-ultra` (pin#1), `leire-diez` (pin#2), `begona-gomez`, `gonzalez-amador`, `fiscal-general-del-estado`, `kitchen`, `lezo`, **`gurtel`** (subido 2026-05-31 vía `/promover-caso`).
- **Casos en borrador:** `punica`, `pujol`, `eres-andalucia`, `noos` (VERDE, pendiente barrido comentarios), `malaya`, `tarjetas-black`, `barcenas-caja-b`, `filesa`, `tandem`, `palau-musica`, `forum-filatelico`, `atico-estepona`.
- **Sistema de transición de estados — construido y probado:** skill [`/promover-caso`](.agents/skills/promover-caso/SKILL.md) (panel de 3 Sonnet ciegos + autorización del maintainer) + campo cola `promocion_propuesta` en `caso.yaml` + bloque "Proponer promoción" en las 5 skills de contenido. Rubro Puertas A/B/C, v0.1. La cola (`--cola`) escala a 500 casos sin reescanear todo.
- **Pre-launch cerrado:** Bloques A, B, C, E. **Bloque D:** suficiente (v1.x menor pendiente).
- **Próximo paso:** **(1)** re-panel de confirmación de `malaya`/`palau-musica`/`tarjetas-black` (ya saneados) → subir a beta los VERDE; promover `noos`. **(2)** panel sobre los 8 borradores restantes. **(3)** `git push` (lo decide el maintainer); roles `pujol`; `archive:catchup`; Zapatero 17-18 jun. _(Fugas de comentarios internos: **cerrado 2026-06-02** — ver sección abajo.)_
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

- [x] `/cifras` · `/graficas` (+ sistema de charts SVG/build) · OG images · RSS/Atom · timeline · estado de ficha · síntesis · vínculos institucionales · cobertura mediática general · clasificación editorial medios.
- [x] Mejoras listados · PartidoBadge · iconografía `badge--cat` · `<Aclaracion>` · refactor afectación directa/indirecta · explorador `/conexiones`.
- [x] Poblado CIS/grupos editoriales · skills masivas (`documentar-vinculos` v3, `rastrear-cobertura`, `revisar-caso`) · 26 esqueletos `pendiente` + órganos judiciales.
- [x] Modo claro/oscuro con toggle (cuerda de lámpara) — [`dark-mode.md`](docs/web/features/dark-mode.md).

Pendiente v1.x (no bloquea launch blando):

- [ ] Barra proporcional corriente editorial — [`cobertura-mediatica-general.md`](docs/web/features/cobertura-mediatica-general.md)
- [ ] Composición fuentes citadas (UI) — [`composicion-fuentes-citadas.md`](docs/web/features/composicion-fuentes-citadas.md)
- [ ] Pills §7 cobertura mediática — [`filtros-pills-ficha-caso.md`](docs/web/features/filtros-pills-ficha-caso.md)
- [~] **Importe presuntamente atribuido** — modelo + backfill (17 Hechos) **+ UI completa** (2026-05-29): ficha (dos tablas: dinero en juego / consecuencias), `/graficas` (2.ª sección, por clase × toggle nominal/€2025 + drill-down + CSV/JSON), preview en `/casos`. **`importe_clase`** (objeto/consecuencia, nunca sumadas) + **toggle inflación** (IPC INE). **Pendiente:** titular home (copy firmado), vista por persona/org (atribución por sujeto), comparativas externas (neutralidad), refinar enums por clase. Ficha [`importe-presunto.md`](docs/web/features/importe-presunto.md).
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
| Gürtel | **beta_publica (2026-05-31)** | subido vía `/promover-caso` (panel 3/3 VERDE, autorizado); pieza visita del Papa pendiente de pena individual; decidir "Gürtel" nombre propio (P-09) |
| Púnica | borrador (2026-05-30) | crear docs N1 sentencias filtración 2017/2019; auto apertura juicio pieza 8 (hoy N4) |
| Pujol | borrador (2026-05-30) | **actualizado**: juicio nov-2025/may-2026 + sobreseimiento Pujol Soley + visto para sentencia modelados; doc huérfano eliminado. Falta: roles 7 hijos `investigado`→`acusado` y Pujol Soley→`desimputado` (rev. humana) |
| ERE Andalucía | borrador (2026-05-30) | **0 promovidos a propósito** (TC anuló/matizó condenas 2024; firmeza no limpia); piezas específicas; ponente TS; PDF íntegro CENDOJ |
| Nóos | borrador (2026-05-30) | 3 hechos firmes promovidos a `acreditado` (STS 277/2018); 8 absueltos sin rol; vínculos institucionales |
| Malaya | borrador (2026-05-30) | 2 hechos firmes promovidos a `acreditado` (CGPJ TS 2015); importe 12M€ era Wikipedia (neutralizado); PDF íntegro CENDOJ pendiente |
| Tarjetas black | borrador (2026-05-30) | 2 hechos firmes promovidos a `acreditado` (STS 2018 + extinción Blesa); ~63 acusados restantes; cifras por sujeto; equilibrio afectación |
| Bárcenas caja B | borrador (2026-05-30) | 4 hechos firmes promovidos a `acreditado` (AN 2021 + STS 2024); 3 hitos sin doc principal |
| Filesa | borrador (2026-05-30) | 2 hechos firmes promovidos a `acreditado` (5 STC del BOE + 3 indultos BOE); STS 1/1997 íntegra no está en CENDOJ; vínculos institucionales |
| Tándem | borrador (2026-05-30) | **0 promovidos a propósito** (Salamanca firme pero pendiente verificar casación; Villarejo NO firme); privados sin rol (Muñoz Támara, García Cereceda) → anonimizar o ficha+rol |
| Palau Música | borrador (2026-05-30) | 2 hechos firmes promovidos a `acreditado` (STS 813/2020); doc principal de la querella 2009; vínculos institucionales |
| Fórum Filatélico | borrador (2026-05-30) | docs N1/N2 de hitos; `forum-filatelico-sa` mal como perjudicado en importe |
| ático-estepona | borrador | **Cavero anonimizada** (V-17, caso archivado); vínculos institucionales pendientes |
| Koldo/Cerdán | — | Cerdán ya catalogado como persona desde Leire; pendiente arrancar caso formal cuando decida el maintainer |

### Estado de los bloqueantes de la auditoría (tanda 2026-05-30)

**Mecánicos y editoriales — RESUELTOS** (dos pasadas Sonnet): bios "no modelado" desactualizadas, `trama` sin comillas P-09 (gürtel/malaya/filesa/púnica + vínculo servinabar), fechas rol `condenado_firme` ERE, `querellante_inicial_id` Bárcenas, ref rota noos, tildes kitchen, alta `el-confidencial-digital`, `pujol` actualizado + doc huérfano eliminado, `Lourdes Cavero` anonimizada, PSOE reclasificado a afectación **indirecta** (`psoe-afectacion-indirecta-leire-diez`), **18 hechos firmes promovidos a `acreditado`** con cita N1 verificada (gürtel 3, noos 3, bárcenas 4, malaya 2, tarjetas-black 2, palau 2, filesa 2).

**Pendiente de decisión/acción del maintainer** (no bloquea publicar; cada caso lo detalla en su `NOTES.md`):

1. **Roles procesales de `pujol`**: 7 hijos `investigado`→`acusado` y Pujol Soley→`desimputado` (cambian badge; toca presunción → decisión humana).
2. **Excepción de nombre propio "Gürtel"/"Púnica"/"Malaya"**: hoy sustituidos en prosa; decidir si se documenta excepción en [`AGENTS.md`](AGENTS.md) o se mantiene. Viven en `nombres_alternativos`.
3. **Promociones a `acreditado` no hechas a propósito**: ERE (TC matizó la firmeza 2024) y tándem (Salamanca sin confirmar casación; Villarejo no firme). Revisar cuando haya certeza de firmeza.
4. **Posible 7.ª regla de afectación** (doc 08) para "partido cuya caja es objeto de investigación" (caso PSOE/leire-diez) — decisión de modelo, no urgente.
5. **PDFs íntegros / `pendiente_primario`**: varias sentencias firmes respaldadas por nota CGPJ N1 pero sin PDF en CENDOJ (descarga con `ruta_local`+hash cuando aparezcan). `archive:catchup` de los N4 nuevos (requiere red).

### Saneamiento del lote noos/malaya/palau/tarjetas (2026-05-31, vía `/promover-caso`)

Tres pasadas del panel sobre estos 4 casos. Bugs reales cazados y **arreglados**: cifras solo-prensa/Wikipedia presentadas como firmes (malaya: 232 M€ y 12 M€ retiradas del modelo estructurado), violación **V-19** (palau: `nivel_fuente_efectivo` vs docs listados), **fechas erróneas** (tarjetas: ficha persona Blesa + roles Rato/Blesa), texto placeholder y comentarios incrustados en campos públicos. **`noos` = VERDE** (pendiente solo del barrido de comentarios); los otros 3 saneados, **pendientes de re-panel de confirmación** antes de subir a beta. Aprendizaje: los arreglos deben ser **exhaustivos por caso** (grep de TODOS los ficheros — fichas de persona, cobertura, hitos, roles, citas — no solo el que cita el panel); el residuo de la tanda vive disperso. Rubro afinado a **v0.1** (A3 y A5) y registrado en el `## Histórico` de la skill.

### Fugas de comentarios internos en el sitio público — CERRADO (2026-06-02)

**Resuelto.** Causa: en YAML, un `#` dentro de un bloque escalar (`|` literal o `>` folded) o al inicio de un valor citado es **texto literal, no comentario** → se renderiza. Barrido repo-wide con escáner AST (paquete `yaml`), dos pasadas (la 2.ª destapó un tercer vector):

- **51 líneas `#` internas en 18 ficheros**: las puramente internas (verificaciones pendientes, correcciones) **reubicadas a la `NOTES.md` del caso correspondiente** (hogar canónico, excluido del build) citando el fichero de origen; las notas metodológicas de cobertura quedaron como valor de campo limpio (sin marcador). YAML limpio. Incluye **4 en bloques folded `>`** (bankia, caja-madrid, cobertura tarjetas-black) que la 1.ª pasada no vio: en `>` los `\n` se pliegan a espacios y el `#` queda a mitad de frase.
- **Prosa-meta reescrita** en `estado_ficha.notas` (gonzalez-amador, eres-andalucia), rol abogacía, `notas` de cobertura y 4 `nivel_fuente_justificacion`: fuera `pendiente de localizar`, `LLM-incierto`, ruta `/public/...` y jerga `PR posterior` (también en `lezo`, publicado).
- **Guardarraíl durable:** regla **`V-26`** en [`scripts/validate.mjs`](scripts/validate.mjs) — falla si un valor escalar tiene una línea que (tras *trim*) empieza por `#`; cubre `|` **y** `>` leyendo el **source crudo** del bloque (no el valor parseado). Documentada en [doc 01 — "Validaciones lógicas"](docs/diseno/01-modelo-de-datos.md#4-validaciones-lógicas-resumen-consolidado); norma de comportamiento en [`AGENTS.md`](AGENTS.md) ("NOTES.md por caso").
- **Verificación:** `grep` de las 3 frases en `dist/` = **0**; `#`-comentarios renderizados = **0**; `pnpm validate` 1359 OK; build limpio. **Sin commitear** (working tree). (El aviso original sobre `plus-ultra` era falso positivo: su marcador vivía en `NOTES.md`.)

**Follow-up surfaceado (decisión EDITORIAL, no bug):** queda visible la notación deliberada **`filtrado_verificado`** (4× en `dist/`: cita "(N3 filtrado_verificado)" en los `pasaje` de hechos de `leire-diez` publicado + índice `/buscar`-`/conexiones`). **`pendiente_primario` ya NO se renderiza** (su única aparición pública era el comentario filtrado de bankia/caja-madrid, ya corregido; la notación en prosa de documentos no llega a página publicada). Decidir si se humaniza el copy de `filtrado_verificado`; es estilo editorial, no se toca sin criterio del maintainer.

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
- [ ] **Regla de granularidad de `VinculoInstitucional` cuando coexisten dos figuras formales en la misma relación persona↔organización.** Propuesta: un vínculo por cada figura formal con acto de creación, extinción y consecuencias jurídico-administrativas propias, aunque persona y organización sean las mismas y las fechas se solapen; la asimetría de fuente (interna vs publicación oficial) no las colapsa. Precedentes ya en el repo: Zarrías Consejero Presidencia + Vicepresidente Junta solapados 2008-2009; Leire Directora Filatelia interna + Apoderada Mercantil BORME (2026-05-28). Si se acepta, formalizar en [`01-modelo-de-datos.md`](docs/diseno/01-modelo-de-datos.md) sección `VinculoInstitucional`. Decisión separada sobre extender el enum `naturaleza` con `apoderamiento_mercantil` / `representacion_societaria` cuando aparezcan 2-3 casos análogos más (hoy se reutiliza `cargo_directivo_empresa_publica` con `cargo_o_rol` libre).
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
- **Scouting ≠ fuente citable:** agregadores secundarios (casos-aislados.com) sólo para descubrir candidatos — [`agregadores-y-descubrimiento.md`](docs/fuentes/agregadores-y-descubrimiento.md). Backlog de 554 candidatos en [`casos-aislados-candidatos.md`](docs/fuentes/casos-aislados-candidatos.md); promover de uno en uno, no en masa (profundidad > volumen).
- **Plan abierto (sin arrancar):** escala `/conexiones` antes de ~50 casos (detalle técnico para handoff en [`explorador-conexiones.md`](docs/web/features/explorador-conexiones.md) — "Escala del inventario completo") · profundizar la shortlist de casos (Gürtel…).

---

## Cómo se mantiene este documento

1. Leer entero al abrir; enlazar a `docs/roadmap/` si hace falta histórico.
2. Al cerrar: actualizar este fichero (breve), ficha `docs/web/` si aplica, `historial-YYYY-MM.md` si el cierre es largo.
3. No duplicar `docs/diseno/` ni convertir esto en diario completo.
