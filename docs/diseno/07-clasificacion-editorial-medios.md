# 07 — Clasificación editorial de medios de comunicación

> Decisión editorial cerrada el 2026-05-26. Canon vinculante para todo el inventario. Soporte vivo en [`docs/web/features/cobertura-mediatica-general.md`](../web/features/cobertura-mediatica-general.md) y [`docs/web/features/composicion-fuentes-citadas.md`](../web/features/composicion-fuentes-citadas.md). Implementado en [`schemas/organizacion.schema.json`](../../schemas/organizacion.schema.json).

## 1. Problema

El inventario necesita agrupar los `Organizacion` de tipo `medio_comunicacion` para dos features de la ficha de caso:

- **Cobertura mediática general** — distribución del corpus rastreado por el inventario sobre cómo se ha hablado públicamente del caso.
- **Composición de fuentes periodísticas citadas** — distribución de los `Documento` N4 que respaldan `Hecho` en la ficha.

Mostrar la barra agrupada por nombre individual no se lee. Agruparla por intuición política reproduce exactamente el problema que el proyecto critica (sesgo de origen disfrazado de objetividad). Necesitamos un esquema trazable, defendible públicamente y honesto sobre sus limitaciones.

## 2. Lo que rechazamos hacer

- **Calificar "sesgo" o "veracidad"** de un medio en la UI principal del sitio. Lo que medimos es composición de muestras, no fiabilidad ni manipulación.
- **Clasificar por intuición del maintainer o del agente.** Cualquier valor debe estar respaldado por (a) declaración pública del propio medio o (b) estudio externo reputado con cita literal.
- **Promediar dos fuentes que dicen cosas distintas** en un único valor "consenso". Si la autoadscripción del medio y la percepción externa divergen, las dos se enseñan; no se decide cuál tiene razón.
- **Etiquetas peyorativas o desbalanceadas.** Fuera del léxico: "ultra", "extrema X" como insulto, "progre", "facha", "casposo", "rojo", "fascha", "comunista". Los valores `izquierda_extrema` y `derecha_extrema` del enum son descriptivos cuando una fuente externa los respalda; no se inferirán por iniciativa del editor.
- **Aceptar "independiente" como clasificación.** Casi todos los medios españoles se autodeclaran independientes. La palabra no aporta información diferencial y no debe formar parte del enum.

## 3. Modelo de datos

Cuatro campos nuevos en `Organizacion` (sólo aplican si `tipo: medio_comunicacion`):

### 3.1 `naturaleza_editorial` — categoría ontológica

Enum cerrado. Separa la **naturaleza del medio** del **eje político**. Mezclar las dos categorías en un mismo enum fue rechazado expresamente.

| Valor | Aplica el eje político | Ejemplo |
|---|---|---|
| `generalista_politico` | Sí | El País, ABC, eldiario.es, OKDIARIO |
| `confesional` | Sí (con asterisco) | COPE (vinculada a Conferencia Episcopal) |
| `verificacion` | No | Newtral, Maldita.es |
| `especializado_juridico` | No | Confilegal, Iustel |
| `especializado_no_politico` | No | Económico, científico, deportivo |
| `servicio_publico_estatal` | No | TVE, RNE (mandato legal de pluralismo) |
| `servicio_publico_autonomico` | No | TV3, ETB, RTPA, Telemadrid |
| `otro` | No | Casos no cubiertos por las anteriores |

Sólo `generalista_politico` y `confesional` permiten poblar los bloques de orientación. AJV lo veta para el resto.

### 3.2 `orientacion_editorial_declarada` — autoadscripción

Lo que el propio medio dice sobre sí mismo. Cuatro campos obligatorios cuando se puebla:

```yaml
orientacion_editorial_declarada:
  valor: izquierda_extrema | izquierda | centroizquierda |
         centro | centroderecha | derecha | derecha_extrema |
         sin_clasificar
  fuente: estatuto_redaccion | manifiesto_fundacional |
          declaracion_publica_director | libro_estilo_publico |
          pagina_quienes_somos | ideario_corporativo
  cita: "literal corta de la declaración"
  url: "https://..."
  fecha: "YYYY-MM-DD"   # opcional, útil si la declaración cambió
```

