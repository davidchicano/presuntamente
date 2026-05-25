# Estado de la ficha de caso

> Archivos clave: pendiente de implementar

## Qué hace

Muestra publicamente que partes de una ficha de caso estan completas, parciales, pendientes o no aplican.

## Para qué sirve

Evita que el lector confunda "esto no aparece en la web" con "esto no existe en el procedimiento". Tambien hace honesto el estado de trabajo del inventario: algunos casos tendran cronologia y roles bien cerrados, pero no cobertura mediatica general o grafo de relaciones.

## Cómo funciona

La UI deberia hablar de **estado de la ficha**, no de estado del caso. El procedimiento judicial tiene su propia fase procesal; esta feature mide completitud editorial y tecnica de presuntamente.org.

Modelo propuesto:

- `completo`
- `parcial`
- `pendiente`
- `no_aplica`

Checks candidatos:

- Cronologia basica completada.
- Roles procesales principales revisados.
- Documentos primarios descargados cuando estan publicamente disponibles.
- Hechos principales modelados.
- Fuentes periodisticas cruzadas.
- Composicion de fuentes citadas disponible.
- Vinculos institucionales documentados.
- Grafo de relaciones disponible.
- Cobertura mediatica general analizada.
- Revision editorial cualitativa pasada.
- Ultima revision completa.

Parte de estos checks puede derivarse del contenido; otros requieren declaracion editorial en `caso.yaml` o en un fichero auxiliar.

## Estado actual

No implementada. El repo ya tiene `estado_publicacion` y `ultima_revision_editorial`, pero no un checklist publico de completitud de ficha.

## Decisiones editoriales y aprendizajes

- **La incompletitud debe verse.** En un inventario vivo, ocultar los huecos genera mas desconfianza que admitirlos.
- **No penalizar casos vivos.** Un caso puede estar correctamente trabajado y aun asi tener documentos primarios pendientes porque CENDOJ no los ha publicado.
- **Evitar barras porcentuales falsas.** Un 80% de completitud parece objetivo pero depende de pesos arbitrarios. Mejor checks discretos con metodologia.
- **Separar automatico de editorial.** "Tiene 10 hitos" puede computarse; "cronologia basica completada" requiere revision humana o de skill.

## Ideas futuras

### v1 pre-launch

- Bloque discreto en ficha de caso: "Estado de esta ficha".
- Campos minimos en `caso.yaml` o fichero auxiliar para checks no derivables.
- Integracion con `revisar-caso`: marcar si la ultima revision cualitativa esta pasada.

### v1.x

- Filtro en `/casos`: mostrar solo fichas con estado editorial completo.
- Vista interna para priorizar trabajo pendiente.
- Mostrar razon concreta de `parcial` o `pendiente`.

### Sin compromiso

- Historial de completitud por fecha.
- Export de estado de ficha para consumidores externos.

## Pendientes operativos

- [ ] Decidir si los checks viven en `caso.yaml` o en `content/casos/<slug>/estado-ficha.yaml`.
- [ ] Definir que checks son obligatorios pre-launch.
- [ ] Decidir copy exacto para que no parezca un certificado juridico.
- [ ] Hacer que `pnpm validate` detecte estados incoherentes obvios.
