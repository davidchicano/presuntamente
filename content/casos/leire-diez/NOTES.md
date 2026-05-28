# NOTES internas — caso leire-diez

> Este fichero es **uso interno**: no se publica en el sitio.
> Contiene decisiones de modelado, discrepancias, riesgos editoriales y pendientes para PR2+.

## Decisiones de modelado tomadas en PR1

### Estructura dual del procedimiento
El caso tiene dos piezas con órganos distintos:
- **Pieza A** (principal): JCI nº 5 AN, magistrado Santiago Pedraz. El `caso.yaml` apunta a este órgano como `organo_judicial_id` ya que es el procedimiento de mayor alcance y relevancia editorial.
- **Pieza B**: JI nº 9 Madrid, magistrado Arturo Zamarriego. Se menciona en la descripción y en los hechos, pero no se modela como `caso_padre_id`/`caso_hijo_id` en PR1. Pendiente: evaluar si merece modelado como pieza separada o como hito dentro del mismo caso.

### fecha_apertura
Se usa `2025-05-01` (precisión mes) coincidiendo con la publicación de los audios de El Confidencial, que es el hecho verificable más temprano del que tenemos fuente. La apertura formal de diligencias ante el JI nº 9 fue posterior (mayo-junio 2025, no localizado exactamente). La causa ante JCI nº 6 se abrió antes de las detenciones de diciembre 2025.

### No-inclusión de personas "mencionadas sin imputación formal"
Según el brief: Juan Manuel Serrano Quintana (expresidente Correos) y Juan Francisco Serrano Martínez (diputado PSOE) son **mencionados** en fuentes pero sin imputación formal confirmada. No se modelan como `RolEnCaso`. El schema no tiene rol `mencionado`. Pendiente: si aparece fuente oficial que confirme imputación, crear personas y roles.

### Carmen Pano — persona privada sin rol procesal confirmado
La empresaria Carmen Pano aparece en el auto Pedraz como tercera persona a quien presuntamente se ofreció dinero para modificar declaración. No tiene rol procesal formal como investigada o acusada; es víctima potencial de un acto de obstrucción. **No se modela en PR1** conforme a los principios de privacidad (AGENTS.md). Si en PR2 aparece fuente que confirme su personación en el procedimiento (denuncia, declaración ante el JCI), revisar con cuidado aplicando V-17.

### Pere Rusiñol — verificar antes de incluir
El brief menciona a Pere Rusiñol (periodista) pero sin indicar si está imputado ni en qué pieza. **No se incluye en PR1**. Pendiente verificar si tiene rol procesal formal antes de incorporarlo.

### Santos Cerdán — perfil nuevo
Santos Cerdán no existía en el inventario. Se crea en PR1. Tiene rol de investigado en el caso Koldo (TS) que debe modelarse en ese caso cuando se amplíe. No se añade al caso Koldo en esta sesión para no contaminar.

### Ismael Oliver — rol en Koldo
Ismael Oliver es defensor de Koldo García en el caso Koldo. Se anota en sus `notas` de rol. En PR1 no se modela su rol en el caso Koldo (es tarea del caso Koldo, no de esta sesión).

### delitos_atribuidos_en_la_causa
Los slugs de delito usados en `caso.yaml` (`cohecho`, `trafico-de-influencias`) existen en `content/delitos/`. El slug `financiacion-irregular` NO existe. En el `caso.yaml` se marcó como LLM-incierto. Para los roles individuales se usaron los delitos más próximos disponibles. Pendiente: revisar qué delitos exactos aparecen en el auto Pedraz cuando se localice el primario oficial.

### nivel_relevancia_editorial: capital
Justificación: afecta presuntamente a la financiación de un partido de gobierno (PSOE), implica presuntas acciones de obstrucción a la justicia, y su desarrollo (registro Ferraz, UCO en sede del partido mayoritario en el gobierno) tiene repercusión nacional de primer orden. El nivel `capital` es coherente con otros casos del inventario (FGE, Begoña Gómez).

### Relación con caso plus-ultra: NO modelada
El brief indica explícitamente que la confluencia mediática del 27-may-2026 con Plus Ultra es coincidencia de actualidad, no vínculo procesal. Confirmado: no se modela ninguna conexión con plus-ultra.

