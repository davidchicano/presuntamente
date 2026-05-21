# Modelo de datos conceptual — presuntamente.org

**Estado:** borrador 1.0 · análisis y diseño · 2026-05-21
**Alcance:** modelo conceptual (entidades, atributos, relaciones, validaciones). NO es esquema SQL ni schema JSON.
**Decisiones previas que asume:** ver `MEMORY.md → project_presuntamente.md → Decisiones de diseño tomadas`.

---

## 0. Principios del modelo

Antes de las entidades, las cinco reglas que cualquier decisión de modelado debe respetar. Si una propuesta las viola, no entra.

1. **Imputación ≠ condena, y el modelo lo refleja en datos, no en prosa.** No existe un campo `culpable: boolean`. Existen `RolEnCaso` con tipos discretos (investigado, procesado, acusado, condenado, absuelto, desimputado) y fechas. La trayectoria de una persona en un caso es una secuencia de roles, no un estado único.
2. **Cada afirmación tiene fuente y nivel.** Un `Hecho` sin al menos un `Documento` que lo respalde no es publicable. El nivel de fuente del documento condiciona qué tipos de `Hecho` puede sostener.
3. **Lo coloquial y lo formal viven en campos distintos.** El nombre mediático ("caso Zapatero") nunca contamina el campo de investigados formales. Los buscadores leen el coloquial; los hechos jurídicos leen el formal.
4. **Fases ≠ hitos.** Un caso está *en una fase* (instrucción, juicio oral, recurso, ejecución, firme). Una imputación, un procesamiento, una sentencia son *eventos puntuales* (Hitos) que cambian la fase. No mezclar.
5. **El grafo emerge de relaciones explícitas reificadas, no de magia.** Cada conexión persona↔caso, caso↔caso, documento↔hecho es una fila en una tabla, con su tipo, su periodo y, cuando aplica, su documento que la respalda. Esto permite tanto visualización de grafo como auditoría línea a línea.

Corolario operativo: **la canonicalidad del dato vive en ficheros YAML en el repo Git**, validados por CI. Cualquier base de datos (PostgreSQL, SQLite, índice de búsqueda) es una proyección derivada que se reconstruye desde el repo. Esa decisión es de arquitectura, no de modelo, pero condiciona el diseño: los identificadores son slugs human-readable, no UUIDs.

---

## 1. Vista panorámica

```
                        ┌──────────────────┐
                        │      Caso        │◄────────────┐ (caso_padre_id, recursivo)
                        │ (recursivo)      │─────────────┘
                        └────────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────────────┐
              │                  │                          │
              ▼                  ▼                          ▼
       ┌────────────┐     ┌────────────┐            ┌──────────────────┐
       │   Hito     │     │  RolEnCaso │            │ RelacionEntre    │
       │ (eventos)  │     │ (persona×  │            │ Casos            │
       │            │     │  caso×rol) │            │ (no jerárquica)  │
       └─────┬──────┘     └──────┬─────┘            └──────────────────┘
             │                   │
             │                   ▼
             │            ┌────────────┐         ┌──────────────────┐
             │            │  Persona   │         │  Organización    │
             │            └────────────┘         │ (juzgados, FGE,  │
             │                                   │ partidos, UCO,   │
             │                                   │ medios, etc.)    │
             ▼                                   └────────┬─────────┘
       ┌────────────┐                                     │
       │  Hecho     │◄────────── citado por ──────────────│
       │ (epistémico│                                     │
       │  + neutro) │            ┌──────────────┐         │
       └─────┬──────┘            │  Documento   │─── produce ─┘
             │   citado por      │ (auto, sent, │
             └──────────────────►│ informe,     │
                                 │ prensa, ...) │
                                 └──────────────┘

       Catálogos de referencia: Delito, Nivel de fuente, Tipo de hito, ...
```

Cada flecha es una relación reificada (tabla / fichero), no una columna implícita.

---

## 2. Entidades

Notación: TypeScript-like, conceptual. Tipos como `string`, `enum<X>`, `Date`, `slug`, `ref<X>` (referencia a otra entidad por su id), `array<T>`, `markdown` (string con sintaxis Markdown). `?` = opcional.

### 2.1 Caso

Un procedimiento o agrupación de procedimientos judicialmente identificable. **Recursivo:** un Caso puede tener Casos hijos (piezas separadas, derivadas). Una macrocausa como Gürtel es un Caso "raíz" con muchos Casos hijo.

```ts
interface Caso {
  id: slug;                              // ej. "plus-ultra", "koldo", "koldo/cerdan"
  nombre_oficial: string;                // ej. "Diligencias Previas 85/2020"
  nombre_mediatico: string;              // ej. "Caso Plus Ultra"
  nombres_alternativos: array<string>;   // sinónimos usados por la prensa
  descripcion_corta: markdown;           // 2-3 frases, neutro, sin imputaciones implícitas

  // Jerarquía (la recursión)
  caso_padre_id?: ref<Caso>;             // null si es raíz; presente si es pieza
  tipo_pieza?: enum<TipoPieza>;          // solo si caso_padre_id está presente

  // Identificación judicial
  organo_judicial_id: ref<Organizacion>; // juzgado/tribunal donde se tramita
  numero_procedimiento: string;          // ej. "DP 85/2020"
  tipo_procedimiento: enum<TipoProcedimiento>;
  ponente_actual_id?: ref<Persona>;      // juez instructor o ponente vigente
                                         // (su historial vive en Hitos)

  // Estado
  fase_actual: enum<FaseProcesal>;       // ver §3
  fecha_apertura: Date;
  fecha_cierre?: Date;                   // solo si fase = archivo / firme

  // Contexto editorial
  origen_denuncia: enum<OrigenDenuncia>; // anticorrupción, querella política, etc.
  querellante_inicial_id?: ref<Organizacion | Persona>;
  delitos_atribuidos_en_la_causa: array<ref<Delito>>;  // union de delitos de todos los RolEnCaso
  resumen_cifras?: markdown;             // ej. "53M€ prestados por SEPI" (citable)

  // Metadatos editoriales
  estado_publicacion: enum<EstadoPublicacion>;   // borrador / publicado / retirado
  ultima_revision_editorial: Date;
  nivel_relevancia_editorial: enum<NivelRelevancia>;  // baja / media / alta / capital
                                                       // criterio documentado en CONTRIBUTING.md
}
```

