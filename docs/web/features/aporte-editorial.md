# Aportación editorial externa

> Archivos clave: `docs/diseno/04-riesgos-legales-y-eticos.md` §6bis (marco editorial-legal canónico) · `docs/diseno/03-estrategia-de-mantenimiento.md` §1-§2 (señal humana en pipeline) · `src/components/pages/PgAportar.astro` + `src/pages/aportar.astro` (página `/aportar`) · `src/layouts/BaseLayout.astro` (CTA "Aportar" en header + dropdown de idioma + link en footer + entrada en panel móvil) · `src/styles/global.css` (estilos `.site-aportar`, `.site-lang-wrap`, `.site-lang-btn`, `.site-lang-panel`, `.site-menu-panel__aportar`) · `.github/ISSUE_TEMPLATE/sugerencia-fuente.yml` (cauce GitHub interno) · `content/aportes/YYYY-MM-DD-<slug>.md` (bandeja de aportes, se creará al recibir el primero) · `.agents/skills/incorporar-aporte/` (skill placeholder hasta primer aporte real)

## Qué hace

Abre un canal editorial para que terceros con conocimiento útil del caso (periodistas, juristas, funcionarios, académicos, ciudadanos informados) aporten al inventario sin necesidad de saber git ni exponerse en un issue público, separando claramente este cauce del de rectificación legal LO 2/1984.

## Para qué sirve

**Audiencia objetivo**: gente con mejor acceso a fuentes o mejor conocimiento que el agente LLM que construye el inventario. En particular: periodistas con fuentes que prefieren no quemar, funcionarios con acceso a documentación procesal antes que el público, juristas con interpretación técnica de autos, académicos con análisis comparado, ciudadanos con testimonio local relevante.

**Caso de uso**: tres carriles bajo una sola puerta editorial. (1) Aportante señala una sentencia / auto / BOE / informe institucional / cobertura cruzada que el inventario no recoge. (2) Aportante detecta un error fáctico menor (errata, fecha, órgano, segundo apellido, link roto) que no es rectificación legal porque no hay aludido defendiéndose. (3) Aportante propone una idea sobre el sitio (feature, mejora UX, observación editorial).

Cierra un riesgo asumido por el modelo de mantenimiento, recogido en `AGENTS.md` §"División de trabajo: maintainer ↔ agente": el maintainer no es periodista ni jurista, delega la investigación íntegramente en LLM, lo que da escala y trazabilidad pero pierde la red de fuentes humanas que tendría un medio tradicional. Este canal abre formalmente esa red.

## Cómo funciona

Pipeline de cinco pasos coherente con `doc 03 §1-§2` (señales) y `AGENTS.md` §"División de trabajo":

1. **Recepción**: email entrante en `aportar@presuntamente.org` (Cloudflare Email Routing, alias del Proton del maintainer; mismo mecanismo que `contacto@` y `rectificacion@`). Operativo desde el 25 de mayo de 2026.
2. **Volcado** (maintainer, manual): contenido editorial del email a `content/aportes/YYYY-MM-DD-<slug>.md`, sin headers identificativos del aportante salvo opt-in expreso. Fichero excluido del build público, mismo tratamiento que `content/casos/<slug>/NOTES.md`.
3. **Clasificación y procesado** (agente, con skill `/incorporar-aporte` placeholder en `.agents/skills/` hasta primer aporte real): leer el fichero, clasificar en uno de los tres carriles, aplicar el flujo correspondiente.
   - Pista a fuente o hito → investigación con `/investigar-caso` y guardarraíles + modelado `Documento` + `Hito` + `Hecho` + diff propuesto.
   - Corrección fáctica → verificación contra fuente pública + diff puntual.
   - Idea → archivo razonado en `docs/web/pages/<página>.md` o `docs/web/features/<feature>.md`, sin diff sobre `content/`.
4. **Revisión y commit** (maintainer, workflow normal de `AGENTS.md` §"Workflow de rama y PRs"). Trailer convencional `Aporte-externo: <nombre o medio>` si el aportante autorizó acreditación; default anónimo.
5. **Respuesta al aportante** (maintainer, borrador preparado por la skill): qué se incorporó, qué no y por qué, link al commit. Cierra el bucle editorial.

