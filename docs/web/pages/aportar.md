# Página /aportar

> Componente: `src/components/pages/PgAportar.astro` · Wrapper: `src/pages/aportar.astro`

## Estado actual

**Implementada el 25 de mayo de 2026.** Cauce editorial activo bajo el mismo dominio que `/rectificar` pero con identidad propia y separación visible.

Decisión editorial canónica en [doc 04 — "Mecanismo de aportación editorial"](../../diseno/04-riesgos-legales-y-eticos.md#6bis-mecanismo-de-aportación-editorial). Feature transversal completa documentada en [`docs/web/features/aporte-editorial.md`](../features/aporte-editorial.md).

Distinción explícita en cabecera y en la última sección de la página:

- **`/rectificar`**: para quien se considere aludido por una afirmación y discrepe. Cauce defensivo, plazos LO 2/1984 (48 h acuse, 7 días resolución) — ver [doc 04 — "Mecanismo de rectificación"](../../diseno/04-riesgos-legales-y-eticos.md#6-mecanismo-de-rectificación).
- **`/aportar`**: para terceros con conocimiento que quieran ampliar o corregir el inventario. Cauce proactivo, sin marco legal específico, plazos comprometidos por respeto (5 días acuse, 30 días resolución).

Las dos páginas enlazan entre sí cuando el visitante llega a la puerta equivocada (sección 6 "Otra puerta: rectificación" cierra `PgAportar.astro` con CTA hacia `/rectificar`).

Estructura final de la página (`PgAportar.astro`, siete secciones numeradas con `FichaTocSection`):

1. **Qué puedes aportar** — lead con «sin fuente no hay afirmación» + enlace a `/sobre#principios`; tres tarjetas en `.carriles` (pista a fuente o hito · corrección fáctica menor · idea o sugerencia), cada una con bloque "Qué pedimos" diferenciado. Sub del hero enumera perfiles (periodista, jurista, funcionario, legislador, desarrollador, pista fiable).
2. **Vías habilitadas** — tres tarjetas en `.vias` con badge `recomendado` en el email (idéntico patrón al de `/rectificar`):
   - Correo electrónico `aportar@presuntamente.org` (operativo desde 2026-05-25 vía Cloudflare Email Routing) con CTA `mailto:` que pre-rellena asunto.
   - Issue público en GitHub con template `sugerencia-fuente.yml`.
   - Vía postal (pendiente del apartado de correos del responsable).
3. **Plazos comprometidos** — tabla `.tbl` con tres filas: acuse 5 días hábiles · resolución 30 días hábiles · respuesta motivada si no procede 30 días hábiles. Sin urgencia legal LO 2/1984.
4. **Qué no aceptamos depositar** — prosa con lista `.no-list`: secreto de sumario (art. 301 LECrim), escritos de parte no notificados (art. 234 LOPJ), info personal de terceros no investigados, mirrors no auditables, doxxing. Mención del caso excepcional N3 `filtrado_verificado` con triangulación.
5. **Privacidad y acreditación** — explicación del default anónimo + opt-in con trailer `Aporte-externo:` (mostrado en bloque `.trailer` con monoespaciada). Tratamiento RGPD art. 6.1.f.
6. **Otra puerta: rectificación** — bloque corto que diferencia y enlaza a `/rectificar`.
7. **Código abierto** — AGPL, CC BY-SA, enlace a CONTRIBUTING.md y GitHub (colaboración técnica; PRs previstos).

Cierre con `Aclaracion` recordando que el procedimiento es el mismo independientemente del cargo del aportante, prioridad por orden de entrada + fuente firme.

**`/sobre#colaborar`** (2026-05-27) sólo enlaza aquí; no duplica carriles ni plazos.

Visibilidad de la página fuera de su URL:

- **Header**: botón CTA "Aportar" en mostaza claro institucional, visible en todas las páginas (`BaseLayout.astro` → `.site-aportar`).
- **Panel móvil hamburguesa**: entrada `Aportar al inventario` al inicio del panel, antes del selector de idioma (`.site-menu-panel__aportar`).
- **Footer**: columna "Aportar y rectificar" (renombrada de la antigua "Rectificación") con CTA a `/aportar` como primer link.
- **Aviso legal**: apartado "Mecanismo de aportación editorial" con cross-link a `/aportar`.

## Ideas futuras

### v1.x — comprometido

- **CTA dual "Rectificar · Aportar" en la sección "Cómo se ha redactado esta ficha" de la ficha de caso** — pendiente, va en sesión siguiente.
- **Módulo institucional en el hero de la home** invitando al aporte — pendiente como refuerzo del CTA del header. Decisión visual aún por cerrar.

### Sin compromiso

- **Formulario integrado** que vuelque a la bandeja interna sin necesidad de que el aportante abra su cliente de correo. Requiere Cloudflare Worker + Turnstile/hCaptcha. Trade-off: el formulario tiene mayor tasa de conversión que el email (Aportar es un acto que la gente puede aplazar si requiere abrir Gmail/Proton) pero introduce infra que no tenemos hoy y oscurece la traza del aporte.
- **Bloque "Aportes recientes incorporados"** mostrando los últimos commits con trailer `Aporte-externo:` (los que el aportante autorizó acreditar). Refuerza la transparencia y reconoce el feedback loop. Riesgo: si la mayoría de aportantes prefieren anonimato (probable), el bloque queda casi vacío y comunica falta de tracción incluso cuando hay actividad.
- **Versión catalana `/cat/aportar`** cuando se active el catalán en el sitio.
- **Card OG específica** para que cuando se comparta el link del aviso de aportar, el preview comunique el cauce.
- **Sección "Ejemplos de aportes incorporados recientemente"** con cita literal de pista + commit derivado, una vez haya histórico suficiente. Útil para que el aportante potencial vea qué resultado real tuvo un aporte previo.

## Aprendizajes y decisiones editoriales

- **Misma plantilla visual que `/rectificar`**, distinto tono editorial. La estructura de tarjetas `.carriles` y `.vias` reusa los patrones de `/rectificar` (.vias, badge `recomendado`) para coherencia visual con el resto del sitio gov-retro, pero el copy y la jerarquía narrativa son propios: aporte arranca con "qué puedes aportar" (tres carriles), mientras que rectificar arranca con "vías habilitadas" (cauce ya conocido por el solicitante). El visitante de aportar puede no saber que se le aceptan correcciones fácticas; el de rectificar ya viene con su pieza concreta.
- **El CTA principal es `mailto:` con asunto pre-rellenado.** Reduce la fricción para el aportante: un click abre el cliente de correo con `Subject: Aporte al inventario`. Quien prefiera issue público GitHub, segunda tarjeta. Quien prefiera postal, tercera tarjeta (sin operativa todavía).
- **Sección 4 "Qué no aceptamos" explícita y honesta.** Mejor decirlo claro y temprano que confundir al aportante con material restringido que no podemos publicar. Cita arts. 301 LECrim y 234 LOPJ por concreción legal; menciona [AGENTS.md → "Documentos primarios descargados"](../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) para el caso excepcional N3 `filtrado_verificado` (sentencia TS antes de CENDOJ etc.).
- **Sección 5 muestra el trailer convencional en bloque monoespaciado.** Hace tangible el contrato: el aportante ve literalmente cómo aparecería su autoría en el commit (si la solicita). El bloque también deja claro que la dirección de email NUNCA aparece, sólo lo que autorice por escrito.
- **Sección 6 cross-link a `/rectificar`** evita que un aludido legítimo aterrice en la página equivocada. Sin esta sección la página podría comunicar "no hay otra puerta" y eso es falso.

## Pendientes operativos

- [x] Crear `src/pages/aportar.astro` (wrapper mínimo) + `src/components/pages/PgAportar.astro` (lógica).
- [x] Diseñar visualmente alineado con `/rectificar` pero con identidad editorial propia (mostaza institucional para el CTA Aportar vs granate del de rectificar — patrón ya aplicado en header `.site-aportar` y replicable en la sección 2.11 de ficha de caso).
- [x] Copy completo de las tres tarjetas de carril, con ejemplos concretos en cada una (qué clase de pista esperamos).
- [x] Cross-link desde la página `/aportar` hacia `/rectificar` (sección 6 "Otra puerta").
- [x] Cross-link recíproco desde `/rectificar` hacia `/aportar` (sección 5 «Otra puerta: aportación editorial»). **Entregado 2026-05-27.**
- [ ] Decidir si el slug en CA es `/cat/aportar` (alineado con `/aportar`) o `/cat/contribuir` (más natural en catalán) — coordinar con i18n cuando se active el catalán.
- [ ] Cuando llegue el primer aporte real, anotar aquí qué falta de copy / qué dudas levantó / qué cambió tras la primera respuesta enviada.
