# NOTES — Caso Begoña Gómez

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en `AGENTS.md` § *NOTES.md por caso*.

Última actualización: 2026-05-22 (PR1 — primer caso de arranque con la skill `/investigar-caso` v0).

---

## Por qué este caso entra el segundo

Decidido en el cierre de la sesión 2026-05-22 (ver `ROADMAP.md`): el caso testea trayectoria con **desimputaciones y sobreseimientos parciales**, que Plus Ultra (el caso 0) no tiene. En concreto, este PR1 ya contiene dos cierres de trayectoria que validan el modelo:

1. La Audiencia Provincial de Madrid **desimputa al rector de la UCM Joaquín Goyache** el 16 de mayo de 2025. Se modela como `Hito(tipo=desimputacion)` + `RolEnCaso(rol=investigado, fecha_fin=2025-05-16, hito_fin_id=...)` + `RolEnCaso(rol=desimputado, fecha_inicio=2025-05-16, hito_origen_id=...)` + `Hecho(tipo=exculpatorio)`.
2. El propio auto de cierre de instrucción del 13 de abril de 2026 **archiva el delito de intrusismo profesional** contra Begoña Gómez por falta de indicios sólidos, manteniendo los otros cuatro delitos. Se modela como `Hecho(tipo=exculpatorio)` (no se crea un `Hito(tipo=sobreseimiento_libre)` separado porque el archivo del delito es accesorio al hito principal del auto, y el procedimiento no se archiva: continúa por los otros cuatro delitos).

Ambos cierres dejan en pie la presunción de inocencia y las trayectorias procesales se exhiben con los slots existentes del modelo.

## Estado editorial — PR1

- **caso.yaml** raíz creado.
- **5 personas** con rol procesal formal: Begoña Gómez, Juan Carlos Peinado (juez instructor), Cristina Álvarez (asesora Moncloa), Juan Carlos Barrabés (empresario), Joaquín Goyache (rector UCM, desimputado).
- **8 organizaciones**: 5 nuevas (JI nº 41 Madrid, Audiencia Provincial de Madrid, Universidad Complutense de Madrid, Hazte Oír, Fiscalía Provincial de Madrid) + 1 reutilizada (Manos Limpias del caso Plus Ultra) + 5 medios (Maldita.es, El Español, Moncloa.com, TheObjective, Noticias de Navarra) — `infobae` ya existía.
- **2 delitos nuevos del catálogo**: corrupción en los negocios, apropiación indebida. Reutilizados: tráfico de influencias y malversación de caudales públicos.
- **8 documentos**: 2 autos judiciales (auto procesamiento JI 41 del 13-abr-2026; auto AP Madrid desimputación Goyache del 16-may-2025; ambos N4 por ausencia de URL oficial localizable, citados vía cobertura cruzada V-13), 6 artículos N4 en líneas editoriales distintas (Maldita.es, Infobae apertura, Infobae procesamiento, El Español procesamiento, TheObjective Fiscalía archivo, Moncloa.com desimputación-perjudicada UCM, Noticias de Navarra coste software).
- **5 hitos**: denuncia Manos Limpias (08-abr-2024), imputación Barrabés (19-jul-2024), desimputación Goyache (16-may-2025), imputación Cristina Álvarez (18-ago-2025), auto procesamiento Peinado (13-abr-2026).
- **6 hechos**: 4 `atribuido` (cátedra TSC en UCM; carta de recomendación a Barrabés en 2020; coste software 113.509€ — factual UCM; posición de la Fiscalía a favor del archivo a lo largo del procedimiento) + 2 `exculpatorio` (archivo del intrusismo profesional; desimputación del rector Goyache).
- **11 roles**: 4 pares investigada→procesada (Begoña, Cristina, Barrabés todos cerrados como investigado por el procesamiento del 13-abr-2026); 1 par investigado→desimputado (Goyache); juez instructor Peinado; denunciante Manos Limpias; acusación popular Hazte Oír.

## Pendiente para PR2 y siguientes

- **Archive.org / archive.ph mirrors** para los 6 documentos N4 nuevos. WebFetch no puede llamar a archive.org desde el entorno del agente; el maintainer debe lanzar el archivado y completar `url_archivo`. Mirror obligatorio para fuentes N4 según doc 01 §3.
- **Localización de nota CGPJ del auto del 13-abr-2026** en `poderjudicial.es`. Cuando aparezca, sustituir `documento_principal_id` del hito por el documento oficial y subir `nivel_fuente` a 1.
- **Texto íntegro del auto procesamiento** en CENDOJ (39 páginas según El Independiente). Cuando se publique, citar pasajes concretos en los hechos derivados con `pasaje`.
- **Auto de incoación del 16-abr-2024** del JI nº 41 de Madrid. La cobertura periodística describe su contenido pero el texto no está accesible públicamente. Pendiente.
- **Denuncia íntegra de Manos Limpias** (08-abr-2024). Maldita.es publica una explicación detallada con citas literales; el escrito íntegro no se ha localizado publicado en un repositorio fiable. Si aparece publicado íntegro en un medio identificable, podría subirse el `nivel_fuente` a 3 (filtrado_verificado).
- **Hito específico de imputación de Joaquín Goyache** (anterior a la desimputación de 2025-05-16). La fecha exacta del auto que lo elevó a investigado pendiente de localizar. El rol `goyache-investigado` apunta provisionalmente al hito de la denuncia inicial (origen del procedimiento) en lugar de a un hito propio, hasta que se localice fuente.
- **Acusaciones populares adicionales**: además de Manos Limpias (denunciante) y Hazte Oír (modelada en PR1), se han personado Vox, Iustitia Europa y el Movimiento de Regeneración Política de España. Modelarlas en PR2 con sus respectivos roles y, si procede, organizaciones nuevas.
- **Recurso de la Fiscalía** ante la Audiencia Provincial contra el auto del 13-abr-2026: hito propio en PR2 (`recurso_apelacion`) cuando se confirme fecha y vía de presentación.
- **Resoluciones de la Audiencia Provincial de Madrid** del 23 de febrero de 2026 (anulación de los autos previos que abrían vía a jurado popular): hito propio en PR2 cuando se localice el auto o nota institucional.
- **UCM personada como perjudicada (06-oct-2025)**: rol propio `perjudicada` (sujeto_tipo=organizacion) — pendiente de verificar que V-11 admita el rol "perjudicada" como rol de parte; si no, dejarlo como hito y mencionar en el caso. **Comprobación previa al PR2.**