**Cauces de entrada al pipeline**:

- Email `aportar@presuntamente.org` — puerta principal, operativa.
- Issue GitHub con template `sugerencia-fuente.yml` — cauce técnico interno, no publicitado en el sitio (la barrera de cuenta GitHub + exposición pública es hostil al perfil objetivo).
- Correo postal al apartado del responsable — alternativa formal cuando esté operativo el apartado (en curso por la gestión LSSI del maintainer).

**Visibilidad en el sitio** (todo activo):

- Página `/aportar` (`PgAportar.astro`) hermana de `/rectificar`, con seis secciones (qué puedes aportar · vías habilitadas · plazos comprometidos · qué no aceptamos · privacidad y acreditación · puerta a /rectificar).
- **Botón CTA "Aportar" en el header**, mostaza claro institucional, visible siempre (compactado en mobile, con icono en desktop). Va a la derecha del selector de idioma (que se ha convertido en dropdown desplegable `.site-lang-wrap` + `.site-lang-btn` + `.site-lang-panel`, sustituyendo al par horizontal ES | CAT anterior). Decisión del maintainer del 2026-05-25: "un boton diferenciador de aportar en el header navbar".
- Link permanente en el footer en la columna "Aportar y rectificar" (renombrada de la antigua "Rectificación") junto al CTA de rectificar.
- Entrada `site-menu-panel__aportar` al inicio del panel móvil hamburguesa: CTA mostaza visible en cuanto se abre el menú, antes del selector de idioma.
- Mención en aviso legal §5bis "Aportación editorial" + §6 "Responsable" (tres canales mencionados en lugar de dos).

**Pendiente**: módulo institucional en el hero de la home (`PgInicio.astro`) y CTA dual "Rectificar | Aportar" en la §2.11 "Cómo se ha redactado esta ficha" de la ficha de caso (`PgCasoDetalle.astro`). Ambos quedan como pendientes operativos abajo.

## Estado actual

**Implementado** (commits encadenados en main):

- Marco editorial-legal completo en `docs/diseno/04-riesgos-legales-y-eticos.md` §6bis (acuse 5 días hábiles, resolución 30 días, RGPD art. 6.1.f, default anónimo + opt-in con trailer convencional, qué se acepta y qué no, caso excepcional N3 `filtrado_verificado`).
- Reconocido como segunda fuente de señales en `docs/diseno/03-estrategia-de-mantenimiento.md` §1-§2 (junto a los watchers automáticos previstos en Fase 3).
- Mencionado en `AGENTS.md` §"Skills locales" como skill `incorporar-aporte`.
- Propagación a `README.md` §"Estado" y §"Contribuir", `CONTRIBUTING.md` (sección "Aportar fuentes, correcciones o ideas") y `LEGAL.md` (bullet en "Resumen mínimo" + entrada en "Detalle completo").
- Mención en aviso legal §5bis "Aportación editorial" y §6 "Responsable".
- **Activación de `aportar@presuntamente.org`** en Cloudflare Email Routing (2026-05-25, maintainer).
- **Página `/aportar`** (`PgAportar.astro` + wrapper `aportar.astro`) con las seis secciones del cauce editorial.
- **Botón CTA "Aportar" en el header** del `BaseLayout.astro` (clase `.site-aportar`, mostaza claro institucional sobre el navy del header).
- **Refactor del selector de idioma** a dropdown desplegable (`.site-lang-wrap` + `.site-lang-btn` + `.site-lang-panel`), reusando el contrato de aria-controls/data-open del hamburguesa para compartir el listener global de menú (un solo trigger abierto a la vez, click-fuera cierra, ESC cierra, navigation cierra).
- **Link a `/aportar` en el footer** dentro de la columna renombrada "Aportar y rectificar".
- **Entrada CTA mostaza en el panel móvil** (`.site-menu-panel__aportar`) al inicio, antes del selector de idioma.

**Pendiente** (siguiente bloque de UI):

