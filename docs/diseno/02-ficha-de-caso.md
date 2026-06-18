# Modelo de ficha de caso — UX y contenido

**Estado:** borrador 1.0 · 2026-05-21
**Alcance:** qué muestra la página de un caso en presuntamente.org, en qué secciones, con qué citación. NO incluye diseño visual (eso va aparte con la skill de design para el branding gov-retro).
**Asume:** doc 01 (modelo de datos) cerrado.

---

## 0. Principios de la ficha

1. **Estado epistémico antes que parte política.** La estructura visual separa hechos por estado epistémico (acreditado, investigado, contrapuesto, exculpatorio, desmentido), no por bando. Un hecho acreditado contra un alcalde del partido A y otro contra un consejero del partido B se muestran exactamente igual.
2. **Cita visible, no escondida.** Cada afirmación tiene su(s) fuente(s) y nivel **visibles en línea**, no detrás de un tooltip. Si el lector tiene que pasar el ratón para ver de dónde sale algo, hemos fallado.
3. **El estado actual gana al histórico, pero el histórico no se borra.** La página muestra el estado vigente. Lo superado (desimputaciones, hechos corregidos, roles pasados) sigue accesible en sección propia.
4. **Trayectoria > etiqueta.** Una persona no es "una imputada"; ha sido investigada en periodo X, procesada en Y, absuelta en Z. La UI muestra trayectoria, no un sello fijo.
5. **Cada ficha lleva su "cómo se ha redactado esto"** con maintainer, fuentes, fecha de última revisión y cómo proponer corrección. Parte del producto, no de una FAQ.
6. **Mobile y baja-banda first.** La ficha debe leerse bien en móvil con conexión mediocre. Toda visualización gráfica tiene equivalente textual.

---

## 1. Arquitectura de la página {#1-arquitectura-de-la-página}

```
┌─ Encabezado del caso ─────────────────────────────────┐
│ Nombre mediático · Nombre oficial                     │
│ Fase actual: [Instrucción]  Órgano: [JCI nº6, AN]     │
│ Último hito: [Imputación de X · 2026-05-19]           │
│ Próxima fecha previsible: [—] o [Vista oral, junio]   │
└───────────────────────────────────────────────────────┘

[Resumen ejecutivo — 3-5 párrafos neutros]

┌─ Navegación interna (sticky desktop, expandible mobile) ─┐
│ Estado · Cronología · Personas · Hechos · Documentos    │
│ Piezas · Conexiones · Cómo se redacta · Rectificar      │
└──────────────────────────────────────────────────────────┘

[Estado procesal actual]    [Personas implicadas, por rol]

[Cronología — Hitos del caso]

[Hechos clasificados por estado epistémico]

[Contenido considerado y no modelado — si el caso tiene ítems]

[Documentos — biblioteca del caso]

[Piezas — si Caso tiene hijos]

[Conexiones con otros casos]

[Cómo se ha redactado esta ficha]

[Pie: disclaimer, rectificación, licencia]
```

Cada sección navegable por ancla (`#cronologia`, `#hechos`, etc.).

---

## 2. Detalle por sección {#2-detalle-por-sección}

### 2.1 Encabezado {#21-encabezado}

- **Nombre mediático** grande (lo que la gente busca).
- **Nombre oficial** justo debajo, en grado menor (`numero_procedimiento` + `organo_judicial`).
- **Fase actual** como badge prominente, color por fase (no por bando).
- **Órgano judicial** con enlace a su ficha de Organización.
- **Último hito** con fecha y descripción muy corta.
- **Próxima fecha previsible** si está documentada (vista oral, plazo recurso).
- **Cifra resumen** si el caso la tiene (`Caso.resumen_cifras`).
- **Indicador de relevancia** sólo si `nivel_relevancia_editorial = capital`.

NO en el encabezado:
- Nombres de no imputados ("caso Zapatero") — relegados a un campo *aka* en aside.
- Adjetivos editoriales ("escándalo", "trama").
- Logos políticos o símbolos partidistas.