**Reglas:**

- `caso_padre_id` no puede crear ciclos. CI lo valida con un walk del árbol.
- Si `fase_actual ∈ {firme, archivo}`, debe existir al menos un Hito de tipo coherente (`sentencia_firme`, `archivo`, `sobreseimiento_libre`).
- `nivel_relevancia_editorial` se asigna por el maintainer según criterio publicado, no automáticamente; pero los listados de la UI no se ordenan sólo por él (también por fecha, por fase).
- `delitos_atribuidos_en_la_causa` es derivable de los `RolEnCaso`. Si se mantiene como campo es por performance / claridad editorial, pero CI valida que no diverja.

### 2.2 Persona

Una persona física relevante para uno o más casos.

```ts
interface Persona {
  id: slug;                              // ej. "jose-luis-abalos"
  nombre_completo: string;
  nombres_alternativos: array<string>;   // apodos públicos, nombres con/sin segundo apellido
  
  // Función pública
  es_figura_publica: boolean;            // CRÍTICO: condiciona qué se puede publicar
  cargo_publico_actual?: string;         // ej. "Diputado por Valencia (PSOE), 2008-2024"
  cargos_publicos_historicos: array<{
    cargo: string;
    organizacion_id?: ref<Organizacion>;
    desde: Date;
    hasta?: Date;
  }>;
  
  // Datos personales (con restricciones)
  fecha_nacimiento?: Date;               // SOLO si es_figura_publica; nunca testigos
  nacionalidad?: string;                 // opcional, sólo si relevante para el caso
  fallecido: boolean;
  fecha_fallecimiento?: Date;
  
  // Biografía
  biografia_corta?: markdown;            // muy breve, neutra, citable
  
  // Metadatos editoriales
  estado_publicacion: enum<EstadoPublicacion>;
  ultima_revision_editorial: Date;
}
```

**Reglas:**

- Si `es_figura_publica = false`, su `biografia_corta` no puede contener datos personales más allá de los estrictamente necesarios para identificarla en el procedimiento (p.ej. un testigo: "Asesor jurídico externo contratado por X en 2019" — sin DNI, sin domicilio, sin familia).
- Un `Persona` con `es_figura_publica = false` y todos sus `RolEnCaso` cerrados (desimputaciones, archivos) entra en revisión editorial automática para considerar **anonimización o retirada de la ficha**. Ver §4.
- `fecha_nacimiento` y `nacionalidad` quedan vacíos por defecto; sólo se rellenan si añaden valor informativo y la persona es pública.

### 2.3 Organización

Cualquier entidad colectiva relevante para un caso: juzgados, fiscalías, partidos, empresas, organismos públicos, medios, asociaciones de acusación popular. Polimórfica por `tipo`.

```ts
interface Organizacion {
  id: slug;                              // ej. "audiencia-nacional", "el-pais", "vox"
  nombre: string;                        // ej. "Audiencia Nacional"
  nombres_alternativos: array<string>;
  tipo: enum<TipoOrganizacion>;          // ver §3
  
  // Campos comunes
  descripcion_corta?: markdown;
  
  // Campos específicos por tipo (nullables cuando no aplica)
  // -- Si tipo = juzgado | tribunal | fiscalia
  jurisdiccion?: enum<Jurisdiccion>;     // penal, mercantil, contencioso-admin, etc.
  ambito_territorial?: enum<AmbitoTerritorial>;   // nacional, autonomico, provincial, local
  localidad?: string;
  provincia?: string;
  comunidad_autonoma?: string;
  organo_superior_id?: ref<Organizacion>;         // ej. AP Madrid → TSJ Madrid → TS
  
  // -- Si tipo = partido_politico
  siglas?: string;
  fundacion?: Date;
  
  // -- Si tipo = empresa
  cif?: string;                          // sólo si público y verificado en registros oficiales
  sector?: string;
  
  // -- Si tipo = medio_comunicacion
  url_canonica?: string;                 // ej. "https://elpais.com"
  linea_editorial_declarada?: string;    // breve, citable a su propio kit de medios
  
  // Metadatos editoriales
  estado_publicacion: enum<EstadoPublicacion>;
  ultima_revision_editorial: Date;
}
```

**Reglas:**

- Una `Organizacion` de tipo `juzgado` o `tribunal` referenciada como `organo_judicial_id` de un Caso debe tener `jurisdiccion` y `ambito_territorial` informados.
- `linea_editorial_declarada` de un medio se cita siempre a la fuente del propio medio (página "Quiénes somos" o equivalente), no a una opinión editorial de presuntamente.
- Una Organización tipo `asociacion` o `partido_politico` que actúa como acusación popular en un caso se modela vía `RolEnCaso` aplicable a Organización; ver §2.4.

### 2.4 RolEnCaso

La unidad atómica que conecta Personas (y, excepcionalmente, Organizaciones) con Casos en un periodo concreto y con un rol procesal específico. **Es el corazón del modelo.**

```ts
interface RolEnCaso {
  id: slug;                              // ej. "abalos-koldo-investigado-2024-02"
  caso_id: ref<Caso>;
  
  // Sujeto: persona o (con restricciones) organización
  sujeto_tipo: enum<"persona" | "organizacion">;
  sujeto_persona_id?: ref<Persona>;
  sujeto_organizacion_id?: ref<Organizacion>;
  // Exactamente uno de los dos anteriores debe estar informado.
  
  rol: enum<RolProcesal>;                // ver §3 (investigado, procesado, acusado, condenado,
                                         // absuelto, desimputado, testigo, denunciante,
                                         // querellante, acusacion_popular, acusacion_particular,
                                         // abogado, juez_instructor, fiscal, perito, etc.)
  
  // Sólo si rol implica atribución penal a una persona
  delitos_atribuidos?: array<ref<Delito>>;
  delitos_codigo_penal?: array<string>;  // ej. ["art. 248 CP", "art. 432.1 CP"]
  
  // Vigencia
  fecha_inicio: Date;
  fecha_fin?: Date;                      // null si activo
  hito_origen_id?: ref<Hito>;            // ej. el auto de imputación
  hito_fin_id?: ref<Hito>;               // ej. el auto de desimputación
  
  // Notas editoriales
  notas?: markdown;                      // ej. "Designado por el juez Peinado como
                                         // persona investigada en pieza X, posteriormente
                                         // desimputado por la AP Madrid (auto 412/2025)."
}
```

