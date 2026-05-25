# Aprendizajes históricos

Aprendizajes largos movidos fuera de `ROADMAP.md`.

Regla: si un aprendizaje se convierte en norma obligatoria, debe promoverse a `AGENTS.md`, `DESIGN.md` o `docs/diseno/`. Este fichero conserva contexto, no autoridad normativa.

## Documentación operativa

- **El roadmap no debe ser diario completo.** `ROADMAP.md` debe explicar qué está vivo ahora. Los cierres largos van a `docs/roadmap/historial-YYYY-MM.md`.
- **Fichas por página y feature.** Las ideas futuras de `/cifras`, `/aportar`, `/404`, feed, OG images, timeline, etc. viven en `docs/web/pages/` o `docs/web/features/`, no en el roadmap global.
- **El maintainer no quiere revisar docs largos por defecto.** Resumir, decidir y preguntar sólo cuando sea bloqueante.

## Diseño e interfaz

- **No usar signo de sección ni glyphs decorativos hermanos.** La convención vigente está en `AGENTS.md`; el contexto histórico fue que el set resultaba germánico-académico y no castellano real.
- **Branding canónico.** `DESIGN.md` prevalece sobre el bundle de Claude Design si hay conflicto.
- **Sincronización con Claude Design es manual.** Si Claude Code cambia diseño sustancial, hay que recordar al maintainer que regenere el bundle.
- **`preview/comp_*.html` es canónico frente a `ui_kits/web/`.** El UI kit enseña flujo; los previews contienen detalles finos de componente.
- **Rojo del footer permitido.** La prohibición de rojo aplica a estados epistémicos o procesales, no a decoración institucional apagada.
- **`/branding/wordmark.svg` es placeholder.** El header debe renderizar el wordmark como texto estilado hasta que exista SVG con paths.
- **HMR de Astro puede no propagar CSS scoped.** Si el navegador parece conservar CSS viejo, reiniciar dev server antes de depurar.
- **`ClientRouter` retirado (2026-05-26).** Provocaba desincronización URL/contenido al usar botón atrás. Navegación full-page otra vez; no reintroducir SPA routing sin resolver eso. Los scripts globales siguen usando delegación desde `document` en `BaseLayout.astro`.
- **Flex en `<td>` rompe tablas densas.** Para columnas con enlaces apilados, usar contenedor interno (`div` con `grid`/`flex`), no estilos de layout sobre la celda.
- **Header responsive.** `1fr` no se comprime por debajo del min-content; usar `minmax(0, 1fr)` o colapsar antes.
- **Nav mobile.** Preferir `flex-wrap` a `overflow-x: auto`; el scroll horizontal en nav visible parece error.
- **Iniciales españolas.** Usar primera y última palabra significativa, no las dos primeras.
- **`lib/labels.ts` centraliza enum -> label.** No duplicar mappings en páginas.
- **Phase badge archivado.** Distinguir archivo de sentencia firme para no confundir "cerrado sin condena" con "firme".

## Astro, Pagefind y RichProse

- **Astro Content Collections YAML.** No pasar `parser`; Astro detecta por extensión.
- **`generateId` por `data.id`.** Para collections anidadas, evita ids dependientes del path.
- **Zod mínimo con `.passthrough()`.** JSON Schema/AJV valida contenido editorial completo; Zod sólo aporta tipos a Astro.
- **Pagefind UI no es ESM.** Cargar con script normal y usar `window.PagefindUI`.
- **Pagefind necesita build previo.** No esperar índice en `pnpm dev`.
- **`data-pagefind-body` en `<main>`.** Evita indexar header, footer y chrome.
- **Regex con español.** `\b` ASCII falla con acentos y `ñ`; usar lookaround Unicode.
- **YAML block scalar puede partir términos.** Convertir espacios literales del término a `\s+` en regex.
- **Plural español.** Evitar concatenar `es` a palabras como `atribución`; usar singular/plural explícitos.
- **`toLocaleString('es-ES')` no siempre agrupa miles.** Usar formatter manual si el grouping importa.

## Modelado editorial

- **Brief vs realidad procesal.** Si divergen, documentar discrepancia en `NOTES.md`, respetar fuentes y pedir decisión si afecta al alcance.
- **Hechos administrativos no controvertidos.** V-04 no encaja perfecto con actos verificables sin sentencia; hoy se modelan como `atribuido` con actor institucional.
- **Desimputación.** Es cierre de rol previo + apertura de rol `desimputado`, no edición destructiva.
- **Un hito puede afectar a varias personas.** No duplicar autos por sujeto si el acto judicial es único.
- **Sobreseimiento parcial de delito.** Modelar como `Hecho(tipo=exculpatorio)` si el procedimiento sigue vivo.
- **Slugs estables.** Corregir `fecha` o `fecha_documento` sin renombrar ids si ya están referenciados.
- **`escrito_conclusiones_provisionales` como hito.** Evento procesal de parte, útil para fase intermedia.
- **Documentos N1 sin URL canónica.** Si el primario existe pero no es accesible, modelar con cobertura cruzada y anotar pendiente.
- **Documentos N2.** Escritos oficiales no publicados en fuente canónica pueden vivir como N2 si no son prensa.
- **Acusaciones populares coetáneas.** Fechas sincronizadas son aceptables si la justificación común está documentada.
- **`condenado` se separa en firme/no firme.** La presunción formal sólo cae con firmeza.
- **`investigado` no debe ir en rojo.** No prejuzgar a quien sólo está investigado.
- **Piezas separadas autónomas.** Una pieza puede vivir como caso raíz mientras el caso matriz no esté fichado.
- **Revocación de sobreseimiento.** Hoy se modela como `recurso_apelacion`; valorar `auto_apelacion` si el patrón se repite.
- **No inventar `url_canonica`.** Campo opcional vacío + nota en `NOTES.md` es mejor que URL dudosa.

## Fuentes y archivado

- **Mirrors no auditables no valen.** Wuolah, Scribd o blogs sin cadena de custodia no justifican descarga local.
- **HTML nativo oficial es primario descargable.** Si el órgano emisor publica HTML/XML, se archiva en ese formato con hash.
- **BOE: verificar `fecha_publicacion` contra XML.** No asumir que coincide con fecha del acto.
- **BOE marco.** Si una norma crea el instrumento del hecho investigado, puede ser Documento del caso.
- **Archive.org `Location` puede ser absoluta.** El parser debe aceptar `https://web.archive.org/web/...` además de paths relativos.
- **Timeout Archive.org depende del medio.** Infobae puede necesitar 90-180s.
- **Cloudflare anti-bot puede bloquear Archive.org.** `elespanol.com` devolvió HTTP 520; usar `url_archivo_no_disponible` y respaldo cruzado.
- **Hooks versionados.** `hooks/` + `core.hooksPath` es el patrón; los hooks nunca deben bloquear commits por red.

## Multiagente y git

- **El `.git/index` compartido contamina commits.** La solución real es worktree por sesión y no hacer `git add`/`commit` salvo cierre explícito.
- **Validar CWD antes de escribir.** Todo subagente debe confirmar worktree y ruta real al arrancar.
- **Stage explícito por ruta.** Sigue siendo obligatorio cuando el maintainer pida commit.
- **No depender de archivos de otra sesión paralela.** Si otra sesión crea una pieza, esperar a que aterrice o usar una referencia ya en main.
