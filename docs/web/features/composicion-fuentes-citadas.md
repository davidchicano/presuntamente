# Composición de fuentes citadas

> Archivos clave: [`schemas/organizacion.schema.json`](../../../schemas/organizacion.schema.json) (campos editoriales) · [`docs/diseno/07-clasificacion-editorial-medios.md`](../../diseno/07-clasificacion-editorial-medios.md) (metodología canónica) · Pendiente de UI · Relacionada con [`cobertura-mediatica-general.md`](cobertura-mediatica-general.md).

## Qué hace

Muestra, para cada ficha de caso, la distribución de las fuentes periodísticas N4 que presuntamente.org ha usado como respaldo editorial.

## Para qué sirve

Da transparencia al lector sobre la materia prima periodística de la ficha. No mide el comportamiento de todo el ecosistema mediático; mide la composición de las fuentes citadas por el inventario.

Sirve también como autocontrol editorial: si una ficha se apoya casi siempre en un mismo tipo de medio, el propio sitio lo hace visible y empuja a buscar cobertura cruzada antes de dar el caso por suficientemente trabajado.

## Cómo funciona

Se deriva de datos ya existentes en el modelo:

- `Documento.nivel_fuente: 4` identifica cobertura periodística.
- `Documento.productor_organizacion_id` apunta al medio productor cuando éste ya está modelado.
- `Organizacion.tipo: medio_comunicacion` identifica que la organización es un medio.
- `Organizacion.naturaleza_editorial` separa medios generalistas del eje político de verificadores, servicio público, especializados.
- `Organizacion.orientacion_editorial_declarada` / `orientacion_editorial_percibida` permiten agrupar los `generalista_politico` y `confesional` en el eje.
- `Organizacion.grupo_editorial` aparece en el tooltip por medio, no en la barra.

La ficha de caso agrega sólo los documentos periodísticos efectivamente usados por sus hitos/hechos/documentos de respaldo. El resultado se renderiza como distribución y conteo, no como juicio editorial.

**Distinción con cobertura mediática general:** esta feature mide las N4 que presuntamente.org cita; [`cobertura-mediatica-general.md`](cobertura-mediatica-general.md) mide la muestra rastreada de noticias sobre el caso. Ambas reutilizan **exactamente la misma clasificación de medios** (canon en [`docs/diseno/07-clasificacion-editorial-medios.md`](../../diseno/07-clasificacion-editorial-medios.md)), pero la barra y el copy dejan claro qué corpus miden.

## Estado actual

**Modelo cerrado el 2026-05-26.** Schema patch + canon metodológico aplicados; la ficha agregadora en la UI está pendiente. El mantenimiento de datos editoriales ya cubre 13 medios con orientación percibida CIS 3511 en `main`; la próxima sesión de UI entregará esta barra junto con la hermana de cobertura general.

La idea anterior del ROADMAP hablaba de "barómetro de sesgo mediático"; tras la discusión del 2026-05-25 + 26 queda dividida en:

- Esta feature: composición de fuentes citadas por presuntamente.org (corpus probatorio N4).
- [Cobertura mediática general](cobertura-mediatica-general.md): investigación externa sobre la muestra rastreada de noticias publicadas sobre el caso.

## Decisiones editoriales y aprendizajes

- **No llamarlo sesgo en la UI.** Con el corpus de documentos citados sólo podemos afirmar cómo se compone nuestra ficha, no cómo se comporta "la prensa" en general.
- **Separar fuente citada de noticia existente.** Un artículo puede existir y no estar citado porque no aporta dato nuevo, porque replica agencia, porque es redundante o porque no supera el criterio editorial.
- **`sin_clasificar` es legal y frecuente.** Forzar orientación a todos los medios daría falsa precisión. La franja gris en la barra es información, no fallo.
- **La orientación necesita fuente externa o autoadscripción literal.** No intuición del maintainer ni del agente. Cada valor lleva cita + URL en el YAML.
- **No mide veracidad.** Una barra más alta de un eje editorial no significa que ese eje tenga razón ni que manipule; sólo indica presencia en la ficha.
- **Verificadores y especializados quedan fuera del eje.** `Organizacion.naturaleza_editorial` los separa visualmente en franjas propias, no se cuentan como "sin clasificar" en el eje político.
- **Toggle declarada · percibida.** Cuando las dos dimensiones existen para un medio, la UI permite alternarlas. Cuando divergen, eso es información valiosa, no un problema a resolver.

## Ideas futuras

### v1 pre-launch

- Agregado por caso de documentos N4 citados, agrupados por `naturaleza_editorial`.
- Bloque discreto en ficha de caso: "Fuentes periodísticas citadas".
- Nota metodológica visible junto al bloque, con enlace al doc 07.

### v1.x

- Filtro por periodo del caso.
- Distinguir documentos N4 que respaldan hechos frente a documentos N4 sólo contextuales.
- Vista agregada en `/cifras` con composición global del inventario.

### Sin compromiso

- Export JSON/CSV de fuentes citadas por caso.
- Señal interna en `revisar-caso` si una ficha con muchos N4 depende de una sola orientación editorial.

## Pendientes operativos

- [x] Decidir enum exacto de orientación editorial. **Decisión 2026-05-26**: enum 7+1 (`izquierda_extrema · izquierda · centroizquierda · centro · centroderecha · derecha · derecha_extrema · sin_clasificar`) en doble dimensión (declarada + percibida).
- [x] Decidir fuente/metodología para clasificar medios. **Decisión 2026-05-26**: canon en [`doc 07`](../../diseno/07-clasificacion-editorial-medios.md). Cuatro fuentes admisibles para `percibida`; seis para `declarada`. Cita literal + URL obligatorias.
- [x] Definir copy público. **Decisión 2026-05-26**: "Composición de fuentes citadas" (esta feature) frente a "Cobertura mediática general" (hermana). Léxico vetado: "sesgo", "veracidad", "fiabilidad", "imparcialidad".
- [ ] Poblar `naturaleza_editorial` y las orientaciones restantes del inventario. `naturaleza_editorial` está poblada en los medios actuales y 13 medios tienen `orientacion_editorial_percibida` por CIS 3511; el resto queda sin clasificar hasta fuente externa válida.
- [ ] Implementar bloque en la ficha de caso sin introducir colores partidistas. Compartido con la barra de [`cobertura-mediatica-general.md`](cobertura-mediatica-general.md).