**Reglas:**

- Una misma `Persona` puede tener múltiples `RolEnCaso` en el mismo `Caso`, secuenciados en el tiempo. Ej: investigada → procesada → acusada → absuelta. O: investigada → desimputada → re-imputada (si la AP revoca).
- Solapamiento de roles en la misma persona-caso está permitido (puede ser testigo en una pieza e investigada en otra del mismo caso padre).
- Los roles `juez_instructor`, `fiscal`, `abogado`, `perito` son **rol funcional**, no procesal. No implican imputación. La UI los segrega visualmente del bloque de investigados.
- `delitos_atribuidos` sólo puede estar informado si `rol ∈ {investigado, procesado, acusado, condenado}`.
- Un `RolEnCaso` con `rol = condenado` exige existencia de `hito_origen_id` apuntando a un Hito tipo `sentencia_firme` o `sentencia_primera_instancia` (con anotación clara si no es firme).
- Un `RolEnCaso` con `sujeto_tipo = organizacion` sólo es válido si `rol ∈ {acusacion_popular, acusacion_particular, querellante, denunciante}` (asociaciones, partidos, organismos que ejercen acción legal).

### 2.5 Hito

Un evento cronológico puntual que ocurre en un Caso. Cambia su Fase, introduce o modifica Hechos, abre o cierra RolEnCaso.

```ts
interface Hito {
  id: slug;                              // ej. "koldo-imputacion-cerdan-2024-06-30"
  caso_id: ref<Caso>;
  
  tipo: enum<TipoHito>;                  // ver §3 (querella_admitida, imputacion,
                                         // declaracion_imputado, auto_procesamiento,
                                         // apertura_juicio_oral, sentencia_primera_instancia,
                                         // recurso_apelacion, sentencia_apelacion,
                                         // sentencia_firme, archivo, sobreseimiento_libre,
                                         // sobreseimiento_provisional, desimputacion,
                                         // cambio_juez, etc.)
  
  fecha: Date;                           // o rango si la fuente lo da impreciso
  fecha_precision: enum<"dia" | "mes" | "anio">;  // para fechas históricas vagas
  
  titulo: string;                        // ej. "Imputación de Santos Cerdán en pieza separada"
  descripcion: markdown;                 // neutra, citable
  
  personas_afectadas: array<ref<Persona>>;       // sobre quién recae el hito
  organizaciones_afectadas?: array<ref<Organizacion>>;
  
  documento_principal_id?: ref<Documento>;       // el auto/sentencia que documenta el hito
  documentos_relacionados: array<ref<Documento>>;
  
  hechos_introducidos: array<ref<Hecho>>;        // qué Hechos nuevos sostiene este hito
  hechos_modificados: array<ref<Hecho>>;         // qué Hechos previos quedan corregidos
                                                  // (ej. una desimputación corrige un Hecho previo)
  
  fase_resultante?: enum<FaseProcesal>;          // si el hito cambia la Fase del Caso, cuál es
                                                  // la fase tras el hito (informativo / cache)
}
```

**Reglas:**

- Los `Hito` de un Caso, ordenados por `fecha`, deben construir una trayectoria coherente. CI valida transiciones de Fase: no se puede pasar de `archivo` a `instrucción` sin un Hito de reapertura.
- Si `tipo = sentencia_firme` o `archivo`, el Caso debe transitar a `fase_actual` coherente.
- `documento_principal_id` es obligatorio para hitos jurisdiccionales (imputación, procesamiento, sentencia, archivo). No así para hitos políticos o mediáticos (p.ej. "Comparecencia en Comisión del Senado") donde se cita un documento de tipo `acta_congreso` o `video_comision`.

### 2.6 Hecho

Una afirmación verificable sobre el caso. Tiene **estado epistémico** (acreditado/investigado/etc.) y **fuentes** (Documentos con nivel). Es la unidad citable en la UI.

```ts
interface Hecho {
  id: slug;
  caso_id: ref<Caso>;
  
  enunciado: markdown;                   // neutro, en pasiva o impersonal cuando corresponda
                                          // ej. "El 22 de junio de 2020, SEPI aprobó un préstamo
                                          //      de 53 millones de euros a Plus Ultra."
  
  tipo: enum<TipoHecho>;                 // acreditado / investigado / atribuido /
                                          // exculpatorio / desmentido / no_concluyente
  
  fecha_o_periodo: {
    desde: Date;
    hasta?: Date;
    precision: enum<"dia" | "mes" | "anio" | "rango">;
  };
  
  // A quién/qué afecta
  personas_implicadas: array<ref<Persona>>;
  organizaciones_implicadas: array<ref<Organizacion>>;
  
  // Citación
  documentos_respaldo: array<{
    documento_id: ref<Documento>;
    pasaje?: string;                     // ej. "Fundamento de Derecho Tercero"
                                          // o "pp. 23-25"
  }>;
  nivel_fuente_efectivo: enum<1|2|3|4>;  // el mejor (menor número) entre los documentos_respaldo
  
  // Diálogo con otros Hechos
  contraposicion_a?: ref<Hecho>;         // este Hecho rebate / contrasta con otro
  corregido_por?: ref<Hecho>;            // este Hecho ha sido superado por uno posterior
                                          // (p.ej. desmentido por sentencia ulterior)
  
  // Estado
  vigencia: enum<"vigente" | "superado" | "retirado">;
  redaccion_neutra_revisada: boolean;    // editorial flag, validado en review
  
  // Metadatos editoriales
  estado_publicacion: enum<EstadoPublicacion>;
  ultima_revision_editorial: Date;
}
```

