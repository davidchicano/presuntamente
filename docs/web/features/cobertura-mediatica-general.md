# Cobertura mediatica general

> Archivos clave: pendiente de implementar · Relacionada con [`composicion-fuentes-citadas.md`](composicion-fuentes-citadas.md)

## Qué hace

Construye un corpus separado de noticias publicadas sobre un caso para analizar volumen, distribucion temporal y composicion por medios.

## Para qué sirve

Permite estudiar como se ha cubierto publicamente un caso mas alla de las fuentes que presuntamente.org cita para sostener hechos. Es la base real para un futuro barometro de cobertura o sesgo mediatico.

## Cómo funciona

No debe reutilizar sin mas los `Documento` que respaldan hechos. Necesita un corpus propio, probablemente por caso, generado por una skill especifica.

Flujo propuesto:

1. Definir terminos de busqueda canonicos del caso y aliases.
2. Buscar por ventanas temporales relevantes.
3. Recoger URLs, medio, titular, fecha, autor si consta y resumen minimo.
4. Deduplicar piezas sindicadas, republicaciones y articulos identicos.
5. Archivar URL cuando proceda.
6. Clasificar medio segun la metodologia comun de `orientacion_editorial`.
7. Producir un fichero estructurado separado del modelo judicial.

Posible ubicacion futura del corpus: `content/casos/<slug>/cobertura-mediatica/` o `content/cobertura-mediatica/<slug>.yaml`. La decision queda abierta porque esto trasciende una ficha web y puede crecer bastante.

## Estado actual

No implementada. Queda como feature pre-launch deseable, pero con riesgo de alcance alto. Si no entra antes del lanzamiento, la ficha de caso debe poder declarar esa ausencia mediante [`estado-ficha-caso.md`](estado-ficha-caso.md).

## Decisiones editoriales y aprendizajes

- **Es otra investigacion, no un derivado automatico.** Buscar "todas las noticias" exige metodologia, ventanas temporales, deduplicacion y criterios de inclusion.
- **"Todas" es una promesa peligrosa.** Mejor hablar de muestra sistematica o corpus rastreado, salvo que haya una fuente exhaustiva.
- **Separar corpus judicial de corpus mediatico.** Los documentos que respaldan hechos judiciales siguen en `content/documentos/`; la cobertura general no debe inflar artificialmente la biblioteca probatoria.
- **La metrica debe evitar convertir ausencia de cobertura en intencion.** Que un medio no cubra algo puede significar agenda, falta de recursos, paywall, duplicacion de agencia, baja relevancia editorial o error de rastreo.
- **No sustituye a fuentes primarias.** Una ficha puede estar completa judicialmente aunque su cobertura mediatica general no este analizada.

## Ideas futuras

### v1 pre-launch

- Diseñar la skill `/analizar-cobertura-mediatica <caso>` sin implementarla por completo.
- Probar el flujo en un solo caso con cobertura abundante y transversal.
- Mostrar en `Estado de la ficha` si el analisis esta pendiente, parcial o completo.

### v1.x

- Pagina o seccion por caso con picos de cobertura por fecha.
- Agregado global por medio y por caso.
- Comparativa entre cobertura citada por presuntamente.org y cobertura general rastreada.

### Sin compromiso

- Integrar APIs externas de busqueda si aportan trazabilidad y coste razonable.
- Medir prominencia aproximada cuando existan datos fiables (portada, newsletter, editorial, pieza de agencia).

## Pendientes operativos

- [ ] Decidir ubicacion canonica del corpus.
- [ ] Diseñar schema minimo de noticia rastreada.
- [ ] Crear skill `/analizar-cobertura-mediatica`.
- [ ] Definir politica de archivo para noticias que no respaldan hechos.
- [ ] Decidir si "sesgo mediatico" se usa solo internamente o tambien como copy publico.