## Discrepancia de fecha de apertura

Wikipedia indica como fecha de inicio **24-abr-2024** (presumiblemente la fecha pública del conocimiento del auto). Infobae y Maldita.es coinciden en **16-abr-2024** como fecha del auto de incoación de diligencias previas, tras denuncia presentada el **08-abr-2024**. Se adopta:

- `Caso.fecha_apertura = 2024-04-16` (incoación formal del procedimiento por el juez).
- `Hito(denuncia_presentada) = 2024-04-08` (presentación de la denuncia por Manos Limpias).

## Personas con rol procesal NO modeladas en PR1

Decisiones editoriales aplicadas:

- **Pedro Sánchez** (presidente del Gobierno): compareció como testigo el 22-jul-2024 acogiéndose a su derecho a no declarar. Aunque el rol "testigo" existe en el modelo, no se le crea ficha en PR1 — su rol procesal es accesorio al caso (testigo) y editorialmente entra en la categoría de "familiar de implicada con rol no imputador". Se menciona como contexto en la biografía corta de Begoña Gómez y en la descripción del caso (relación de la investigada como esposa del Presidente del Gobierno). Si futuras resoluciones le atribuyen otro rol procesal, se revisa.
- **Vicerrectores y exvicerrectores de la UCM** que han declarado como testigos (Juan Carlos Doadrio y otros): no se les crea ficha hasta que un auto les atribuya rol distinto de testigo.
- **Víctor de Aldama** (mencionado en la denuncia inicial por su presencia en reuniones de Globalia): no es investigado en este procedimiento; su rol procesal pertenece a otra causa (caso Koldo). Fuera del inventario aquí.

## Verbos del doc 04 §3 aplicados

- "Consta en el auto…", "el instructor considera indiciariamente que…", "se atribuye…", "según la Fiscalía…", "la Audiencia Provincial considera que no concurren indicios racionales de criminalidad…".
- Final explícito de presunción de inocencia en cada rol activo de imputación/procesamiento ("rige el principio de presunción de inocencia mientras no recaiga resolución firme en contrario").

## Fuentes consultadas para PR1

Multi-línea editorial (≥ 2 líneas editoriales por hito). Verificación cruzada.

- Maldita.es — explicación de la denuncia de Manos Limpias.
- Infobae — apertura de diligencias (24-abr-2024) y procesamiento (13-abr-2026).
- El Español — procesamiento (13-abr-2026), testigos del juicio.
- Libertad Digital — procesamiento (13-abr-2026), prueba software UCM.
- TheObjective — recurso de la Fiscalía pidiendo archivo (22-abr-2026).
- Moncloa.com — UCM de imputados a perjudicados (13-oct-2025).
- Newtral.es — perfil de Goyache.
- Noticias de Navarra — coste software UCM (23-ene-2026).
- Wikipedia (es) — Caso Begoña Gómez y Juan Carlos Peinado (sólo para verificar fechas y biografías; nunca como soporte único de hecho).

URLs específicas en cada `Documento` que las cita, conforme al modelo.

## Avisos para el LLM en futuras incorporaciones

- **Nunca redactar a Begoña Gómez como culpable.** Verbos prohibidos del doc 04 §3. Hasta sentencia firme, sólo "se investiga", "se atribuye", "consta en el auto de Peinado que…", "el instructor considera indiciariamente que…".
- **El procedimiento NO está archivado.** El archivo del 13-abr-2026 sólo afecta al delito de intrusismo profesional. Por los otros cuatro delitos sigue adelante hacia Tribunal del Jurado.
- **Pedro Sánchez NO es investigado** ni procesado en esta causa. Mencionarlo sólo como contexto (esposo de la investigada / presidente del Gobierno).
- **Joaquín Goyache es DESIMPUTADO.** Su rol vigente es `desimputado` desde el 16-may-2025 por resolución de la Audiencia Provincial de Madrid. Cualquier redacción posterior debe respetarlo expresamente.
- **Tratamiento sin cuota política.** El caso afecta a una familia cercana al gobierno actual. La P-10 del doc 02 obliga a aplicar exactamente la misma estructura, badges y tono que a cualquier otro caso del inventario.
- **Familiares no implicados** (en particular cualquier referencia a otros miembros de la familia Sánchez-Gómez): fuera del inventario salvo que un auto les atribuya rol procesal formal. Doc 04 §11.