### 2.2 Resumen ejecutivo {#22-resumen-ejecutivo}

3-5 párrafos máximo, en castellano neutro:
1. Qué es este caso (una frase): qué se investiga o ha juzgado y dónde.
2. Cómo empezó: origen de la denuncia, fecha de apertura, quién la presentó.
3. Estado actual: en qué fase está, qué se ha probado, qué falta.
4. Por qué importa (objetivo, no editorial): cifra, alcance institucional, precedente.
5. Qué NO está probado (importante): aclarar lo que sigue investigado/atribuido y no acreditado, para que nadie salga creyendo que sí.

Cada afirmación del resumen referencia un Hecho del modelo. Si el resumen contiene afirmación sin Hecho de respaldo, review humano lo bloquea.

### 2.3 Estado procesal actual {#23-estado-procesal-actual}

Bloque compacto:
- Fase actual (color)
- Órgano judicial
- Juez instructor / ponente actual
- Fiscal asignado (si público)
- Número de procedimiento
- Último hito relevante (con fecha + enlace a cronología)
- Próximo evento previsto (si lo hay)

Si es macrocausa, este bloque incluye mini-resumen de fases de las piezas hijas: "3 piezas en instrucción, 1 visto para sentencia, 1 archivada".

### 2.4 Personas implicadas {#24-personas-implicadas}

Bloque principal. Personas agrupadas por **rol procesal actual** (no por trayectoria), en orden:

1. **Investigados / procesados / acusados** (rol activo)
2. **Condenados** (con sentencia firme)
3. **Absueltos / desimputados** (rol activo: ya no bajo procedimiento)
4. **Otros: testigos, denunciantes, acusación popular** (colapsado por defecto)
5. **Funcionales: jueces, fiscales, abogados** (sólo si relevante; colapsado)

Cada persona como card:
- Foto **sólo** si `es_figura_publica = true` y la imagen es de uso libre (CC, dominio público).
- Nombre completo.
- Cargo (si público).
- **Rol(es) actual(es) en este caso** con badge.
- **Trayectoria completa en este caso**: micro-swimlane horizontal (ver sección 3.1).
- Delitos atribuidos vigentes (sólo si rol de tipo atribución activa).
- Enlace a ficha de Persona (perfil con todos sus casos).

Para personas privadas (no figuras públicas): card reducida, sin foto, nombre y rol; trayectoria visible pero más compacta. Si V-17 está pendiente o anonimizada, aparece como "Asesor jurídico externo" o "Anónimo-3" según política aplicada.

### 2.5 Organizaciones implicadas {#25-organizaciones-implicadas}

Lista de Organizaciones referenciadas en `RolEnCaso` del caso (acusación popular, partidos como querellantes, empresas investigadas, organismos públicos). Cada una con tipo, rol y enlace a su ficha.

### 2.6 Cronología (Hitos) {#26-cronología-hitos}

Eje vertebral. Línea de tiempo vertical en mobile, vertical o horizontal en desktop. Cada Hito como card:
- Fecha (con `fecha_precision` clara — "junio 2024" si es preciso al mes).
- Tipo de Hito (badge: jurisdiccional, político, mediático con efecto procesal).
- Título.
- Descripción corta.
- Personas afectadas (chips con enlace).
- Documento principal (enlace a la biblioteca con preview si es PDF).
- Si el hito introduce o modifica Hechos: indicadores "+ N hechos nuevos · M corregidos".

Filtros:
- Por tipo (jurisdiccional / político / mediático).
- Por pieza (si macrocausa).
- Por persona.

Para macrocausas, los Hitos de piezas hijas aparecen aquí también con indicador visual de a qué pieza pertenecen.

### 2.7 Hechos (clasificados por estado epistémico) {#27-hechos-clasificados-por-estado-epistémico}

**LA sección más sensible.** Su estructura materializa el principio anti-desinformación.