**Reglas críticas (ver §4 para la lista completa):**

- `tipo = acreditado` exige al menos un Documento en `documentos_respaldo` de tipo jurisdiccional firme (sentencia firme, auto firme).
- `tipo = investigado` exige al menos un Documento de nivel 1 ó 2 que sea jurisdiccional o instructor (auto, informe UCO/UDEF, atestado, escrito de Fiscalía publicado).
- `tipo = atribuido` (un actor sostiene el hecho, no necesariamente con respaldo jurisdiccional) exige citar nominalmente al actor en el `enunciado` o en metadatos.
- `tipo = exculpatorio` exige un Documento de tipo sentencia absolutoria, auto de archivo, auto de desimputación o equivalente.
- `tipo = desmentido` exige documento(s) cuya valoración editorial soporta el desmentido, citado de forma identificable.
- Una `Persona` privada (no figura pública) no puede aparecer en un Hecho `acreditado` o `investigado` salvo que tenga al menos un `RolEnCaso` activo en el periodo del Hecho.
- `nivel_fuente_efectivo` se computa desde `documentos_respaldo` y se guarda como cache para la UI.

### 2.7 Documento

Un documento concreto y citable. Lo que sostiene los Hechos.

```ts
interface Documento {
  id: slug;                              // ej. "auto-procesamiento-koldo-2024-12-12"
  titulo: string;
  tipo: enum<TipoDocumento>;             // ver §3 (auto_judicial, sentencia, informe_uco,
                                         // informe_udef, atestado, escrito_fiscalia,
                                         // acta_congreso, video_comision, articulo_prensa,
                                         // boletin_oficial, nota_prensa, declaracion_jurada,
                                         // libro, paper, etc.)
  
  // Niveles y procedencia
  nivel_fuente: enum<1|2|3|4>;
  nivel_fuente_justificacion: markdown;  // breve: por qué se asigna ese nivel
  
  // Producción
  productor_organizacion_id?: ref<Organizacion>;  // entidad que produce/publica el documento
  productor_personas_ids: array<ref<Persona>>;    // ej. periodistas firmantes
  fecha_documento: Date;                 // fecha del evento que el documento recoge
  fecha_publicacion?: Date;              // fecha en que se hizo público
  
  // Localización del documento
  url_canonica?: string;                 // URL oficial (CENDOJ, BOE, etc.)
  url_archivo?: string;                  // mirror en archive.org / archive.ph
  ruta_local?: string;                   // path en el repo si tenemos copia almacenada
  hash_sha256?: string;                  // si tenemos copia local
  
  // Acceso
  estado_acceso: enum<EstadoAcceso>;     // publico / acceso_restringido_pero_citable /
                                          // filtrado_verificado / retirado
  idioma: enum<IdiomaDocumento>;         // es, ca, eu, gl, en, ...
  
  // Conexión narrativa (no estructural — un documento puede aparecer en muchos casos)
  caso_principal_id?: ref<Caso>;         // si el documento "pertenece" a un caso, cuál
  
  // Metadatos editoriales
  estado_publicacion: enum<EstadoPublicacion>;
  ultima_revision_editorial: Date;
}
```

**Reglas:**

- Un Documento de `nivel_fuente = 1` debe tener `url_canonica` apuntando a un dominio de la lista blanca de fuentes oficiales (ver §3 → `DominiosOficiales`) o `ruta_local` con copia verificada hash en el repo.
- Si `estado_acceso = filtrado_verificado`, el `nivel_fuente_justificacion` debe explicar quién verificó el contenido y por qué medios (multi-medio, verificación cruzada, autenticidad confirmada por las partes, etc.).
- `url_archivo` (archivo.org / archive.ph) es **muy recomendado** para cualquier documento de Nivel 4 (cobertura periodística), por defensa frente a desaparición o edición silenciosa del original.
- Un Documento de tipo `articulo_prensa` no puede ser citado como soporte único para un Hecho de tipo `acreditado` o `investigado`. Puede serlo para Hechos `atribuidos` o como cita adicional.

### 2.8 RelacionEntreCasos

Conexiones **no jerárquicas** entre casos. La jerarquía (pieza separada de) vive en `Caso.caso_padre_id`; aquí van las demás conexiones.

```ts
interface RelacionEntreCasos {
  id: slug;
  caso_a_id: ref<Caso>;
  caso_b_id: ref<Caso>;
  tipo: enum<TipoRelacionCasos>;         // derivado_de, comparte_actor_con, conexion_factual,
                                          // misma_trama, contradiccion_factual, etc.
  
  descripcion: markdown;                 // qué relación hay, neutro y citable
  documentos_respaldo: array<ref<Documento>>;
  
  // Periodo de la conexión (algunas relaciones tienen ventana temporal)
  fecha_inicio?: Date;
  fecha_fin?: Date;
  
  estado_publicacion: enum<EstadoPublicacion>;
  ultima_revision_editorial: Date;
}
```

**Reglas:**

- Una `RelacionEntreCasos` debe tener al menos un `Documento` en `documentos_respaldo`, salvo que `tipo = comparte_actor_con` (caso en que la relación es derivable de los `RolEnCaso` y no necesita documento adicional).
- La relación es no dirigida salvo para `derivado_de` (donde caso_a deriva de caso_b).
- No se permite `caso_a_id = caso_b_id`.

### 2.9 Delito (catálogo de referencia)

Tabla pequeña de referencia. NO se autogenera; se mantiene a mano contra el Código Penal.

```ts
interface Delito {
  id: slug;                              // ej. "malversacion-caudales-publicos"
  nombre_tipico: string;                 // ej. "Malversación de caudales públicos"
  articulos_cp: array<string>;           // ej. ["art. 432 CP", "art. 433 CP"]
  familia: enum<FamiliaDelito>;          // contra_administracion, contra_patrimonio,
                                          // contra_orden_socioeconomico,
                                          // falsedad_documental, electoral, etc.
  descripcion_breve: markdown;           // 1-2 frases neutras del tipo penal
  enlace_boe?: string;                   // URL al CP en BOE
}
```