Reglas:

- `valor: sin_clasificar` es legal y frecuente: el medio se declara "plural", "objetivo" o "independiente" sin posicionarse en el espectro. No se fuerza a meterlo en una casilla.
- La `cita` debe ser literal corta, no paráfrasis. No "se declara progresista"; sí `"periodismo progresista y comprometido, participativo y con espíritu internacional"`.
- En la práctica, los valores `_extrema` casi nunca aparecerán en la dimensión declarada — ningún medio español se autodeclara como tal. El enum los admite para mantener simetría con la dimensión percibida.

### 3.3 `orientacion_editorial_percibida` — clasificación externa

Cómo categoriza al medio una fuente externa reputada. Misma estructura, distintas fuentes admisibles:

```yaml
orientacion_editorial_percibida:
  valor: <mismo enum que declarada>
  fuente: reuters_institute | cis |
          estudio_academico_revisado |
          clasificacion_iniciativa_publica
  cita: "cifra o etiqueta literal del estudio"
  url: "https://..."
  fecha: "YYYY-MM-DD"
```

Fuentes admisibles, por orden de robustez:

1. **`estudio_academico_revisado`** — paper con DOI, peer review o publicado en revista indexada (Communication & Society, Profesional de la Información, etc.).
2. **`reuters_institute`** — Reuters Institute Digital News Report (capítulo España), datos publicados.
3. **`cis`** — barómetros del Centro de Investigaciones Sociológicas con la pregunta de orientación percibida embebida.
4. **`clasificacion_iniciativa_publica`** — iniciativas con metodología pública (Political Watch 2021, AllSides si cubre el medio, etc.).

Lo que **no** es fuente válida en `percibida`:

- Artículo de opinión en un medio rival.
- Hilo viral en redes sociales.
- Blog o foro sin autoría acreditada.
- Wikipedia (sí puede usarse como respaldo de localización de la cita primaria, no como cita en sí).

Mapeo cuantitativo → categorías. Cuando la fuente entrega una cifra en escala 1-10 de orientación percibida (típico en CIS / estudio UA), la conversión orientativa es:

| Tramo en escala 1-10 | Categoría del enum |
|---|---|
| 1.0 – 2.0 | `izquierda_extrema` |
| 2.0 – 3.5 | `izquierda` |
| 3.5 – 4.5 | `centroizquierda` |
| 4.5 – 5.5 | `centro` |
| 5.5 – 6.5 | `centroderecha` |
| 6.5 – 8.0 | `derecha` |
| 8.0 – 10.0 | `derecha_extrema` |

La cifra original se conserva siempre en `cita`. La conversión es del editor; el valor es derivado.

### 3.4 `grupo_editorial` — propiedad relevante

Información estructural sobre quién controla el medio. **No clasifica orientación**: es información ortogonal que aparece en la página del medio, no en la barra del eje político.

```yaml
grupo_editorial:
  nombre: "PRISA"
  rol: matriz | filial_editorial | participacion_relevante
  cita: "literal de informe anual, CNMV, BOE de adquisición o nota oficial"
  url: "https://..."
```

v1: string libre. Promovible a FK (Organizacion con `tipo: grupo_editorial`) cuando se modelen los grupos principales españoles (PRISA, Vocento, Atresmedia, Unidad Editorial, Henneo, Grupo Godó, Grupo Planeta).

## 4. Reglas operativas

1. **No etiquetas peyorativas en ninguna parte del repo.** Ni cita, ni descripcion_corta, ni comentario YAML, ni docs.
2. **"Independiente" no clasifica.** Si lo único que el medio dice es "somos independientes", `orientacion_editorial_declarada.valor = sin_clasificar`.
3. **Cada `valor` exige `fuente` + `cita` + `url`.** Sin las tres, AJV veta. Y `cita` debe ser literal corta, no resumen.
4. **`fecha_clasificacion` revisable a 5 años.** La línea editorial de un medio puede cambiar con cambio de director (precedente La Vanguardia 2013). Si `fecha` está a más de 5 años de hoy, la revisión `revisar-caso` lo señala.
5. **Cuando declarada y percibida divergen, las dos se enseñan.** Tooltip por medio en la UI, no media sintética.
6. **Verificadores y especializados quedan fuera del eje político.** En la UI se renderizan en una franja separada ("Verificación", "Servicio público", "Especializado jurídico"), no en `sin_clasificar`.
7. **Servicio público con mandato pluralismo no clasifica en eje.** Si TVE o RNE tienen un dato de Reuters/CIS, puede registrarse como nota informativa fuera del bloque de orientación, no como `orientacion_editorial_percibida` (que se interpretaría como clasificación estable del medio).

