# Composicion de fuentes citadas

> Archivos clave: pendiente de implementar · Relacionada con [`cobertura-mediatica-general.md`](cobertura-mediatica-general.md)

## Qué hace

Muestra, para cada ficha de caso, la distribucion de las fuentes periodisticas N4 que presuntamente.org ha usado como respaldo editorial.

## Para qué sirve

Da transparencia al lector sobre la materia prima periodistica de la ficha. No mide el comportamiento de todo el ecosistema mediatico; mide la composicion de las fuentes citadas por el inventario.

Sirve tambien como autocontrol editorial: si una ficha se apoya casi siempre en un mismo tipo de medio, el propio sitio lo hace visible y empuja a buscar cobertura cruzada antes de dar el caso por suficientemente trabajado.

## Cómo funciona

La version pre-launch deberia derivarse de datos ya existentes:

- `Documento.nivel_fuente: 4` identifica cobertura periodistica.
- `Documento.productor_organizacion_id` apunta al medio productor cuando este ya esta modelado.
- `Organizacion.tipo: medio_comunicacion` identifica que la organizacion es un medio.
- Campo nuevo pendiente: `Organizacion.orientacion_editorial`, con valores discretos y `sin_clasificar`.

La ficha de caso agregara solo los documentos periodisticos efectivamente usados por sus hitos/hechos/documentos de respaldo. El resultado se renderizara como distribucion y conteo, no como juicio editorial.

## Estado actual

No implementada. La idea anterior del ROADMAP hablaba de "barometro de sesgo mediatico"; tras la discusion del 2026-05-25 queda dividida en dos features:

- Esta feature: composicion de fuentes citadas por presuntamente.org.
- [`Cobertura mediatica general`](cobertura-mediatica-general.md): investigacion externa sobre el conjunto amplio de noticias publicadas sobre un caso.

## Decisiones editoriales y aprendizajes

- **No llamarlo sesgo en la UI principal.** Con el corpus de documentos citados solo podemos afirmar como se compone nuestra ficha, no como se comporto "la prensa" en general.
- **Separar fuente citada de noticia existente.** Un articulo puede existir y no estar citado porque no aporta dato nuevo, porque replica agencia, porque es redundante o porque no supera el criterio editorial.
- **`sin_clasificar` es obligatorio.** Forzar orientacion a todos los medios daria falsa precision.
- **La orientacion del medio necesita metodologia.** No debe ser intuicion del maintainer ni del agente. Cada valor debe tener fuente o criterio documentado.
- **No mide veracidad.** Una barra mas alta de un eje editorial no significa que ese eje tenga razon ni que manipule; solo indica presencia en la ficha.

## Ideas futuras

### v1 pre-launch

- Campo `orientacion_editorial` en `Organizacion` para medios.
- Agregado por caso de documentos N4 citados.
- Bloque discreto en ficha de caso: "Fuentes periodisticas citadas".
- Nota metodologica visible junto al bloque.

### v1.x

- Filtro por periodo del caso.
- Distinguir documentos N4 que respaldan hechos frente a documentos N4 solo contextuales.
- Vista agregada en `/cifras` con composicion global del inventario.

### Sin compromiso

- Export JSON/CSV de fuentes citadas por caso.
- Señal interna en `revisar-caso` si una ficha con muchos N4 depende de una sola orientacion editorial.

## Pendientes operativos

- [ ] Decidir enum exacto de `orientacion_editorial`.
- [ ] Decidir fuente/metodologia para clasificar medios.
- [ ] Definir copy publico: "Composicion de fuentes citadas" vs "Fuentes periodisticas citadas".
- [ ] Implementar ficha obligatoria en la pagina de caso sin introducir colores partidistas.
