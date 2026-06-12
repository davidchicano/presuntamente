# Riesgos legales y éticos

**Estado:** borrador 1.0 · 2026-05-21
**Disclaimer del propio documento:** este análisis es informativo y editorial, NO es asesoramiento jurídico. Para decisiones operativas sensibles (cómo responder a una querella, cómo gestionar un requerimiento) consultar con abogado especializado en derecho al honor / libertad de información en España.
**Asume:** docs 01-03 cerrados.

---

## 0. Resumen

Publicar un inventario de casos de corrupción con personas imputadas tiene riesgo real. Vectores principales:

1. **Derecho al honor, intimidad e imagen** (LO 1/1982): la afirmación que insinúa culpabilidad sin acreditación, o que pone información personal sin función pública, puede dar lugar a demanda civil.
2. **Presunción de inocencia** (CE art. 24.2): aunque es derecho frente al Estado, su vulneración mediática es factor que los tribunales civiles valoran en demanda por honor.
3. **LOPD/RGPD**: tratar datos personales identificables sin base jurídica adecuada o sin proporcionalidad.
4. **Injurias y calumnias** (CP arts. 205-216): vía penal, menos frecuente pero existe.
5. **Derecho de rectificación** (LO 2/1984): obligación de atender rectificaciones de hechos publicados.
6. **Responsabilidad LSSI** sobre contenidos publicados.

El doc 01 ya implementa muchas mitigaciones estructurales (separación acreditado/investigado, niveles de fuente, `RolEnCaso` temporales con desimputaciones explícitas). Este doc cierra lo que faltaba: identificación del responsable, mecanismo de rectificación, disclaimer, tratamiento de personas privadas, política ante querellas.

---

## 1. Marco legal aplicable {#1-marco-legal-aplicable}

Resumen no exhaustivo, en castellano informativo:

- **CE art. 20** — libertad de información veraz; **art. 18** — honor, intimidad, propia imagen; **art. 24** — tutela judicial, presunción de inocencia.
- **LO 1/1982** — protección civil del derecho al honor, intimidad e imagen. La afectación se valora por: carácter público o privado del afectado, interés público de la información, veracidad y diligencia del informador.
- **LO 2/1984** — derecho de rectificación. Quien se considere aludido por información inexacta tiene derecho a publicación de rectificación.
- **LO 3/2018 (LOPD-GDD)** y **RGPD UE 2016/679** — tratamiento de datos personales. Base jurídica más relevante para presuntamente: **interés legítimo** (art. 6.1.f RGPD). El tratamiento debe ser proporcional, mínimo y trazable.
- **LSSI 34/2002** — servicios de la sociedad de la información: deberes del prestador, retirada de contenido manifiestamente ilícito si hay conocimiento efectivo.
- **CP arts. 205-216** — calumnias e injurias.
- **Doctrina del TC y TS** sobre conflicto honor vs información — abundante; pivote es la **veracidad como diligencia** (no verdad absoluta) y el **interés público** del personaje y del hecho.

Clave: **un investigado en procedimiento penal de relevancia pública es objeto legítimo de información pública**, siempre que se respete el lenguaje (no se afirme culpabilidad sin sentencia firme) y se atienda rectificación.

---

## 2. Análisis de riesgos por tipo de afirmación {#2-análisis-de-riesgos-por-tipo-de-afirmación}

Mapeo `Hecho.tipo` → riesgo:

| Tipo de Hecho | Riesgo legal | Mitigación |
|---------------|--------------|------------|
| acreditado | bajo (sentencia firme respalda) | citación clara; si TC revoca, marcamos como superado |
| investigado | medio (hay procedimiento real pero no condena) | etiqueta `tipo` visible; lenguaje "se investiga", "se atribuye"; nunca insinuar culpabilidad |
| atribuido | medio-alto (un actor sostiene algo no acreditado) | identificar al actor en el enunciado; nivel de fuente visible |
| exculpatorio | bajo-positivo (libera a alguien) | publicar prominentemente, no esconder |
| desmentido | medio (puede ofender al actor desmentido) | documentar el desmentido con rigor |
| no_concluyente | bajo | etiqueta clara |

---

## 3. Presunción de inocencia: reglas de redacción {#3-presunción-de-inocencia-reglas-de-redacción}

Parcialmente cubiertas por P-09 del doc 02. Consolidadas aquí:

- Nunca verbos que afirmen culpabilidad sobre quien no tiene sentencia firme condenatoria: prohibidos "robó", "estafó", "se apropió" para hechos investigados; sí permitidos sólo en cita literal de fuente identificada entre comillas.
- Verbos preferidos para hechos investigados: "se le atribuye", "se investiga", "consta en el informe X que", "la acusación sostiene", "el instructor considera indiciariamente que".
- Sentencias no firmes: "ha sido condenado en primera instancia, pendiente de recurso" — nunca "es culpable".
- Personas absueltas o desimputadas: nunca "fue acusado de X" como descripción presente; sí "fue investigado por X y posteriormente desimputado por el órgano Y mediante auto Z".
- Causas archivadas: "el procedimiento fue archivado" + tipo (provisional vs libre). Nunca "no se demostró pero podría haber sido".
- **Dinero atribuido por sujeto.** Cuando un Hecho cuantifica dinero y hay varios implicados, **nunca** se suma en una sola cifra lo que sufre la víctima con lo que se atribuye al investigado, ni se presenta un importe pegado a un nombre como si lo hubiera "robado". Cada sujeto lleva su **papel económico** (`importe_atribucion`, ver [doc 01 §2.6](01-modelo-de-datos.md#26-hecho)): `perjudicado` (víctima, su pérdida nunca se imputa a otro), `activo` (conducta atribuida, **no** afirma percepción), `beneficiario` (sólo si consta que recibió), `obligado`/`acreedor` (consecuencias). El rojo de condena sólo se usa con dinero acreditado por resolución firme — nunca sobre lo investigado.

CI puede ayudar con lista negra simple de verbos para hechos no acreditados (warning, no bloqueante; decide review humano).

---

## 4. Derecho al honor: análisis por sujeto {#4-derecho-al-honor-análisis-por-sujeto}

**Figuras públicas con función pública vigente o reciente:**
Soportan más exposición. Información veraz, contrastada, de interés público y sobre ejercicio de función es protegida.
*Riesgo: bajo* si seguimos las reglas del modelo.

**Figuras públicas sin función actual (ex-cargos, jubilados):**
Algo más de margen. Lo investigado en su ejercicio sigue siendo público; lo posterior a su salida, más sensible.
*Riesgo: bajo-medio.*

**Particulares con función económica relevante (empresarios investigados):**
Si están imputados en procedimiento público, son objeto legítimo de información. Su vida no profesional NO.
*Riesgo: medio.*

**Particulares sin función pública (familiares, asesores externos, testigos):**
Riesgo más alto. Sólo aparecen si tienen rol formal en el procedimiento. Datos mínimos. Sin foto. V-17 obligatoria si su rol procesal se cierra.
*Riesgo: alto si no se cumple V-17.*

**Jueces, fiscales y abogados (rol funcional):**
Aparecen como rol funcional, sin que eso implique nada sobre su persona. Citables por su actuación profesional pública.
*Riesgo: bajo*, salvo afirmaciones sobre su independencia o competencia sin base.

### 4.1 Menciones paraprocesales a cargos públicos {#41-menciones-paraprocesales-a-cargos-públicos}

**Incorporado el 2026-06-12** (issue #3). Caso especial: nombrar en una ficha a una persona **sin rol procesal** porque la cobertura interpreta que referencias indirectas de un documento de la causa ("el presidente", "el one") aluden a ella. Sólo se permite en la sección "Contenido considerado y no modelado" y bajo la regla **P-11** ([doc 02 — "2.13 Contenido considerado y no modelado"](02-ficha-de-caso.md#213-contenido-considerado-y-no-modelado), canon de las 4 condiciones).

Base del riesgo bajo, **acumulativa** (las cuatro patas a la vez):

1. **Sujeto**: sólo cargos públicos en su función pública — el escalón de mayor tolerancia a la información en la ponderación honor/información (primer bloque de este apartado). Con particulares o semi-públicos la ponderación se invierte: prohibido.
2. **Veracidad en la capa meta**: lo que el sitio afirma no es "la referencia es X" sino "medios de varias líneas publican que la referencia aludiría a X" — un hecho verificable con las piezas enlazadas (campo `fuentes`). La diligencia exigible queda documentada en el propio render.
3. **Reportaje neutral**: la atribución es expresa (medios concretos, titulares, fechas) y el sitio no hace suya la identificación: publica simultáneamente que ningún órgano judicial la ha asumido y que la persona no tiene rol procesal. La prosa con las negaciones pegadas al nombre es lo que mantiene al sitio como transmisor y no como autor; una tabla "referencia = persona" rompería esa neutralidad (por eso P-11 la prohíbe).
4. **Interés público**: la existencia de la interpretación periodística cruzada es, en sí misma, parte relevante del caso; callarla deja al lector a merced del medio único que consuma.

**Qué sigue prohibido** aunque las cuatro patas parezcan cumplirse: insinuar conducta ("sabía", "ordenó", "estaba al tanto") en vez de describir la interpretación ajena; seleccionar fuentes de una sola línea editorial; mantener el ítem sin reevaluar cuando aparezca primario accesible (la `fecha_revision` del ítem compromete esa revisión); y cualquier formato estructurado que convierta la mención en dato consultable (entidad, rol, nodo, badge, tabla).

---

## 5. LOPD/RGPD {#5-lopdrgpd}

Bases jurídicas aplicables al tratamiento que hace presuntamente:

- **Interés legítimo (art. 6.1.f RGPD)**: el interés del público en conocer procedimientos judiciales de relevancia social pesa frente al interés del individuo en no aparecer mencionado, **cuando los datos provienen de fuentes públicas y se tratan con proporcionalidad**.
- **Datos especiales (art. 9 RGPD)**: NO se tratan. No publicamos salud, ideología, orientación sexual, origen racial. La ideología política aparece sólo si es un cargo declarado público (afiliación partidaria pública) vinculada a la función.

Principios:
- **Minimización**: sólo los datos estrictamente necesarios para identificar a la persona en su rol procesal.
- **Exactitud**: actualización conforme cambia el procedimiento (Hitos, `RolEnCaso`).
- **Limitación del plazo**: V-17. Cuando una persona privada deja de tener rol procesal vivo, revisión obligatoria.
- **Trazabilidad**: el git log es la trazabilidad.
- **Derechos del afectado**: el mecanismo de rectificación cubre rectificación y oposición; si llega una solicitud de supresión (art. 17 RGPD), se evalúa caso a caso (en cargos públicos prevalece interés público; en particulares con causa archivada normalmente se acepta).

---

## 6. Mecanismo de rectificación {#6-mecanismo-de-rectificación}

Diseño:

- **Vía pública**: formulario en `presuntamente.org/rectificar` (o template de issue específico en GitHub) con:
  - Ficha afectada (URL).
  - Afirmación concreta cuestionada (o sección).
  - Motivo de la rectificación.
  - Documento o fuente que sostiene la rectificación (URL, PDF).
  - Identificación opcional del solicitante (con email de contacto).
- **Vía correo**: `rectificacion@presuntamente.org` como canal alternativo.
- **Vía postal**: cuando esté operativo el apartado de correos del responsable, como alternativa formal a las vías electrónicas.

Plazos comprometidos públicamente:
- **Acuse de recibo**: 48 horas hábiles.
- **Resolución provisional**: 7 días hábiles.
- **Publicación de rectificación si procede**: dentro del plazo legal (3 días desde recepción según LO 2/1984; comprometemos 7 días para revisión exhaustiva).

Tipos de respuesta:
- **Rectificación íntegra**: el hecho era inexacto, se sustituye y se anota la rectificación visiblemente.
- **Rectificación parcial**: matización del enunciado.
- **Mantención motivada**: la información se sostiene; respuesta motivada al solicitante citando documentos.
- **Retirada provisional**: mientras se aclara, retirar el hecho/sección.
- **Retirada definitiva**: el hecho era injustificable, se elimina con anotación de corrección en el log.

Las rectificaciones se anotan visiblemente en la ficha ("Esta sección fue rectificada el X tras solicitud Y; ver historial").

---

## 6bis. Mecanismo de aportación editorial {#6bis-mecanismo-de-aportación-editorial}

**Norma incorporada el 2026-05-24** para responder a un riesgo asumido por el modelo de mantenimiento: el maintainer no es periodista ni jurista, y la investigación de cada caso se delega íntegramente en LLM (ver `AGENTS.md`, sección "División de trabajo: maintainer ↔ agente"). El inventario gana así en escala y trazabilidad, pero pierde la red de fuentes humanas que tendría un medio tradicional. Esta sección abre formalmente ese canal: personas con mejor acceso a fuentes o mejor conocimiento del caso (periodistas, juristas, funcionarios, académicos, ciudadanos informados) pueden aportar al inventario sin necesidad de saber git ni de exponerse en un issue público.

Las secciones 6 y 6bis son cauces **complementarios, no alternativos**.

### 6bis.1 Diferencia con sección 6 (rectificación)

| Eje | Sección 6 Rectificación | Sección 6bis Aportación |
|---|---|---|
| Marco legal | LO 2/1984 (derecho de rectificación) | Sin marco legal específico — relación editorial voluntaria |
| Quién la usa | Persona u organización aludida, o representante con interés legítimo | Tercero externo con conocimiento útil del caso (no necesariamente aludido) |
| Naturaleza | Defensiva — "esto sobre mí está mal" | Proactiva — "os falta esto" / "esto está mal en general" / "tengo una idea" |
| Plazo de acuse | 48 horas hábiles | 5 días hábiles (sin urgencia legal) |
| Plazo de resolución | 7 días hábiles | 30 días hábiles |
| Output editorial | Rectificación visible en la ficha si procede + respuesta motivada | Diff editorial (commit) o archivo razonado de la idea + respuesta al aportante con resultado |
| Página pública | `/rectificar` | `/aportar` |

Si una persona se considera aludida y discrepa de algo publicado, su vía natural es la sección 6. Si la motivación es ampliar o corregir el inventario en general, su vía es la sección 6bis. Las páginas `/aportar` y `/rectificar` reflejan esta separación claramente al lector y enlazan entre sí cuando el aportante llega a la puerta equivocada.

### 6bis.2 Qué se acepta y qué no

**Tres carriles editoriales aceptados**, todos bajo la misma puerta:

1. **Pista a fuente o hito.** URL canónica de un documento oficial que falta en el inventario (sentencia, auto, BOE, informe institucional, cobertura periodística cruzada de una línea editorial no representada todavía). El aportante apunta dónde mirar; el agente verifica, descarga el primario si procede (norma [AGENTS.md → "Documentos primarios descargados"](AGENTS.md#documentos-primarios-descargados-a-publicdocumentos)), modela el `Documento` + `Hito` + `Hecho` correspondientes.
2. **Corrección fáctica menor.** Errata, fecha equivocada, órgano mal asignado, segundo apellido incorrecto, link roto a fuente, atribución de delito que no encaja con el auto. **No es rectificación legal (sección 6)**: no hay persona aludida defendiéndose; es un tercero que detecta un error neutro. Se procesa como diff puntual sobre el YAML afectado.
3. **Idea o sugerencia sobre el sitio.** Feature deseada, mejora de UX, observación editorial general, fuente que vale la pena vigilar en el futuro. No genera diff sobre `content/`; se archiva razonadamente en `docs/web/pages/<página>.md` o `docs/web/features/<feature>.md` según corresponda (convenciones de [AGENTS.md → "Backlog por página"](AGENTS.md#backlog-por-página-en-docsweb-pages) y [AGENTS.md → "Ficha por feature transversal"](AGENTS.md#ficha-por-feature-transversal-en-docsweb-features)), manteniendo trazabilidad de la sugerencia y de su trato editorial posterior.

**Qué NO se acepta depositar**:

- Documentos sometidos a secreto de sumario (art. 301 LECrim).
- Escritos de parte no notificados a terceros (art. 234 LOPJ).
- Información personal de terceros no investigados en el procedimiento (familiares, asesores externos sin rol formal, testigos no nombrados públicamente).
- Documentos procedentes de mirrors no auditables (Wuolah, Scribd, blogs personales sin cadena de custodia firmada), alineado con el aprendizaje del 2026-05-24 ya recogido en `AGENTS.md`.
- Material doxxing, denuncias falsas, contenido cuyo único propósito sea perjudicar a una persona o partido específicos sin valor procesal verificable. La lectura editorial es la habitual de "Presunción de inocencia: reglas de redacción": ¿hay procedimiento real con relevancia pública detrás, o solo intención de daño?

**Caso excepcional N3 `filtrado_verificado`**: cuando el primario debería existir y no está accesible aún (típicamente sentencia íntegra del TS antes de aparecer en CENDOJ, auto de procesamiento citado en notas CGPJ pero no publicado en `poderjudicial.es`), una pista del aportante con copia que dice ser fiel **no se publica como PDF en `/public/documentos/`**, pero la pista entra como señal interna; el agente la trata como N3 `filtrado_verificado` con triangulación documentada en `nivel_fuente_justificacion`, y eleva a N1 cuando aparezca el primario público (conservando hash histórico como prueba de fidelidad). Mecanismo ya previsto en [AGENTS.md → "Documentos primarios descargados"](AGENTS.md#documentos-primarios-descargados-a-publicdocumentos); sección 6bis lo conecta con el canal externo.

**Importante para el aportante**: el inventario **solo cita fuentes públicas verificables**. El aporte tiene valor editorial en tanto **ayuda a localizar y citar la fuente pública**, no como fuente en sí mismo. El aportante no figura como fuente de ningún `Hecho`; figura, si autoriza opt-in, como autor de la pista en el commit (ver apartado 6bis.5). Esto desactiva el riesgo LSSI de convertirnos en depositarios de material restringido y mantiene el rigor de niveles de fuente del modelo.

### 6bis.3 Canal y vías de entrada

- **Vía principal**: email a `aportar@presuntamente.org`, operativo vía Cloudflare Email Routing con reenvío a la cuenta personal del maintainer, mismo mecanismo que `contacto@` y `rectificacion@`.
- **Vía postal**: cuando esté operativo el apartado de correos del responsable (LSSI "Identificación del responsable" del aviso legal), se incluirá la dirección postal como alternativa aceptable para aportes formales (sentencias en papel, copias certificadas, denuncias anónimas tradicionales).
- **GitHub Issues** (`.github/ISSUE_TEMPLATE/sugerencia-fuente.yml`): se mantiene como cauce técnico interno para contribuyentes que ya operan en GitHub. **No se publicita en el sitio público**: la barrera de entrada (cuenta GitHub, exposición pública del aporte) es hostil para el perfil de aportante que queremos atraer (funcionarios, periodistas con fuentes, juristas que prefieren no firmar).

El sitio público presenta el cauce con tres entradas visibles: página dedicada `/aportar` (hermana de `/rectificar`); CTA en "Cómo se ha redactado esta ficha" de cada caso, al lado del CTA de rectificar; link permanente en el footer; y un módulo institucional discreto en la home invitando al aporte. Detalle de implementación visual en `docs/web/pages/aportar.md` cuando se construya la página.

### 6bis.4 Tratamiento de datos del aportante (RGPD)

Base jurídica para el tratamiento del email entrante del aportante: **interés legítimo (art. 6.1.f RGPD)**, equivalente al de sección 6. Principios aplicados:

- **Minimización**: el maintainer extrae del email el contenido editorial (pista, corrección, idea) y lo vuelca a un fichero interno `content/aportes/YYYY-MM-DD-<slug>.md` (excluido del build público, mismo tratamiento que `content/casos/<slug>/NOTES.md`). Los headers identificativos del email del aportante (`From`, `Reply-To`, IP, metadatos del cliente de correo) **no se versionan** en el repo; quedan únicamente en la bandeja personal del maintainer.
- **Limitación del plazo**: el email entrante se conserva en la bandeja del maintainer hasta cerrar el aporte (commit + respuesta enviada). Salvo consentimiento expreso del aportante para archivo (ver apartado 6bis.5), se elimina entonces.
- **Derechos del afectado**: el aportante puede en cualquier momento solicitar supresión de los datos asociados a su aporte (art. 17 RGPD) sin afectar al diff editorial ya commiteado, que cita la fuente pública verificada, no al aportante (salvo opt-in).

### 6bis.5 Acreditación del aportante en el commit

**Default: anónimo.** El commit cita la fuente verificada (URL canónica, BOE, sentencia en CENDOJ), no al aportante. Esto es la postura natural por dos razones convergentes: (a) protege al aportante con vínculos institucionales sensibles (funcionarios, periodistas que no quieren quemar fuentes); (b) refuerza el principio editorial de que las afirmaciones del inventario se sostienen en sus documentos públicos, no en quien las apuntó.

**Opt-in opcional**: si el aportante pide explícitamente ser acreditado, el commit incluye un trailer convencional:

```
Aporte-externo: <nombre o medio, según autorización>
```

Ejemplos posibles: `Aporte-externo: Periodista de medio X (autorizado)`, `Aporte-externo: Profesor de derecho penal Universidad Y (autorizado)`. La acreditación nunca menciona la dirección de email, datos de contacto ni información identificativa adicional más allá de lo que el aportante autoriza por escrito en el email original.

**Nunca acreditamos a un aportante sin consentimiento documentado**, ni siquiera cuando el aporte resulta especialmente valioso. La trazabilidad pública del aporte vive en el git log; quien firmó la pista solo aparece si así lo pidió.

### 6bis.6 Proceso post-recepción

1. **Recepción**: el email aterriza en `aportar@presuntamente.org` → reenviado al Proton del maintainer.
2. **Volcado**: el maintainer crea `content/aportes/YYYY-MM-DD-<slug>.md` con el contenido editorial del email (sin headers identificativos salvo opt-in expreso). Esta es la única intervención manual obligatoria del maintainer; el fichero queda fuera del build público.
3. **Procesado por agente** con la skill `/incorporar-aporte` (placeholder en `.agents/skills/` hasta su implementación, alineada con `/investigar-caso` y `/incorporar-hito` ya planeadas). La skill lee el fichero, clasifica el tipo y aplica el flujo correspondiente:
   - **Fuente o hito** → investigación según [AGENTS.md → "División de trabajo"](AGENTS.md#división-de-trabajo-maintainer--agente) y guardarraíles de `/investigar-caso` (cruce con fuentes públicas, lista blanca de dominios oficiales, niveles de fuente, V-12), modelado de `Documento` + `Hito` + `Hecho` derivados, diff propuesto en el working tree del worktree.
   - **Corrección fáctica** → verificación del dato contra fuentes públicas, diff puntual sobre el YAML afectado, con corrección por `corregido_por` cuando el cambio sea editorialmente sustantivo (no para errata mecánica).
   - **Idea** → archivo razonado en `docs/web/pages/<página>.md` o `docs/web/features/<feature>.md` según corresponda, sin diff sobre `content/`. La idea queda documentada con su contexto y con valoración editorial inicial (encaja con principios, requiere reflexión, choca con regla X).
4. **Revisión y commit por el maintainer** según workflow de [AGENTS.md → "Workflow de rama y PRs"](AGENTS.md#workflow-de-rama-y-prs). El commit lleva trailer `Aporte-externo:` si el aportante autorizó acreditación.
5. **Respuesta al aportante** con borrador preparado por la skill: qué se incorporó, qué no y por qué, link al commit cuando aplique. Cierra el bucle editorial.

El paso 3 es el único que requiere un agente activo; los pasos 1, 2, 4 y 5 son operaciones del maintainer (recepción, volcado, revisión y envío). Coherente con la división de trabajo "el maintainer aporta operaciones, no conocimiento".

### 6bis.7 Plazos comprometidos públicamente

- **Acuse de recibo**: 5 días hábiles. Distinto de las 48 horas de sección 6 porque sección 6bis no tiene obligación legal LO 2/1984; lo que comprometemos es respeto al aportante, no plazo legal.
- **Resolución**: 30 días hábiles. Suficiente para que el agente investigue el aporte con calma y para que el maintainer revise sin presión. Si el aporte es trivial (corrección fáctica clara, link roto), suele resolverse en horas; si requiere triangulación o búsqueda profunda de cobertura cruzada puede acercarse al límite.
- **Aportes que no resultan en cambio editorial**: se responden igual, motivadamente, citando por qué la pista no encaja con los criterios del inventario (fuente no auditable, no relevante a un caso vivo, ya recogida, fuera del alcance editorial del sitio, etc.). El aportante recibe respuesta siempre que haya facilitado contacto.

### 6bis.8 Trazabilidad pública

Los commits derivados de aportes externos son indistinguibles de los commits ordinarios del maintainer en el git log, **salvo por la presencia del trailer `Aporte-externo:` cuando el aportante autorizó acreditación**. El git log es así el changelog público del inventario y a la vez el reconocimiento honesto de que ciertas piezas vienen de manos externas.

No se mantiene un "registro público de aportes" con estadísticas (cuántos aportes, de qué tipo, cuántos rechazados). Esa métrica sería editorialmente irrelevante para el lector y podría incentivar el aporte como vanidad. Internamente sí se conservan los ficheros `content/aportes/YYYY-MM-DD-<slug>.md` en el repo (excluidos del build) como histórico para auditoría editorial y para futura constatación si llegara a haber disputa.

---

## 7. Identificación del responsable: anónimo vs identificado {#7-identificación-del-responsable-anónimo-vs-identificado}

Análisis claro:

**Opción A — Responsable identificado** (tú, con nombre y apellidos, con identificación a efectos LSSI):
- Cumple LSSI art. 10 (deber de identificación del prestador).
- Es la postura defendible si llega querella o requerimiento formal: hay responsable, hay canal.
- Facilita confianza del lector y de medios que vayan a citar el sitio.
- *Riesgo personal:* exposición a presiones legales y, en menor medida, a hostigamiento. En España es manejable si la línea editorial es rigurosa.

**Opción B — Responsable anónimo o seudónimo:**
- **No cumple LSSI.** Es infracción técnica usable en tu contra en eventual disputa civil.
- Erosiona la confianza del proyecto. ¿Quién se hace responsable de la información?
- Cualquier querella se dirige al hosting o al registrador del dominio, que tendrá tus datos por whois — el anonimato es ficticio.
- No protege legalmente; sí frente a hostigamiento difuso, pero a precio alto en credibilidad.

**Opción C — Persona jurídica (asociación o fundación):**
- Una asociación sin ánimo de lucro como responsable. La asociación es la prestadora del servicio.
- Distribuye responsabilidad (junta directiva, no una persona).
- Requiere constitución formal: estatutos, registro, número de asociados, NIF de asociación, contabilidad.
- Apto para crecer el proyecto a algo más comunitario.

**Recomendación:**

- **MVP y primer año: opción A** (tú, identificado). Es la postura más alineada con el objetivo del sitio (transparencia) y la única que cumple LSSI sin malabares.
- **Cuando el proyecto crezca: migrar a opción C**. Una asociación recibe el testigo. Da paraguas legal a colaboradores y permite recibir donaciones de forma limpia.
- **NUNCA opción B.**

---

## 8. Disclaimer recomendado (borrador, revisar con abogado antes de producción) {#8-disclaimer-recomendado-borrador-revisar-con-abogado-antes-de-producción}

Para el pie de cada ficha y para una sección `/aviso-legal`:

> **Aviso legal y editorial**
>
> presuntamente.org es un sitio de información ciudadana que recoge y estructura información pública sobre procedimientos judiciales relevantes en España. No es un medio de comunicación tradicional ni un órgano oficial.
>
> Toda persona mencionada en este sitio como investigada, procesada, acusada o relacionada con un procedimiento penal en curso **se presume inocente** hasta que recaiga sentencia firme condenatoria. La inclusión de su nombre en una ficha responde exclusivamente al hecho de que figura formalmente en un procedimiento de relevancia pública, no a una valoración de culpabilidad.
>
> Las afirmaciones de cada ficha están categorizadas según su estado epistémico (acreditadas, bajo investigación, atribuidas por un actor identificado, exculpatorias, desmentidas) y cada afirmación cita la fuente y nivel de fuente que la sostiene.
>
> Cualquier persona que se considere afectada por una información publicada puede solicitar su rectificación en `presuntamente.org/rectificar` o por correo a `rectificacion@presuntamente.org`. Las solicitudes se atienden en los plazos descritos en nuestra política editorial.
>
> Responsable del sitio a efectos de LSSI: **[Nombre y apellidos del maintainer; identificación completa]**.
>
> El contenido editorial de este sitio se publica bajo licencia **CC BY-SA 4.0** (propuesta). El código que lo genera está disponible públicamente bajo **AGPL-3.0**.

Revisar con abogado antes de publicar.

---

## 9. Acciones técnicas y editoriales mitigadoras (consolidado) {#9-acciones-técnicas-y-editoriales-mitigadoras-consolidado}

Trazabilidad de mitigaciones del proyecto a sus riesgos legales:

| Riesgo | Mitigación | Doc |
|--------|------------|-----|
| Imputación tratada como condena | Separar `tipo` de Hecho + `RolEnCaso` temporal | 01 (apartados 2.4, 2.6) |
| Persona desimputada que sigue como "imputada" | `RolEnCaso` con `fecha_fin`; `Hecho` con `corregido_por` | 01 (apartados 2.4, 2.6) |
| Persona privada expuesta innecesariamente | `es_figura_publica` flag + V-17 | 01 (apartado 2.2), V-17 |
| Cita ambigua | Documentos con nivel obligatorio | 01 (apartado 2.7), V-04 a V-13 |
| Afirmación sin fuente | V-04 a V-13 bloqueantes | 01 (apartado 4) |
| Información obsoleta | `ultima_revision_editorial` + revisión periódica | 03 (apartado 5) |
| Rectificación no atendida | Mecanismo documentado con plazos | 04 (apartado 6) |
| Línea editorial sesgada | Curador único con guía editorial pública + apertura a contribuciones revisadas | conv. brief |
| Lenguaje editorial agresivo | Lista negra de adjetivos + revisión humana | 02 P-09 |
| Identificación del responsable | Maintainer identificado, LSSI completa | 04 (apartado 7) |
| Eliminación silenciosa de información | Git log público | 03 (apartado 0) |

---

## 10. Cómo responder a una querella o requerimiento formal {#10-cómo-responder-a-una-querella-o-requerimiento-formal}

Procedimiento de emergencia:

1. **No editar ni borrar nada de inmediato.** Capturar el contenido afectado en su estado actual (commit + tag + archive externo).
2. **Acuse de recibo** al solicitante en 24-48 horas.
3. **Buscar abogado de derecho al honor / libertad de información** si no se tiene uno asignado. Una hora de consulta cuanto antes.
4. **Evaluar la afirmación cuestionada** con el material del modelo: ¿qué `tipo` de Hecho es? ¿Qué Documentos lo respaldan? ¿Hay margen para mejorar la redacción sin retirarla?
5. **Tres respuestas posibles**:
   - Rectificación o matización (si está justificada).
   - Sostenimiento motivado con cita exhaustiva (si la información es sólida).
   - Retirada provisional mientras se resuelve.
6. **Documentar todo el intercambio** públicamente si el solicitante consiente; resumido si no.

**Plan de contención del peor caso:** si llega demanda civil con medida cautelar de retirada, cumplir con la cautelar inmediatamente y litigar después. No es ceder; es ganar tiempo y no acumular sanciones.

---

## 11. Ética {#11-ética}

Más allá de lo legal, criterios éticos del proyecto:

- **No exponer familiares no implicados.** Aunque la prensa popularice menciones, nosotros no las publicamos.
- **No publicar direcciones, teléfonos, datos personales** que no añadan al entendimiento del caso.
- **No publicar imágenes humillantes**, ni siquiera de figuras públicas, salvo que sean parte indispensable del relato (raro).
- **Respetar el luto.** Si un investigado fallece sin sentencia firme, la ficha se mantiene pero se actualiza con Hito de fallecimiento y un cambio de tono editorial (presente de indicativo → pasado descriptivo). Las imputaciones no se "borran" por fallecimiento, pero se contextualiza que el procedimiento se extingue.
- **Reconocer errores propios.** Si el sitio publicó algo mal, anotarlo visiblemente, no enterrarlo.
- **No celebrar.** El sitio no celebra ni una imputación ni una absolución. Las informa.

---

## 12. Cuestiones abiertas {#12-cuestiones-abiertas}

1. **Asesoría legal recurrente o sólo a demanda.** Razonable contratar 1-2h al año de revisión preventiva y dejar el resto a demanda.
2. **Seguro de responsabilidad civil** para medios pequeños existe. Coste anual razonable; vale la pena explorar.
3. **Política de donaciones.** Si llegan, ¿se aceptan en MVP? ¿Anónimas? Riesgo de instrumentalización. Propuesta: NO aceptar en MVP; abrir vía asociación cuando exista (opción C).
4. **Política de inclusión de imágenes.** Sólo CC o dominio público; nunca scrapping de medios. Definir lista de bancos aceptados (Wikimedia Commons, Pexels, Unsplash con verificación de licencia).
5. **Relación con periodistas.** ¿Se acepta cita a ficha? Sí, con la licencia CC BY-SA. ¿Se les responde si piden información extra? Propuesta: dirigirles al repo público, no responder consultas privadas en MVP.

---

## 13. Siguiente paso {#13-siguiente-paso}

Doc 05 — Arquitectura técnica.