---

## 3. Enums catalogados

Los enums siguientes son la lista cerrada inicial. Ampliarlos requiere PR razonado.

**`FaseProcesal`** (estado actual de un Caso o pieza)
- `denuncia_o_querella` — antes de admisión a trámite
- `instruccion` — diligencias previas, fase de instrucción
- `fase_intermedia` — auto de procesamiento o transformación, preparación juicio
- `juicio_oral` — vista oral en curso
- `sentencia_primera_instancia` — dictada, no firme
- `recurso` — apelación o casación pendiente
- `sentencia_firme` — firme, condena o absolución
- `ejecucion` — cumplimiento de pena
- `archivo_provisional` — sobreseimiento provisional, reabrible
- `archivo_libre` — sobreseimiento libre, no reabrible

**`TipoPieza`** (para casos con `caso_padre_id`)
- `pieza_separada` — separación judicial formal
- `derivada_factual` — caso nuevo derivado de hallazgos en el anterior
- `causa_conexa` — causa relacionada acumulada
- `pieza_principal` — la pieza nuclear de una macrocausa (cuando el "padre" es una agrupación editorial)

**`TipoProcedimiento`**
- `diligencias_previas`, `procedimiento_abreviado`, `sumario_ordinario`, `tribunal_jurado`, `causa_especial_aforado`, `recurso_amparo_tc`, `recurso_casacion_ts`, `otro`

**`OrigenDenuncia`**
- `fiscalia_anticorrupcion`, `fiscalia_ordinaria`, `oficio_judicial`, `querella_particular`, `querella_partido_politico`, `querella_asociacion_acusacion_popular`, `denuncia_organismo_publico` (Tribunal de Cuentas, AIReF, etc.), `denuncia_periodistica`, `comparecencia_congreso`, `otro`

**`RolProcesal`**
- Procesales: `denunciante`, `querellante`, `acusacion_particular`, `acusacion_popular`, `investigado`, `procesado`, `acusado`, `condenado`, `absuelto`, `desimputado`, `testigo`, `perjudicado`
- Funcionales: `juez_instructor`, `juez_ponente`, `fiscal`, `abogado_defensa`, `abogado_acusacion`, `perito_judicial`, `perito_parte`, `secretario_judicial`

**`TipoHito`**
- Jurisdiccionales: `denuncia_presentada`, `querella_presentada`, `querella_admitida`, `querella_inadmitida`, `imputacion`, `declaracion_imputado`, `auto_procesamiento`, `auto_transformacion`, `apertura_juicio_oral`, `inicio_vista_oral`, `sentencia_primera_instancia`, `recurso_apelacion`, `sentencia_apelacion`, `recurso_casacion`, `sentencia_firme`, `archivo_provisional`, `sobreseimiento_libre`, `desimputacion`, `cambio_juez`, `cambio_organo`, `acumulacion_causas`, `separacion_pieza`
- Políticos/institucionales: `comparecencia_congreso`, `comision_investigacion_creada`, `informe_organismo_publico`, `dimision`, `cese`, `aforamiento_perdido_o_ganado`
- Mediáticos: `publicacion_investigacion_periodistica` (sólo si tuvo efecto procesal trazable)

**`TipoHecho`**
- `acreditado` — establecido como probado por órgano jurisdiccional
- `investigado` — sostenido por instructor o fiscalía en pieza viva, no acreditado aún
- `atribuido` — sostenido por un actor identificado (acusación popular, parte, perito de parte, medio) sin respaldo jurisdiccional concluyente
- `exculpatorio` — descartado por órgano jurisdiccional (absolución, archivo, desimputación)
- `desmentido` — contradicho por evidencia posterior con fuerza suficiente
- `no_concluyente` — el estado actual no permite categorizar; permanece como "pendiente"

**`TipoDocumento`**
- Jurisdiccionales: `auto_judicial`, `sentencia`, `escrito_fiscalia`, `dictamen_fiscal`, `escrito_defensa`, `escrito_acusacion_particular`, `escrito_acusacion_popular`
- Policiales/instructores: `atestado_policial`, `informe_uco`, `informe_udef`, `informe_pericial`
- Institucionales: `acta_congreso`, `acta_senado`, `video_comparecencia_congreso`, `informe_tribunal_cuentas`, `informe_airef`, `informe_cgpj`, `dictamen_consejo_estado`, `boletin_oficial`
- Periodísticos/divulgativos: `articulo_prensa`, `reportaje_audiovisual`, `libro`, `paper_academico`
- Otros: `nota_prensa_institucional`, `comunicado_partido`, `declaracion_jurada`, `otro`

**`TipoOrganizacion`**
- `juzgado`, `tribunal`, `fiscalia`, `partido_politico`, `empresa`, `asociacion_acusacion_popular`, `organismo_publico`, `policia_judicial_unidad` (UCO, UDEF, UDYCO, ...), `medio_comunicacion`, `sindicato`, `fundacion`, `entidad_financiera`, `consultora`, `otra`

**`Jurisdiccion`**: `penal`, `civil`, `mercantil`, `contencioso_administrativa`, `social`, `militar`, `constitucional`

**`AmbitoTerritorial`**: `local`, `provincial`, `autonomico`, `nacional`, `europeo`, `internacional`

**`TipoRelacionCasos`**
- `derivado_de` (dirigido: A deriva de B)
- `comparte_actor_con`
- `conexion_factual` (mismo hecho desde distintos ángulos procesales)
- `misma_trama` (misma red factual aunque procesalmente desconectados)
- `contradiccion_factual` (los hechos acreditados en uno contradicen los del otro)

**`EstadoPublicacion`**: `borrador`, `en_revision`, `publicado`, `retirado_temporalmente`, `retirado_definitivamente`