- Módulo institucional en el hero de la home (`PgInicio.astro`) invitando explícitamente al aporte. Coherente con el tono honesto del aviso legal §4. Diseño visual del módulo aún por definir, debe encajar con el gov-retro de `DESIGN.md` sin convertirse en banner ruidoso.
- CTA dual "Rectificar · Aportar" en la §2.11 "Cómo se ha redactado esta ficha" de cada caso (`PgCasoDetalle.astro`).
- Skill `/incorporar-aporte` real (placeholder hasta que llegue el primer aporte; la skill se moldea con la experiencia, ver `AGENTS.md` §"Skills locales").
- Directorio `content/aportes/` (se crea al recibir el primer aporte; no se versiona vacío).

## Decisiones editoriales y aprendizajes

- **El cauce de aportación NO es el de rectificación.** Históricamente el repo confundía sugerir fuente con rectificar — había `sugerencia-fuente.yml` enterrado en GitHub Issues y `rectificacion@` formal, sin un cauce intermedio. La diferenciación es: rectificación es defensiva, legal, plazos LO 2/1984, alude a persona aludida; aportación es proactiva, editorial, sin marco legal, alude a tercero con conocimiento. Mezclar los dos canales repelía al aportante con perfil sensible (funcionario, periodista con fuente) porque la puerta única era pública.
- **Tres carriles bajo una sola puerta.** El maintainer instó a abrir el alcance más allá de "fuentes": que el cauce sirva también para correcciones fácticas menores e ideas sobre el sitio. La unificación es coherente porque el procesado interno es el mismo (clasificación → skill → diff o archivo razonado), mientras que la diferenciación al público confunde más de lo que aclara. La página `/aportar` presenta los tres carriles visiblemente con orientación sobre qué pedimos en cada caso.
- **No replicar SecureDrop ni Filtrala.** Tentación inicial: ofrecer un buzón cifrado para filtraciones. Rechazado por dos razones convergentes: (a) no es el proyecto, el inventario solo cita fuentes públicas verificables y los aportes valen como pistas a fuentes públicas, no como fuentes en sí; (b) abrir buzón de filtraciones nos hace depositarios bajo LSSI con conocimiento efectivo de material restringido, escalando la exposición legal. La línea editorial es "ayúdanos a localizar fuentes públicas que no hemos visto", no "envíanos lo que tengas".
- **Default anónimo, opt-in opcional.** El maintainer eligió esta postura sobre la alternativa "acreditar a quien autorice activamente". Razón: protege al aportante con vínculos institucionales sensibles (la mayoría del perfil objetivo) y mantiene el principio editorial de que las afirmaciones se sostienen en sus documentos públicos, no en quien las apuntó. Trailer convencional `Aporte-externo: <nombre o medio>` para opt-in, sin acreditación nunca sin consentimiento documentado.
- **El email entrante NO se versiona.** Sólo el contenido editorial extraído va a `content/aportes/YYYY-MM-DD-slug.md` (excluido del build). Los headers identificativos (`From`, `Reply-To`, IP, metadatos cliente) quedan únicamente en la bandeja personal del maintainer. Minimización RGPD art. 6.1.f.
- **CTA en el header en lugar de en el hero.** La propuesta inicial era añadir un módulo institucional en el hero de la home invitando al aporte. El maintainer pidió subir esa señal al header navbar como botón permanente, paralelo al rediseño del selector de idioma como dropdown. Razón: el CTA en hero solo se ve desde la home; el CTA en header se ve desde cualquier página, especialmente desde una ficha de caso donde un periodista pueda detectar que falta una fuente. El módulo en el hero queda como pendiente complementario.
- **Refactor del selector de idioma.** Hasta el 2026-05-25 el selector era dos `<a>` inline `ES / CAT` en el header. El cambio a dropdown desplegable (con `aria-haspopup="menu"` + chevron animado + panel blanco abajo con código de idioma y nombre) cumple dos cosas: (a) prepara la UI para un eventual tercer idioma (gallego/euskera) sin amontonar elementos en la cabecera; (b) libera espacio horizontal en el header para el nuevo CTA "Aportar" sin sobrecargar visualmente. El dropdown comparte JS con el panel hamburguesa (contrato `aria-controls` + `data-open`), evitando duplicar listeners de click-fuera / ESC / navigation.
- **El botón Aportar mantiene visibilidad en mobile.** En mobile (<720px) el header colapsa a brand + search-lupa + Aportar + hamburguesa. Aportar pierde su icono `+` y reduce padding, pero conserva el texto. Decisión: el CTA editorial es prioritario sobre el dropdown de idioma (que se mueve al panel hamburguesa).

