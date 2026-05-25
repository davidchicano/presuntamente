# Vinculos institucionales documentados

> Archivos clave: pendiente de implementar · Relacionada con [`grafo-relaciones-caso.md`](grafo-relaciones-caso.md)

## Qué hace

Modela y muestra los vinculos formales documentados entre personas, organizaciones, partidos, administraciones, empresas publicas, organos judiciales y casos.

## Para qué sirve

Permite que un lector entienda rapidamente a que entorno institucional alcanza un caso sin convertir la ficha en una etiqueta partidista. Es especialmente util cuando el nombre mediatico no explica nada o cuando la relacion no es procesal directa.

## Cómo funciona

La feature debe partir de relaciones documentadas, no de simpatias, intuiciones o lectura politica general.

Tipos de vinculo candidatos:

- Cargo publico o institucional en una organizacion durante fechas concretas.
- Cargo organico en partido politico durante fechas concretas.
- Nombramiento por un gobierno o administracion concreta.
- Organizacion que actua como acusacion, denunciante, perjudicada, querellante o entidad investigada.
- Empresa, fundacion, sindicato o asociacion relevante para el hecho investigado.
- Vinculo familiar o de pareja solo si es publico, relevante para el caso y tratado con minimizacion.

La implementacion puede requerir una entidad nueva tipo `VinculoInstitucional` o una tabla intermedia persona-organizacion con `desde`, `hasta`, `cargo`, `fuente_documento_id` y `naturaleza`.

## Estado actual

No implementada como feature. Algunas relaciones aparecen hoy dispersas en `RolEnCaso`, `Organizacion`, `Persona.biografia_corta`, `organizaciones_implicadas` y descripciones de hechos, pero no hay un modelo transversal que permita filtrar, graficar o explicar "a quien alcanza" un caso.

## Decisiones editoriales y aprendizajes

- **No usar "ideologia afectada" como modelo canonico.** El encuadre correcto es vinculo institucional documentado.
- **No implica responsabilidad del partido u organizacion.** Que una persona tenga o haya tenido cargo en una organizacion no significa que la organizacion sea sujeto procesal ni responsable de sus actos.
- **Fecha importa.** No es lo mismo cargo vigente, excargo, cargo en el momento de los hechos o relacion posterior.
- **El partido es una organizacion mas, no un color.** La UI no debe usar colores, iconos o badges asociados a partidos.
- **Administraciones y organismos publicos importan tanto como partidos.** Muchos casos alcanzan ministerios, comunidades autonomas, ayuntamientos, empresas publicas u organos constitucionales sin que el partido sea sujeto procesal.

## Ideas futuras

### v1 pre-launch

- Diseñar el modelo minimo de vinculo.
- Prototipo en uno o dos casos representativos.
- Mostrar bloque "Contexto institucional" en ficha de caso.
- Permitir que el listado `/casos` muestre o filtre por organizaciones vinculadas.

### v1.x

- Vista por organizacion con todos los casos donde aparece por vinculo institucional, separando rol procesal de contexto.
- Export de vinculos documentados.
- Integracion con [`grafo-relaciones-caso.md`](grafo-relaciones-caso.md).

### Sin compromiso

- Filtros agregados por tipo de administracion: estatal, autonomica, local, empresa publica, partido, fundacion, sindicato.

## Pendientes operativos

- [ ] Decidir schema: entidad nueva vs campos en `Persona`/`Organizacion`.
- [ ] Definir enum de `naturaleza` del vinculo.
- [ ] Definir requisito de fuente para cada vinculo.
- [ ] Revisar riesgos RGPD para vinculos familiares o de pareja.
- [ ] Escribir nota metodologica publica.