**`EstadoAcceso`** (de Documento): `publico`, `acceso_restringido_pero_citable`, `filtrado_verificado`, `retirado`

**`NivelRelevancia`**: `baja`, `media`, `alta`, `capital`

**`FamiliaDelito`** (catálogo abierto, derivado del CP): `contra_administracion_publica`, `contra_patrimonio_y_orden_socioeconomico`, `falsedad_documental`, `delitos_electorales`, `blanqueo_capitales`, `pertenencia_organizacion_criminal`, `cohecho_y_trafico_influencias`, `otros`

**`DominiosOficiales`** (lista blanca para Nivel 1)

Criterio: organismos públicos con personalidad jurídica propia y publicaciones institucionales trazables a un órgano oficial del Estado o de la UE. Lista ampliable mediante PR razonado.

- Poder judicial y fiscalía: `poderjudicial.es`, `cendoj.es`, `cgpj.es`, `fiscal.es`, `tribunalconstitucional.es`.
- Boletines y diarios oficiales: `boe.es`, `eur-lex.europa.eu`.
- Parlamento: `congreso.es`, `senado.es`.
- Órganos consultivos y de control: `tcu.es` (Tribunal de Cuentas), `airef.es`, `defensordelpueblo.es`, `consejo-estado.es`.
- Entidades públicas empresariales y organismos del Estado dependientes del Ministerio de Hacienda u otros ministerios, con personalidad jurídica propia y comunicación institucional pública: `sepi.es` (Sociedad Estatal de Participaciones Industriales), `agenciatributaria.es`, `igae.pap.hacienda.gob.es`.
- Reguladores y supervisores con personalidad jurídica propia: `bde.es` (Banco de España), `cnmv.es` (Comisión Nacional del Mercado de Valores), `cnmc.es` (Comisión Nacional de los Mercados y la Competencia).
- Administración General del Estado: dominios `.gob.es` de ministerios y organismos autónomos.

---

## 4. Validaciones lógicas (resumen consolidado)

Las reglas que CI ejecuta sobre los YAML antes de mergear cualquier PR. Cada una citable por id (`V-NN`) en mensajes de error.

| id | Regla | Severidad |
|----|-------|-----------|
| V-01 | `Caso.caso_padre_id` no produce ciclos | bloqueante |
| V-02 | Si `Caso.fase_actual ∈ {sentencia_firme, archivo_libre, archivo_provisional}`, existe `Hito` correspondiente | bloqueante |
| V-03 | Las transiciones de Fase del `Caso` reconstruidas desde sus `Hito` ordenados son válidas (no se salta etapas, no se retrocede sin reapertura) | bloqueante |
| V-04 | Un `Hecho` tipo `acreditado` cita ≥1 `Documento` de tipo jurisdiccional firme | bloqueante |
| V-05 | Un `Hecho` tipo `investigado` cita ≥1 `Documento` de Nivel 1 ó 2 jurisdiccional/instructor | bloqueante |
| V-06 | Un `Hecho` tipo `exculpatorio` cita ≥1 `Documento` de tipo sentencia absolutoria / auto de archivo / desimputación | bloqueante |
| V-07 | Un `Hecho` tipo `desmentido` cita documentos cuya valoración editorial está justificada en `nivel_fuente_justificacion` | bloqueante |
| V-08 | Una `Persona` con `es_figura_publica = false` no aparece en `Hecho` tipo `acreditado` ni `investigado` sin un `RolEnCaso` activo en el periodo del Hecho | bloqueante |
| V-09 | Un `RolEnCaso` con `delitos_atribuidos` no vacío sólo es válido si `rol ∈ {investigado, procesado, acusado, condenado}` | bloqueante |
| V-10 | Un `RolEnCaso` con `rol = condenado` requiere `hito_origen_id` de tipo sentencia | bloqueante |
| V-11 | Un `RolEnCaso` con `sujeto_tipo = organizacion` sólo permite `rol ∈ {acusacion_popular, acusacion_particular, querellante, denunciante}` | bloqueante |
| V-12 | Un `Documento` de `nivel_fuente = 1` tiene `url_canonica` en lista blanca `DominiosOficiales` o `ruta_local` con hash en repo | bloqueante |
| V-13 | Un `Documento` de tipo `articulo_prensa` no es el único soporte de un `Hecho` tipo `acreditado` ni `investigado` | bloqueante |
| V-14 | Un `Hito` jurisdiccional (imputación, procesamiento, sentencia, archivo, desimputación) tiene `documento_principal_id` informado | bloqueante |
| V-15 | `RelacionEntreCasos` con `tipo ≠ comparte_actor_con` tiene ≥1 `Documento` en `documentos_respaldo` | bloqueante |
| V-16 | Todo `enunciado` de `Hecho` ha pasado revisión `redaccion_neutra_revisada = true` antes de `estado_publicacion = publicado` | bloqueante |
| V-17 | Una `Persona` con `es_figura_publica = false` y todos sus `RolEnCaso` con `fecha_fin` informado (= desimputada/archivada/absuelta) entra en una **revisión editorial obligatoria** para decidir anonimización / retirada de ficha | warning con bloqueo si > 6 meses sin acción |
| V-18 | Toda referencia (`ref<X>`) apunta a un id existente y publicado o en estado coherente | bloqueante |
| V-19 | `nivel_fuente_efectivo` de un `Hecho` coincide con el mejor (menor) nivel entre sus `documentos_respaldo` | bloqueante (auto-corregible) |
| V-20 | `Caso.delitos_atribuidos_en_la_causa` es exactamente la unión de los `delitos_atribuidos` de sus `RolEnCaso` | bloqueante (auto-corregible) |
| V-21 | Slugs son inmutables tras `estado_publicacion = publicado`. Renombrar requiere entrada en tabla `redirects` | bloqueante |

V-17 es la salvaguarda LOPD/honor más sensible: una persona privada que fue temporalmente investigada y luego desimputada **tiene derecho a desaparecer** del sitio o a aparecer con identificadores reducidos. El sistema obliga a revisarlo.

---