## 5. Limitaciones honestas

1. **No existe un Ground News español actualizado.** El intento más cercano (Political Watch, 2021) cubre 30 medios escritos, no TV ni radio, sin actualización conocida. Cualquier clasificación amplia se apoya en una mezcla de Reuters Institute, CIS, estudios académicos puntuales y autoadscripciones.
2. **La percepción ciudadana tiene sesgo de confirmación documentado.** Estudios Reuters/Pew para España muestran que ciudadanos de izquierda y derecha perciben los mismos medios en posiciones distintas (hasta 42 puntos de diferencia de confianza para TVE). El campo `percibida` reproduce esa percepción, no la corrige.
3. **Multidimensionalidad colapsada en un eje.** El eje izquierda-derecha no captura ejes ortogonales relevantes (económico vs sociocultural, populista vs establishment, territorial). Es la simplificación menos mala para una barra; la UI lo dice.
4. **El "centro" no es neutralidad.** AllSides documenta que tratar "Center" como posición sin sesgo produce equivalencia falsa. Aquí `centro` significa "el estudio externo lo ubica en torno al centro" o "el medio se autodefine en torno al centro", no "objetivamente equilibrado".
5. **Las clasificaciones envejecen.** El modelo registra `fecha`; el lector ve que un dato es de 2021 vs 2025; la auditoría editorial obliga a revisar pasados 5 años.
6. **Naturaleza editorial no es estable a perpetuidad.** Un medio puede cambiar de naturaleza editorial (un económico que se generaliza, un confesional que se laiciza). El campo es revisable.

## 6. Implicaciones de UI

La UI (próxima sesión) debe:

- Mostrar la barra principal con un **toggle "Declarada · Percibida"**. Default `Percibida` (suele estar más poblada para medios mainstream gracias a Reuters/CIS).
- Para cada medio, **tooltip** con: naturaleza, declarada (valor + cita + URL), percibida (valor + cita + URL), grupo editorial.
- Medios con `naturaleza_editorial !== generalista_politico && !== confesional` se renderizan en **franjas separadas** ("Verificación", "Servicio público estatal", "Especializado jurídico"…), no en `sin_clasificar`.
- **Nota metodológica obligatoria** junto a la barra, no a un clic. Enlace a esta página.
- **No usar colores partidistas** asociados a partidos concretos (rojo PSOE, azul PP). Los colores del eje deben ser neutros (gradiente cool→warm, gris para `sin_clasificar`).

## 7. Histórico de la decisión

- **2026-05-25**: identificada la necesidad por el cierre de las features [cobertura-mediatica-general](../web/features/cobertura-mediatica-general.md) y [composicion-fuentes-citadas](../web/features/composicion-fuentes-citadas.md).
- **2026-05-26 (mañana)**: discusión maintainer + agente. Decisión preliminar: una sola dimensión (`orientacion_editorial` con `sin_clasificar` obligatorio), enum tipo C (sólo autoadscripción).
- **2026-05-26 (tarde)**: investigación documental por sub-agente (Ground News, AllSides, MBFC, Ad Fontes, Reuters Institute España 2025, CIS, Political Watch 2021, estudios académicos UN/UA). El informe confirmó: existen fuentes externas reputadas para España; conviene separar declarada (autoadscripción) de percibida (externa); medios verificadores y servicio público no encajan en el eje y necesitan categoría separada; los extremos del eje son técnicamente sostenibles si hay fuente externa explícita.
- **2026-05-26 (cierre)**: decisión final del maintainer — tres dimensiones (declarada, percibida, grupo), naturaleza editorial como campo separado, 7+1 valores en el eje, grupo editorial como string libre v1, `confesional` con orientación clasificable.