> **Cifras en los Hechos.** Un Hecho puede llevar `importe` (con su `importe_clase`, `importe_alcance`, `importe_naturaleza` y, si el documento lo desglosa, `importe_atribucion` por papel económico). Cada cifra **hereda y muestra** el estado epistémico (`EpistemicBadge`) y el nivel de fuente (`LevelBadge`) del Hecho: un perjuicio de sentencia firme no se presenta igual que una cifra de un escrito de acusación. El total agregado del caso vive en la sección "Cifras del caso" (clase `objeto` y `consecuencia` separadas, nunca sumadas). Modelo en [doc 01 §2.6](01-modelo-de-datos.md#26-hecho); feature en [`importe-presunto.md`](../web/features/importe-presunto.md).

Subsecciones, en este orden fijo:

#### 2.7.1 Hechos acreditados {#271-hechos-acreditados}
Verde, sólido. Cada Hecho como bloque:
- Enunciado (texto neutro).
- "Acreditado por:" + lista de `documentos_respaldo` con nivel visible (badge 1-4) y enlace.
- Fecha o periodo.
- Personas y organizaciones implicadas (chips enlazadas).

#### 2.7.2 Hechos bajo investigación {#272-hechos-bajo-investigación}
Amarillo claro. Misma estructura, con aviso visible al inicio de la subsección:
> Los hechos en esta sección están bajo investigación judicial pero **no han sido acreditados**. Pueden ser confirmados, descartados o archivados en el futuro.

#### 2.7.3 Hechos en contraposición {#273-hechos-en-contraposición}
Bloques con dos columnas: Hecho A (atribuido por X) vs Hecho B (sostenido por Y). El lector ve a la vez qué dice cada actor, con qué nivel de fuente, sin que la página decida cuál tiene razón.

Ejemplo (Plus Ultra):
- **Columna A** — La SEPI defendió que Plus Ultra cumplía los criterios técnicos. Fuente: nota de prensa SEPI 2021 (Nivel 4).
- **Columna B** — El informe UDEF y la acusación popular sostienen que no los cumplía. Fuente: informe UDEF 2022 (Nivel 2), escrito Manos Limpias (Nivel 2).

#### 2.7.4 Hechos exculpatorios {#274-hechos-exculpatorios}
Gris/azul claro. Hechos establecidos por sentencia absolutoria, auto de archivo, desimputación. Misma estructura.

#### 2.7.5 Hechos desmentidos {#275-hechos-desmentidos}
Gris claro. Hechos cuya valoración editorial los descarta con base en evidencia posterior. Cada uno enlaza al Hecho que desmiente.

#### 2.7.6 Hechos superados (colapsado por defecto) {#276-hechos-superados-colapsado-por-defecto}
Hechos con `vigencia = superado` por corrección procesal. Accesibles, no borrados. Cada uno con enlace al Hecho corrector.

---

Anti-patrón explícito: **NUNCA se mezclan tipos** dentro de una misma lista. Un Hecho acreditado nunca aparece al lado de uno atribuido sin distinción visual. El lector debe saber siempre en qué categoría está leyendo.

### 2.8 Documentos / Biblioteca del caso {#28-documentos--biblioteca-del-caso}

Lista filtrable de todos los `Documento` referenciados en el caso. Cada documento:
- Título.
- Tipo (badge).
- **Nivel de fuente** (badge 1-4 con color).
- Productor (organización + personas).
- Fecha.
- Enlace canónico (al original) y enlace de archivo (mirror archive.org).
- Idioma.
- Estado de acceso.
- "Citado en N hechos" + lista expandible.

Filtros: por tipo, nivel, fecha, productor.

Si tenemos copia local del documento: enlace al PDF en repo, con hash visible.

### 2.9 Piezas (si Caso tiene hijos) {#29-piezas-si-caso-tiene-hijos}

Si el caso es padre, esta sección muestra:
- Árbol expandible del caso y sus piezas (con `tipo_pieza`).
- Para cada pieza: badge de fase, último hito, número de personas por rol.
- Enlace a la ficha completa de la pieza.

Visualización opcional: árbol/dendrograma o lista anidada. Textual canónica, gráfica complementaria.

### 2.10 Conexiones con otros casos {#210-conexiones-con-otros-casos}

Dos sub-bloques:

**Conexiones formales** (`RelacionEntreCasos`):
- Lista de casos relacionados con tipo de relación, descripción y documentos de respaldo.

**Conexiones por actores compartidos** (computado):
- Lista de personas que aparecen en este caso y también en otros, con enlaces.

Visualización opcional: mini-grafo SVG con nodos (Casos) y aristas (relaciones). Versión textual obligatoria.

### 2.11 Cómo se ha redactado esta ficha {#211-cómo-se-ha-redactado-esta-ficha}

Meta-sección. Parte de la ficha, no del footer. Contenido:

- **Maintainer responsable**: nombre + enlace al perfil GitHub. Si hay varios revisores recientes, listarlos.
- **Última revisión completa**: fecha (`Caso.ultima_revision_editorial`).
- **Última modificación**: fecha del último commit que toca la ficha.
- **Política editorial aplicada**: enlace a `CONTRIBUTING.md` y guía de estilo.
- **Niveles de fuente usados en esta ficha**: resumen ("5 hechos con Nivel 1, 8 con Nivel 2, 3 con Nivel 4 complementario"). Opcional, útil.
- **Cómo proponer una corrección**: enlace al template de issue. Detalle de plazos.

### 2.12 Pie {#212-pie}

- **Disclaimer estándar** (ver "Riesgos legales y éticos", sección "Disclaimer recomendado"): "Esta ficha presenta información pública sobre un procedimiento judicial. Las personas mencionadas como investigadas o procesadas se presumen inocentes hasta que recaiga sentencia firme..."
- **Aviso de rectificación**: derecho garantizado vía issue, correo o formulario.
- **Licencia del contenido**: propuesta CC BY-SA 4.0 (compatibilidad con AGPL del código se discute en doc 05).
- **Última actualización** completa con timestamp.

### 2.13 Contenido considerado y no modelado {#213-contenido-considerado-y-no-modelado}

**Incorporada el 2026-06-12** a raíz de la propuesta externa de la issue #3, aceptada por el maintainer con condiciones. Posición en página: inmediatamente después de los Hechos (sección 2.7), de los que es el complemento negativo. Sólo se renderiza si el caso tiene ítems.

**Qué es.** El trabajo editorial de decidir qué NO se modela (referencias indirectas en documentos de la causa que la prensa identifica con personas concretas; relaciones entre casos evaluadas y descartadas) vivía sólo en los `NOTES.md` internos. Ese silencio no es neutro: el lector que echa en falta un nombre o una conexión rellena el hueco con su sesgo. Esta sección publica la decisión, su regla y sus fuentes — enseña lo que pasa en el sumario sin afirmar lo que pasa en el sumario.

**Fuente de datos.** Campo `contenido_no_modelado` de `caso.yaml` (ver `schemas/caso.schema.json`): lista de ítems con `id` (ancla estable), `texto` (prosa), `fecha_revision` y `fuentes[]` opcionales (`medio_id` + `titular` + `fecha` + `url` + `url_archivo`).

**Regla P-11 — condiciones innegociables** (cada una corta un modo de fallo distinto):

1. **Prosa atribuida, nunca tabla.** Una rejilla «referencia = persona» hace que el sitio firme la identificación por mucho disclaimer que lleve debajo; en prosa, las negaciones van pegadas al nombre («ningún órgano judicial ha hecho suya esa identificación», «X no tiene rol procesal en esta causa»). Misma información, autoría distinta.
2. **Sólo cargos públicos en su función pública.** Presidente del Gobierno, ministra, directora general: nombrables (doc 04, apartado 4: riesgo bajo). Particulares y semi-públicos: nunca — para ellos sigue rigiendo el silencio (o el `NOTES.md` interno). Es el umbral que impide que el patrón se deslice hacia «personas que aparecieron en agendas y no fueron imputadas».
3. **Cruce de líneas editoriales obligatorio.** La interpretación debe constar en al menos 2 medios de líneas editoriales distintas (campo `fuentes`). Si sólo la hace una trinchera, no se publica: es munición, no «lo que se dice». Defensa mecánica del principio «sin cuota política».
4. **Sin entidad, sin nodo, sin badge.** La mención no crea `Persona`, `RolEnCaso`, vínculo ni nodo del grafo; el nombre vive sólo en esa prosa. En render, `RichProse` sólo auto-enlaza personas con rol formal en ESE caso (exclusión mecánica del resto, aunque la persona exista en el inventario por otro caso). Además, la validación **V-27** prohíbe usar el escape hatch manual `[[persona:...]]` dentro de `contenido_no_modelado.texto`.

**Render.** `Aclaracion` introductoria fija (qué es la sección y qué NO implica) + un bloque por ítem: prosa, lista de fuentes (medio enlazado a su ficha + titular enlazado a la pieza + fecha) y línea de `fecha_revision` con compromiso de reevaluación.

**Reevaluación.** Un ítem no es eterno: si aparece primario accesible o resolución judicial, el contenido se modela como `Hecho` (y el ítem se retira o se reescribe), o se corrige. La `fecha_revision` hace auditable ese ciclo.

---

## 3. Patrones de UI específicos {#3-patrones-de-ui-específicos}

### 3.1 Swimlane de trayectoria por persona {#31-swimlane-de-trayectoria-por-persona}

Para cada persona en "Personas implicadas", un mini-swimlane horizontal:

```
[2024-04 ━━━━━━━━━━━ 2026-04 ━━━━━━━━ 2026-05 ━━━━━━ hoy]
         investigada              procesada
                                              (pieza X)

         investigada ━━━━ desimputada
         (pieza Y)
```

En mobile: lista vertical de roles con fechas.

Reglas:
- Roles vigentes en color sólido; cerrados en gris.
- Si la trayectoria incluye desimputación o absolución, ESA parte está SIEMPRE visible, no oculta. El lector ve que la persona ha sido exculpada en algo.
- Si la persona privada está marcada para V-17 anonimización, swimlane sigue accesible pero el nombre se reemplaza.

### 3.2 Hechos en contraposición lado a lado {#32-hechos-en-contraposición-lado-a-lado}

Caja con borde, dos columnas. Etiqueta cada columna con el actor que sostiene el Hecho. Sin layout que sugiera ganador (ancho igual, mismo orden vertical, mismo tipo de cita).

### 3.3 Cards de Hitos {#33-cards-de-hitos}

Compactas. Tipo por icono (gavel, mic, news), nunca por color partidista.

### 3.4 Visualización de grafo de conexiones {#34-visualización-de-grafo-de-conexiones}

Para Casos con muchas conexiones (típicamente macrocausas como Gürtel cuando llegue):
- Nodos = Casos (etiqueta corta, fase como color).
- Aristas = `RelacionEntreCasos` (con tipo).
- Filtro: mostrar/ocultar por tipo de relación.

Versión textual lista alternativa siempre disponible.

### 3.5 Citación inline {#35-citación-inline}

Dentro de prosa (resumen, descripción de hito, enunciado de hecho), los nombres y casos son links a sus fichas. Los documentos se citan como notas inline con badge de nivel:

> "El 22 de junio de 2020, SEPI aprobó un préstamo de 53 millones de euros [Auto SEPI · N1]."

Hover/tap expande detalles; el badge ya es visible.

---

## 4. Reglas anti-desinformación en presentación {#4-reglas-anti-desinformación-en-presentación}

Obligatorias para cualquier ficha. CI valida lo automatizable; el resto es review editorial.

| id | Regla | Mecanismo |
|----|-------|-----------|
| P-01 | Nombre mediático no contamina el campo `investigados_formales` | dato (doc 01) |
| P-02 | Ningún Hecho aparece sin fuente(s) y nivel visible | CI + render |
| P-03 | Hechos agrupados por estado epistémico, nunca mezclados | render |
| P-04 | Persona desimputada o absuelta: información visible en bloque principal de personas, no oculta | render |
| P-05 | Hechos superados se conservan, no se borran | dato + render |
| P-06 | Toda visualización gráfica tiene equivalente textual | render |
| P-07 | Personas privadas: sin foto ni datos personales más allá de lo procesal | dato (doc 01) + render |
| P-08 | Cada ficha enlaza a política editorial y mecanismo de rectificación | layout |
| P-09 | Lenguaje neutro obligatorio en titulares, hitos y enunciados. Lista negra de adjetivos editoriales prohibidos ("escándalo", "trama", "mafia"...) excepto en cita literal de fuente | CI (lista negra simple) + review |
| P-10 | Ningún color, icono o badge se asocia a partido político | revisión visual + skill design |
| P-11 | Menciones paraprocesales (persona sin rol procesal nombrada en la ficha) sólo en la sección "Contenido considerado y no modelado" y bajo sus 4 condiciones: prosa atribuida con negaciones pegadas al nombre, sólo cargos públicos en su función, cruce de ≥2 líneas editoriales en `fuentes`, sin entidad/rol/nodo (ver "2.13 Contenido considerado y no modelado") | dato (schema) + render + V-27 + review (`/revisar-caso`) |

---

## 5. Listados y búsqueda (adyacente a la ficha) {#5-listados-y-búsqueda-adyacente-a-la-ficha}

Listados en la página principal:
- Filtros por fase, jurisdicción, familia de delitos, año de apertura.
- **NO** filtro por partido político — contraproducente al objetivo.
- Orden por defecto: cronológico inverso (último hito), no por relevancia editorial.
- Card de listado muestra: nombre mediático, fase, último hito, número de implicados con rol activo.

Búsqueda:
- Full-text sobre nombres, casos, hechos.
- Resultados con tipo (Caso, Persona, Hito, Hecho, Documento).
- **NO** autocompletar nombres de personas privadas; sólo figuras públicas.

---

## 6. Mobile y accesibilidad {#6-mobile-y-accesibilidad}

- Toda visualización gráfica tiene fallback textual.
- Texto con contraste suficiente (WCAG AA mínimo).
- Sin información transmitida sólo por color (badges: ver [DESIGN.md — "Sistema de badges"](../../DESIGN.md#2bis-sistema-de-badges)).
- Sticky nav colapsable.
- Lazy load de gráficos pesados (grafo, swimlanes).
- Visualizaciones por defecto activan teclado para usuarios sin ratón.

---

## 7. Cuestiones abiertas {#7-cuestiones-abiertas}

1. **Idioma de los enunciados.** MVP castellano. ¿Permitir versión en lengua cooficial cuando aplique al caso (3% en catalán, Pujol en catalán)? Aplazado.
2. **Comentarios públicos al pie de ficha.** Recomendación: NO en MVP; sí mecanismo de rectificación vía issue.
3. **Compartir social.** Open Graph y Twitter Cards: ¿con qué imagen, con qué texto? Riesgo de descontextualización en redes. Propuesta: card neutra con nombre del caso, fase actual y "Más info: presuntamente.org/...".
4. **Versión imprimible / PDF.** Útil para investigadores. Propuesta: sí, generado on-demand desde el mismo YAML.
5. **Internacionalización del envoltorio.** Strings de UI — ¿sólo castellano en MVP? Propuesta: sí, estructurar para añadir lenguas después.
6. **Indicación de hechos "recientes".** Marcar visualmente Hitos / Hechos de los últimos 30-90 días en una ficha. Útil para lectores recurrentes. Propuesta: sí en Fase 2.

---

## 8. Siguiente paso

Doc 03 — Estrategia de mantenimiento. {#8-siguiente-paso}