## 5. Patrones de uso del modelo (ejemplos)

Validación del modelo contra los casos pre-inventariados.

### 5.1 Macrocausa con muchas piezas: Koldo / Mascarillas / Ábalos

```
Caso(id="koldo", caso_padre_id=null, fase_actual=juicio_oral, nombre_mediatico="Caso Koldo")
├── Caso(id="koldo/mascarillas", caso_padre_id="koldo", fase_actual=juicio_oral)
├── Caso(id="koldo/cerdan", caso_padre_id="koldo", fase_actual=instruccion)
├── Caso(id="koldo/financiacion-psoe", caso_padre_id="koldo", fase_actual=instruccion)
├── Caso(id="koldo/air-europa", caso_padre_id="koldo", fase_actual=instruccion)
└── Caso(id="koldo/hidrocarburos", caso_padre_id="koldo", fase_actual=instruccion)
```

- El padre `koldo` no tiene un `numero_procedimiento` propio si es una agrupación editorial; en ese caso su `organo_judicial_id` apunta al órgano del que parte la macrocausa (Sala Segunda TS) y `tipo_pieza = pieza_principal` en sus hijas indica cuál es la causa nuclear.
- Cada hija tiene su propio `organo_judicial_id`, su propia `fase_actual`, su propia lista de `RolEnCaso`.
- La UI del padre agrega los `RolEnCaso` de las hijas: Ábalos aparece como investigado en `koldo/mascarillas` y `koldo/financiacion-psoe`, no en `koldo/cerdan`.
- Cerdán aparece como `condenado` o `investigado` (según pieza) en `koldo/cerdan`; el sistema NO infiere su rol en el padre.

### 5.2 Persona con trayectoria: Begoña Gómez

```
Persona(id="begona-gomez", es_figura_publica=true /* cónyuge del Presidente del Gobierno */)

RolEnCaso(id="bg-jdo41-investigada-2024-04", caso_id="begona-gomez", 
  rol=investigado, fecha_inicio=2024-04-22, hito_origen=hito_imputacion_inicial)
  
RolEnCaso(id="bg-jdo41-procesada-2026-04", caso_id="begona-gomez",
  rol=procesado, fecha_inicio=2026-04-XX, hito_origen=hito_procesamiento_2026)

// Para la pieza de tráfico de influencias por la que la AP la desimputó:
RolEnCaso(id="bg-jdo41-pieza-X-investigada", caso_id="begona-gomez/pieza-X",
  rol=investigado, fecha_inicio=..., fecha_fin=..., 
  hito_fin=hito_desimputacion_ap_madrid)
RolEnCaso(id="bg-jdo41-pieza-X-desimputada", caso_id="begona-gomez/pieza-X",
  rol=desimputado, fecha_inicio=fecha_auto_ap, hito_origen=hito_desimputacion_ap_madrid)
```

- La trayectoria queda registrada como secuencia de `RolEnCaso`. La UI puede dibujar un *swimlane* por persona mostrando los roles a lo largo del tiempo.
- Los `Hecho` ligados a la pieza X de los que la AP la desimputa tienen `tipo = investigado` con `corregido_por` apuntando a Hechos `tipo = exculpatorio` introducidos por el auto de la AP. El UI los muestra tachados o agrupados en una sección "Hechos superados".

### 5.3 Discrepancia fiscalía vs acusación popular

Caso Plus Ultra, sobre el préstamo SEPI:

```
Hecho(id="pu-prestamo-sepi", tipo=acreditado,
  enunciado="SEPI aprobó un préstamo de 53M€ a Plus Ultra el 2020-06-22",
  documentos_respaldo=[auto_sepi_publicado_boe])

Hecho(id="pu-cumplimiento-criterios", tipo=atribuido,
  enunciado="Según la SEPI, el préstamo cumplía los criterios técnicos para 
             empresas estratégicas afectadas por COVID.",
  documentos_respaldo=[nota_prensa_sepi_2021])

Hecho(id="pu-incumplimiento-criterios", tipo=investigado,
  enunciado="Según el informe UDEF y el escrito de Manos Limpias como acusación popular,
             Plus Ultra no cumplía los criterios técnicos al carecer de la dimensión 
             estratégica exigida.",
  documentos_respaldo=[informe_udef_2022, escrito_manos_limpias_2022],
  contraposicion_a="pu-cumplimiento-criterios")
```

La UI presenta los dos últimos Hechos enfrentados con sus tipos respectivos y los actores claramente identificados. El lector ve quién sostiene qué, con qué nivel de fuente, y por qué un Hecho no anula al otro: están en contraposición pendiente.

### 5.4 Conexión entre casos: González Amador ↔ García Ortiz

```
Caso(id="gonzalez-amador-fraude-fiscal", ...)
Caso(id="fge-revelacion-secretos-garcia-ortiz", ...)

RelacionEntreCasos(
  id="amador-fge-2024",
  caso_a_id="gonzalez-amador-fraude-fiscal",
  caso_b_id="fge-revelacion-secretos-garcia-ortiz",
  tipo=conexion_factual,
  descripcion="El procedimiento contra el FGE se origina por la presunta filtración 
               de datos del expediente fiscal de González Amador, datos que el FGE 
               manejaba en su condición institucional.",
  documentos_respaldo=[sentencia_ts_fge_2025])
```

### 5.5 Caso histórico firme con múltiples desenlaces: ERE de Andalucía (validación del modelo)

ERE no está en el alcance temporal 2018→hoy del MVP, pero conviene probar el modelo:

```
Caso(id="ere-andalucia", caso_padre_id=null, fase_actual=sentencia_firme)
├── Pieza "específica" — RolEnCaso[condenado] para X personas
├── Pieza "procedimiento específico" — RolEnCaso[absuelto] para Y personas
└── Revisión TC — Hito(tipo=informe_organismo_publico, ...)
                  Hito(tipo=sentencia_apelacion, ...)
                  // produce Hecho(tipo=exculpatorio) para algunos condenados
```