### Organización El Confidencial
No existía en el inventario. Se crea en PR1 como `medio_comunicacion` con `naturaleza_editorial: generalista_politico` pero sin `orientacion_editorial_declarada` (no se dispone de cita verificable de autoadscripción; requiere investigación adicional).

---

## Riesgos editoriales activos

1. **Polarización política elevada**: el caso afecta directamente a la cúpula del PSOE (partido en el gobierno a fecha 2026-05-28). Aplicar con especial rigor el guardarraíl de neutralidad (P-10). Ningún comentario editorial sobre partidos; solo hechos y roles procesales con fuente.

2. **Sumario bajo secreto**: la pieza A está bajo secreto sumarial a fecha 2026-05-28. El único material disponible es el auto publicado íntegro por El Lliberal Cat (N3 filtrado_verificado) y la cobertura periodística cruzada (N4). Riesgo: el contenido del auto divulgado por el medio podría no ser completo o podría estar sujeto a disputa sobre su autenticidad. Anotar: hasta que aparezca la nota oficial CGPJ o el auto en CENDOJ, el nivel máximo para los hechos derivados es N3.

3. **Carmen Pano — persona privada**: si en PR2 se decide incluirla, aplicar V-17 (revisión de anonimización) antes de publicar.

4. **Fecha exacta de detención**: el brief y la prensa cruzada apuntan a diciembre 2025 sin fijar el día exacto. Se usó `2025-12-10` como estimación. Verificar contra fuentes cruzadas adicionales antes de PR2.

5. **Número de procedimiento**: ni la pieza A ni la pieza B tienen número de diligencias previas confirmado públicamente. `numero_procedimiento` no se incluye en `caso.yaml`. Pendiente.

---

## Pendientes para PR2+

- [ ] Localizar nota oficial CGPJ sobre el auto Pedraz del 26-may-2026. Si existe, elevar `el-lliberal-cat-auto-pedraz-integro-2026-05-27` a N1 o crear nuevo documento N1 CGPJ y actualizar `documento_principal_id` del hito `auto-pedraz-pieza-separada-2026-05-26`.
- [ ] Localizar auto JCI nº 6 diciembre 2025 (origen de las detenciones). Si es accesible, crear documento y actualizar hito `detencion-leire-diez-2025-12-10`.
- [ ] Confirmar número de diligencias previas de la pieza A (JCI nº 5) y de la pieza B (JI nº 9 Madrid).
- [ ] Confirmar fecha exacta de la detención de diciembre 2025 (actualmente `2025-12-10`, estimada).
- [ ] Verificar delitos exactos atribuidos en el auto JCI nº 6 dic-2025 (usados en roles de Díez, Fernández Guerrero y Alonso).
- [ ] Verificar delitos exactos imputados por el auto Pedraz 26-may-2026 a cada investigado.
- [ ] Modelo de Santos Cerdán en el caso Koldo: cuando se amplíe ese caso, añadir su rol allí; su ficha de persona ya existe en el inventario tras PR1 de leire-diez.
- [ ] Rol de Ismael Oliver como defensa en caso Koldo: modelar en ese caso (ya existe su ficha de persona).
- [ ] Pere Rusiñol: verificar si tiene rol procesal formal antes de incluir.
- [ ] `url_canonica` exactas de los documentos N4 (actualmente apuntan a raíces de medios): completar con URLs de artículos específicos y ejecutar `pnpm archive:catchup -- --caso=leire-diez`.
- [ ] Descarga primario auto Pedraz cuando aparezca en CENDOJ o se localice fuente oficial: archivo a `/public/documentos/leire-diez/auto-pedraz-jci5-2026-05-26.pdf` con `hash_sha256`.
- [ ] Evaluar si la pieza B (JI nº 9 Madrid) merece modelado como caso hijo `leire-diez/pieza-jm9` o si se mantiene integrada en el caso raíz.
- [ ] Vinculos institucionales (`/documentar-vinculos`): PSOE como organización directamente afectada; SEPI como ámbito del acto presuntamente irregular.
- [ ] Modelo del magistrado Arturo Zamarriego (JI nº 9 Madrid, pieza B): crear persona y rol `juez_instructor` cuando se confirme el número de procedimiento.