## Ideas futuras

### v1.x — comprometido

- **Módulo institucional en el hero de la home** con CTA al cauce de aporte. Sigue siendo deseable como refuerzo del CTA del header para visitantes que aterricen directamente en la home y aún no estén leyendo una ficha; coherente con el tono honesto del aviso §4.
- **CTA dual "Rectificar · Aportar" en la §2.11 de la ficha de caso** ("Cómo se ha redactado esta ficha"), al lado del CTA actual de rectificar.
- **Skill `/incorporar-aporte` v0** cuando llegue el primer aporte real.

### Sin compromiso

- **Open Graph card específica para `/aportar`** con el copy del CTA, para que cuando se comparta el link el preview comunique de qué va el cauce sin tener que abrir la página.
- **Variante catalana `/cat/aportar`** cuando se active el catalán en el sitio.
- **Webhook desde Cloudflare Email Routing**: cuando llegue un email a `aportar@`, abrir automáticamente un fichero en `content/aportes/` sin intervención manual del maintainer en el paso 2 del pipeline. Reduce la fricción para el maintainer pero introduce un Cloudflare Worker; evaluar coste/beneficio cuando el volumen real lo justifique.
- **Bloque metricado interno** (no público) en `/admin/` con cuántos aportes han entrado, en qué carriles, tasa de incorporación. Útil para calibrar la salud del feedback loop; **no** se expone públicamente para no incentivar el aporte como métrica vanidosa.
- **Confirmación de plazo automatizada**: respuesta de cortesía automática al recibo del email ("hemos recibido tu aporte, te respondemos en máximo 30 días hábiles"). Trade-off con la regla RGPD de no procesar más datos del aportante que los estrictamente necesarios; revisar antes de implementar.
- **Bloque "Aportes incorporados recientemente"** en la home, agrupando commits con trailer `Aporte-externo:`. Refuerza la transparencia ("este sitio se enriquece con aportes de la gente") y reconoce a los aportantes que sí pidieron acreditación. Evaluar después de los primeros 5-10 aportes reales para ver si el copy lee bien y si hay suficiente densidad.
- **Indicador visual de "tu aporte ayudó"** en el commit final cuando se incorpora un aporte con acreditación, similar a co-authoring de GitHub pero a nivel editorial.

## Pendientes operativos

- [x] Activar `aportar@presuntamente.org` en Cloudflare Email Routing (maintainer, panel CFE, 2026-05-25).
- [x] Crear `src/pages/aportar.astro` (wrapper) y `src/components/pages/PgAportar.astro`.
- [x] Añadir CTA "Aportar" al header del `BaseLayout.astro` (decisión final: en el header navbar, no solo en el footer).
- [x] Refactor del selector de idioma a dropdown desplegable (decisión del maintainer en la misma sesión que el botón Aportar).
- [x] Añadir CTA "Aportar al inventario" al panel móvil hamburguesa.
- [x] Añadir link a `/aportar` al footer en la columna renombrada "Aportar y rectificar".
- [ ] Construir módulo institucional en hero de `PgInicio.astro` con CTA a `/aportar`.
- [ ] Añadir CTA dual "Rectificar · Aportar" en la §2.11 de `PgCasoDetalle.astro` al lado del CTA actual de rectificar.
- [ ] Crear placeholder `.agents/skills/incorporar-aporte/SKILL.md` (mínimo viable, se moldeará con uso).
- [ ] Decidir si se añade `content/aportes/` al index del `content.config.ts` como collection o se mantiene como puro fichero anotativo fuera de Astro (recomendado: fuera de Astro, igual que `NOTES.md`).
- [ ] Verificar que `pnpm validate` no rompe al introducir un fichero markdown en `content/aportes/` (probable: no rompe porque el script de validate sólo lee schemas YAML).
- [ ] Cuando se active el feed de aportes acreditados (idea futura sin compromiso), añadirlo como pieza pública.