El modelo absorbe condenas y absoluciones en la misma macrocausa sin contradicción. La revisión del TC se modela como una secuencia de `Hito` que introducen `Hecho` tipo `exculpatorio` con `corregido_por` apuntando a Hechos previos `acreditado`. Los `RolEnCaso` afectados ganan un sucesor con `rol = absuelto` y `hito_origen` = auto del TC.

---

## 6. Anti-patrones (errores que el modelo previene)

- **❌ Etiquetar casos con nombre de no imputados.** Si Zapatero no está imputado en Plus Ultra, su id de Caso no debe ser `zapatero-plus-ultra`. El campo `nombre_mediatico` puede recoger esa asociación coloquial pero el id y la lista de investigados son fríos.
- **❌ Fase única para macrocausa con piezas en estados distintos.** No existe `Caso.fase_actual = "parte juicio oral, parte instrucción"`. La fase del padre se *agrega visualmente* a partir de las hijas; en datos cada hija tiene su fase.
- **❌ Hecho sin documento.** No hay `Hecho` huérfano. Si no hay documento, no hay hecho publicable; hay nota interna en `borrador`.
- **❌ Confundir rol funcional con procesal.** Un fiscal o un juez no son "parte" del caso en sentido procesal-implicación; son roles funcionales. Mezclarlos en listados induce a confusión grave ("ese juez está imputado").
- **❌ Persona privada en Hecho acreditado sin RolEnCaso.** Mencionar a un particular en una afirmación acreditada sin que aparezca formalmente en el procedimiento es exactamente el tipo de violación de honor que cierra un sitio. CI lo bloquea (V-08).
- **❌ Documento Nivel 1 sin dominio oficial.** Si alguien marca un PDF random como Nivel 1, CI lo rechaza (V-12). Los niveles no son auto-asignables.
- **❌ Borrar Hechos superados.** Cuando una desimputación cambia el estado, los Hechos previos no se borran; se marcan como `vigencia = superado` y `corregido_por`. La UI los oculta del flujo principal pero permanecen visibles en la sección "Trayectoria del caso" o "Hechos superados".

---

## 7. Cuestiones abiertas (parking lot)

Cosas que el modelo todavía no resuelve y que conviene cerrar antes o durante la fase 2 (modelo de ficha UX).

1. **Multilingüismo del contenido editorial.** Casos catalanes/vascos/gallegos tendrán Documentos en lengua cooficial (catálogo `IdiomaDocumento` ya lo prevé). Pero ¿el `enunciado` de los `Hecho` se redacta sólo en castellano, o también en lengua cooficial? Propuesta: castellano por defecto en MVP; estructura para soportar traducciones añadiendo `traducciones?: { [lang]: markdown }`. Decisión: aplazada al diseño de la ficha.
2. **Aforamiento y cambios de competencia.** Cuando un aforado pierde el aforamiento, el caso puede pasar de TS a juzgado ordinario. Esto se modela con un `Hito(tipo=cambio_organo)` y opcionalmente actualizando `Caso.organo_judicial_id`. ¿Versionado del `organo_judicial_id` o sólo último valor? Propuesta: sólo último, historial vía Hitos. Confirmar.
3. **Cantidades implicadas estructuradas.** Hoy `Caso.resumen_cifras` es markdown libre y los Hechos pueden mencionar cifras. Si quisiéramos agregables ("total bajo investigación en casos vivos") necesitaríamos un `Importe` tipado en `Hecho`. Pendiente: ¿lo necesita el MVP? Si no, fuera.
4. **Conexiones persona-persona directas.** Hoy las conexiones entre personas emergen de compartir `RolEnCaso` en mismos casos. ¿Necesitamos también una entidad `RelacionEntrePersonas` (cónyuge, socio mercantil, jefe-subordinado) o lo dejamos derivado? Riesgo legal de modelar relaciones personales explícitamente es alto. Propuesta: NO en MVP; sólo lo derivable de casos.
5. **Materialización canónica: YAML vs MDX.** El modelo conceptual es agnóstico. Pero la decisión de si los `Hecho`-`enunciado` viven en YAML como string Markdown o en archivos `.md` con frontmatter YAML afecta a la usabilidad del PR diff. Decisión arquitectónica, no de modelo.
6. **Versionado de Documentos.** Si una sentencia se publica en CENDOJ y luego se anonimiza/reedita, ¿guardamos el primer hash y la primera URL? Propuesta: campo `versiones: array<{ fecha, url, hash }>` en `Documento`. Aplazada.
7. **Comentarios / notas internas editoriales.** Las discusiones en PRs viven en GitHub. Pero conviene saber si queremos un campo `notas_internas` en entidades para anotaciones del maintainer que no se publican. Riesgo: si se filtran, son embarazosos. Propuesta: NO. Discusión va en PRs y issues, no en el dato.

---

## 8. Siguiente paso

Cerrado este documento (con tus comentarios), los entregables 2-6 del brief original son:

- **02 — Modelo de ficha de caso (UX/contenido).** Cómo se traduce este modelo a las secciones de la página de un caso. Mucho de lo decidido aquí (separación acreditado/investigado, swimlane de roles por persona, hechos en contraposición) ya guía esa pieza.
- **03 — Estrategia de mantenimiento.** Cómo detectar cambios diarios sin que sea full-time. Alertas BOE, CENDOJ RSS, monitorización CGPJ, uso de LLM para preparar diffs, ritmo de revisión.
- **04 — Riesgos legales y éticos.** LOPD, derecho al honor, presunción de inocencia, derecho de rectificación, opciones de identificación del responsable del sitio, disclaimer.
- **05 — Arquitectura técnica.** Stack candidato (SSG + repo content + index búsqueda + visualización grafo), opciones razonadas para alguien con tu background.
- **06 — Roadmap por fases.** MVP = un caso completamente fichado (sugerencia Plus Ultra).

Sugiero atacarlos en ese orden: 02 valida que el modelo cierra; 03-04 enmarcan los límites operativos y legales antes de comprometer arquitectura; 05 elige stack con los requisitos ya cerrados; 06 traduce todo a fases ejecutables.
