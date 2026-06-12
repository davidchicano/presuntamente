// Astro Content Collections — fuente de verdad para tipos en build.
//
// Las collections leen los YAML de /content/ y los exponen tipados a las
// páginas vía `getCollection()` / `getEntry()`. Los Zod schemas aquí son
// MÍNIMOS VIABLES: cubren los campos que el sitio consume hoy, sin duplicar
// los JSON Schemas de /schemas/ (que siguen siendo la validación canónica
// ejecutada por `pnpm validate`). Cada schema usa `.passthrough()` para no
// romper si los YAML traen campos extra todavía no tipados aquí.
//
// IDs: por defecto el glob loader genera el id a partir del path.
//   - Entidades de primer nivel (`casos`, `personas`, `organizaciones`,
//     `documentos`, `delitos`, `glosario`, `relaciones`, `vinculos`): el id de
//     la collection es `data.id` del YAML, que es global y se usa como slug en
//     las rutas (`/casos/<id>`, `/personas/<id>`…).
//   - Subentidades anidadas en un caso (`roles`, `hitos`, `hechos`): su
//     `data.id` sólo es único DENTRO de su caso (la misma persona puede tener
//     el mismo rol descriptivo en varios casos, p. ej. `ruz-juez-instructor`),
//     así que el id de collection se prefija con el slug del caso:
//     `<caso>/<data.id>`. El glob loader exige id único por collection; sin el
//     prefijo, dos casos con el mismo `data.id` colisionan y uno sobrescribe al
//     otro (pérdida silenciosa de datos). La app nunca usa este id: filtra por
//     `data.caso_id` y lee `data.id` (anclas `#hito-…`/`#hecho-…`, feed). Un
//     duplicado real DENTRO de un mismo caso sigue avisando en build.

// Prefija el id de collection con el slug del caso para las subentidades
// anidadas. `entry` es la ruta relativa al base (`<caso>/<tipo>/<fichero>.yaml`).
// El tipo de las opciones del loader (`GenerateIdOptions`) no se exporta desde
// Astro, así que lo anotamos estructuralmente.
const generateIdConCaso = ({
  entry,
  data,
}: {
  entry: string;
  data: Record<string, unknown>;
}) => `${entry.split('/')[0]}/${String(data.id)}`;

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// El glob loader detecta el parser por extensión: para `.yaml`/`.yml` invoca
// `yaml` (ya instalado como dependencia transitiva). No pasamos `parser`
// porque el tipo `GlobOptions` no lo expone como opción pública en Astro 5.

// --- Slots compartidos -------------------------------------------------------

// Slot común a todas las collections con campo `estado_publicacion`.
// Caso usa los 7 valores; el resto sólo usa el subconjunto de 5 históricos
// (`pendiente` y `beta_publica` son específicos del ciclo de vida editorial
// de una ficha de caso, no de una Persona/Organizacion/Documento).
const ESTADO_PUBLICACION = z.enum([
  'pendiente',
  'borrador',
  'beta_publica',
  'en_revision',
  'publicado',
  'retirado_temporalmente',
  'retirado_definitivamente',
]);

const FASE = z.enum([
  'denuncia_o_querella',
  'instruccion',
  'fase_intermedia',
  'juicio_oral',
  'sentencia_primera_instancia',
  'recurso',
  'sentencia_firme',
  'ejecucion',
  'archivo_provisional',
  'archivo_libre',
]);

const ESTADO_CHEQUEO = z.enum([
  'completo',
  'parcial',
  'pendiente',
  'no_aplica',
]);

// --- casos -------------------------------------------------------------------

const casos = defineCollection({
  loader: glob({
    pattern: '*/caso.yaml',
    base: './content/casos',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      nombre_oficial: z.string(),
      nombre_mediatico: z.string(),
      nombres_alternativos: z.array(z.string()).default([]),
      descripcion_corta: z.string().optional(),
      sintesis_caso: z
        .object({
          que_se_investiga: z.string(),
          hechos_clave: z.array(z.string()),
          estado_actual: z.string(),
          cifras_clave: z.array(z.string()).default([]),
        })
        .optional(),
      caso_padre_id: z.string().optional(),
      organo_judicial_id: z.string(),
      numero_procedimiento: z.string().optional(),
      tipo_procedimiento: z.string().optional(),
      fase_actual: FASE,
      fecha_apertura: z.string(),
      fecha_cierre: z.string().optional(),
      origen_denuncia: z.string(),
      querellante_inicial_id: z.string().optional(),
      delitos_atribuidos_en_la_causa: z.array(z.string()).default([]),
      resumen_cifras: z.string().optional(),
      estado_publicacion: ESTADO_PUBLICACION,
      ultima_revision_editorial: z.string().optional(),
      nivel_relevancia_editorial: z
        .enum(['baja', 'media', 'alta', 'capital'])
        .optional(),
      estado_ficha: z
        .object({
          cronologia: ESTADO_CHEQUEO,
          roles_procesales: ESTADO_CHEQUEO,
          documentos_primarios: ESTADO_CHEQUEO,
          hechos_modelados: ESTADO_CHEQUEO,
          fuentes_cruzadas: ESTADO_CHEQUEO,
          composicion_fuentes_citadas: ESTADO_CHEQUEO,
          vinculos_institucionales: ESTADO_CHEQUEO,
          conexiones: ESTADO_CHEQUEO,
          cobertura_mediatica_general: ESTADO_CHEQUEO,
          revision_editorial: ESTADO_CHEQUEO,
          notas: z.string().optional(),
          fecha_actualizacion: z.string().optional(),
        })
        .optional(),
      // Sección «Contenido considerado y no modelado» (doc 02 §2.13, P-11).
      contenido_no_modelado: z
        .array(
          z.object({
            id: z.string(),
            texto: z.string(),
            fecha_revision: z.string(),
            fuentes: z
              .array(
                z.object({
                  medio_id: z.string(),
                  titular: z.string(),
                  fecha: z.string(),
                  url: z.string(),
                  url_archivo: z.string().optional(),
                }),
              )
              .optional(),
          }),
        )
        .optional(),
    })
    .passthrough(),
});

// --- personas ----------------------------------------------------------------

const personas = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/personas',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      nombre_completo: z.string(),
      nombres_alternativos: z.array(z.string()).default([]),
      es_figura_publica: z.boolean(),
      cargo_publico_actual: z.string().optional(),
      biografia_corta: z.string().optional(),
      fallecido: z.boolean().default(false),
      estado_publicacion: ESTADO_PUBLICACION,
    })
    .passthrough(),
});

// --- organizaciones ----------------------------------------------------------

const organizaciones = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/organizaciones',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      nombre: z.string(),
      nombres_alternativos: z.array(z.string()).default([]),
      tipo: z.string(),
      descripcion_corta: z.string().optional(),
      siglas: z.string().optional(),
      url_canonica: z.string().optional(),
      estado_publicacion: ESTADO_PUBLICACION,
    })
    .passthrough(),
});

// --- documentos --------------------------------------------------------------

const documentos = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/documentos',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      titulo: z.string(),
      tipo: z.string(),
      nivel_fuente: z.number().int().min(1).max(4),
      productor_organizacion_id: z.string().optional(),
      fecha_documento: z.string(),
      fecha_publicacion: z.string().optional(),
      url_canonica: z.string().optional(),
      caso_principal_id: z.string().optional(),
      estado_publicacion: ESTADO_PUBLICACION,
    })
    .passthrough(),
});

// --- delitos -----------------------------------------------------------------

const delitos = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/delitos',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      nombre_tipico: z.string(),
      articulos_cp: z.array(z.string()),
      familia: z.string(),
      descripcion_breve: z.string().optional(),
      enlace_boe: z.string().optional(),
    })
    .passthrough(),
});

// --- glosario ----------------------------------------------------------------
//
// "Cosas de interés" no jerárquicas que se citan en prosa sin ser entidades
// formales: programas o fondos públicos por nombre comercial, operaciones
// policiales nombradas, sobrenombres mediáticos de tramas. RichProse las
// detecta automáticamente y las renderiza con dotted underline + tooltip
// (sin link interno ni externo por defecto, por seguridad editorial).

const glosario = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/glosario',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      label: z.string(),
      nombres_alternativos: z.array(z.string()).default([]),
      categoria: z.enum(['programa_publico', 'operacion_policial', 'trama_sobrenombre', 'otra']),
      descripcion_breve: z.string(),
      estado_publicacion: z.enum(['borrador', 'publicado', 'retirado']),
      ultima_revision_editorial: z.string(),
    })
    .passthrough(),
});

// --- hitos (anidados en casos/<slug>/hitos/) ---------------------------------

const hitos = defineCollection({
  loader: glob({
    pattern: '*/hitos/*.yaml',
    base: './content/casos',
    generateId: generateIdConCaso,
  }),
  schema: z
    .object({
      id: z.string(),
      caso_id: z.string(),
      tipo: z.string(),
      fecha: z.string(),
      fecha_precision: z.enum(['dia', 'mes', 'anio']),
      titulo: z.string(),
      descripcion: z.string().optional(),
      personas_afectadas: z.array(z.string()).default([]),
      organizaciones_afectadas: z.array(z.string()).default([]),
      documento_principal_id: z.string().optional(),
      fase_resultante: FASE.optional(),
    })
    .passthrough(),
});

// --- hechos (anidados en casos/<slug>/hechos/) -------------------------------

const hechos = defineCollection({
  loader: glob({
    pattern: '*/hechos/*.yaml',
    base: './content/casos',
    generateId: generateIdConCaso,
  }),
  schema: z
    .object({
      id: z.string(),
      caso_id: z.string(),
      enunciado: z.string(),
      tipo: z.enum([
        'acreditado',
        'investigado',
        'atribuido',
        'exculpatorio',
        'desmentido',
        'no_concluyente',
      ]),
      fecha_o_periodo: z
        .object({
          desde: z.string(),
          hasta: z.string().optional(),
          precision: z.enum(['dia', 'mes', 'anio', 'rango']),
        })
        .passthrough(),
      // Importe presuntamente atribuido (opcional). Canon en
      // schemas/hecho.schema.json + docs/web/features/importe-presunto.md.
      importe: z.number().positive().optional(),
      importe_moneda: z.string().default('EUR'),
      importe_alcance: z
        .enum(['total_caso', 'componente', 'individual'])
        .optional(),
      importe_clase: z.enum(['objeto', 'consecuencia']).optional(),
      importe_naturaleza: z
        .enum([
          'perjuicio',
          'objeto_contrato',
          'fondo_publico_concedido',
          'comision_ilicita',
          'cobro_indebido',
          'multa_penal',
          'responsabilidad_civil',
          'gasto_publico_cuestionado',
          'otro',
        ])
        .optional(),
      importe_nota: z.string().optional(),
      // Atribución del importe por sujeto: papel económico (distinto del rol
      // procesal). Permite la vista de cifras por persona/organización sin
      // misatribuir (el quebranto de una víctima nunca se suma al investigado).
      // Canon en schemas/hecho.schema.json y docs/diseno/01-modelo-de-datos.md §2.6.
      importe_atribucion: z
        .array(
          z
            .object({
              sujeto_tipo: z.enum(['persona', 'organizacion']),
              sujeto: z.string(),
              papel: z.enum([
                'activo',
                'beneficiario',
                'perjudicado',
                'obligado',
                'acreedor',
              ]),
              importe_sujeto: z.number().positive().optional(),
              nota: z.string().optional(),
            })
            .passthrough(),
        )
        .optional(),
      vigencia: z.enum(['vigente', 'superado', 'retirado']),
      estado_publicacion: ESTADO_PUBLICACION,
    })
    .passthrough(),
});

// --- roles (anidados en casos/<slug>/roles/) ---------------------------------

const roles = defineCollection({
  loader: glob({
    pattern: '*/roles/*.yaml',
    base: './content/casos',
    generateId: generateIdConCaso,
  }),
  schema: z
    .object({
      id: z.string(),
      caso_id: z.string(),
      sujeto_tipo: z.enum(['persona', 'organizacion']),
      sujeto_persona_id: z.string().optional(),
      sujeto_organizacion_id: z.string().optional(),
      rol: z.string(),
      delitos_atribuidos: z.array(z.string()).default([]),
      fecha_inicio: z.string(),
      fecha_fin: z.string().optional(),
      hito_origen_id: z.string().optional(),
      hito_fin_id: z.string().optional(),
      notas: z.string().optional(),
    })
    .passthrough(),
});

// --- relaciones-entre-casos --------------------------------------------------
//
// Conexión NO jerárquica entre dos casos del inventario. La jerarquía padre-pieza
// vive en Caso.caso_padre_id; aquí se modelan vínculos transversales
// (derivado_de, conexion_factual, misma_trama, etc.). La validación canónica
// del schema vive en /schemas/relacion-entre-casos.schema.json (V-15: salvo
// `comparte_actor_con`, exigen al menos un documento de respaldo).

const relaciones = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/relaciones-entre-casos',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      caso_a_id: z.string(),
      caso_b_id: z.string(),
      tipo: z.enum([
        'derivado_de',
        'comparte_actor_con',
        'conexion_factual',
        'misma_trama',
        'contradiccion_factual',
      ]),
      descripcion: z.string(),
      documentos_respaldo: z.array(z.string()).default([]),
      fecha_inicio: z.string().optional(),
      fecha_fin: z.string().optional(),
      estado_publicacion: ESTADO_PUBLICACION,
      ultima_revision_editorial: z.string().optional(),
    })
    .passthrough(),
});

// --- vinculos-institucionales ------------------------------------------------
//
// Relaciones documentadas Persona/Organizacion ↔ Organizacion/Persona tipadas
// por naturaleza (cargo público electo/designado/judicial, cargo orgánico de
// partido, directivo público o privado, nombramiento por gobierno concreto,
// acusación/perjudicado/entidad investigada en caso, vínculo familiar público,
// económico o profesional documentado). Exige documentos_respaldo[] ≥ 1.
// Schema canónico en /schemas/vinculo-institucional.schema.json.
// Los datos los meterán agentes paralelos con la skill /documentar-vinculos.

const NATURALEZA_VINCULO = z.enum([
  'cargo_publico_electo',
  'cargo_publico_designado',
  'cargo_funcionarial_carrera',
  'cargo_judicial',
  'cargo_organico_partido',
  'cargo_directivo_empresa_publica',
  'cargo_directivo_organizacion_privada',
  'cargo_academico_publico',
  'cargo_organizacion_civica',
  'nombramiento_por_gobierno',
  'acusacion_institucional_en_caso',
  'perjudicado_institucional_en_caso',
  'entidad_investigada_en_caso',
  'ambito_administrativo_directo_del_acto_en_caso',
  'caja_partido_objeto_investigacion_en_caso',
  'afectacion_indirecta_en_caso',
  'vinculo_familiar_publico',
  'vinculo_economico_documentado',
  'vinculo_profesional_documentado',
]);

const NIVEL_AFECTACION = z.enum(['directa', 'indirecta']);

const vinculos = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/vinculos',
    generateId: ({ data }) => String(data.id),
  }),
  schema: z
    .object({
      id: z.string(),
      naturaleza: NATURALEZA_VINCULO,
      descripcion: z.string(),
      sujeto_persona_id: z.string().optional(),
      sujeto_organizacion_id: z.string().optional(),
      objeto_organizacion_id: z.string().optional(),
      objeto_persona_id: z.string().optional(),
      cargo_o_rol: z.string().optional(),
      desde: z.string(),
      hasta: z.string().optional(),
      vigente: z.boolean().optional(),
      gobierno_o_legislatura: z.string().optional(),
      relevancia_para_caso_ids: z.array(z.string()).default([]),
      nivel_afectacion: NIVEL_AFECTACION.optional(),
      justificacion_afectacion: z.string().optional(),
      documentos_respaldo: z
        .array(
          z.object({
            documento_id: z.string(),
            pasaje: z.string().optional(),
            nota: z.string().optional(),
          }),
        )
        .min(1),
      notas: z.string().optional(),
      estado_publicacion: ESTADO_PUBLICACION,
      ultima_revision_editorial: z.string().optional(),
    })
    .passthrough(),
});

// --- cobertura-mediatica -----------------------------------------------------
//
// Corpus rastreado de noticias publicadas sobre un Caso, separado del corpus
// de Documentos que respaldan Hechos. Una entrada YAML por Caso, con
// metodología explícita y lista de noticias deduplicadas. Schema canónico
// en /schemas/cobertura-mediatica.schema.json. Los datos los meterán
// agentes paralelos con la skill /rastrear-cobertura.

const TIPO_PIEZA = z.enum([
  'noticia',
  'reportaje',
  'entrevista',
  'analisis',
  'editorial',
  'opinion',
  'columna',
  'pieza_agencia',
  'suelto',
  'tv_radio',
  'investigacion_periodistica',
]);

const coberturaMediatica = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './content/cobertura-mediatica',
    generateId: ({ data }) => String(data.caso_id),
  }),
  schema: z
    .object({
      caso_id: z.string(),
      fecha_rastreo: z.string(),
      metodologia: z
        .object({
          terminos_busqueda: z.array(z.string()).min(1),
          ventanas_temporales: z
            .array(
              z.object({
                desde: z.string(),
                hasta: z.string().optional(),
                notas: z.string().optional(),
              }),
            )
            .min(1),
          fuentes_buscadas: z.array(z.string()).optional(),
          criterios_inclusion: z.string().optional(),
          criterios_exclusion: z.string().optional(),
          notas: z.string().optional(),
        })
        .passthrough(),
      estado: z.enum(['pendiente', 'parcial', 'completo']),
      ultima_revision_editorial: z.string().optional(),
      noticias: z
        .array(
          z
            .object({
              id: z.string(),
              url: z.string(),
              medio_id: z.string(),
              titular: z.string(),
              subtitulo: z.string().optional(),
              fecha_publicacion: z.string(),
              autor: z.string().optional(),
              resumen: z.string().optional(),
              url_archivo: z.string().optional(),
              tipo_pieza: TIPO_PIEZA,
              relevancia_editorial: z
                .enum(['capital', 'alta', 'media', 'baja'])
                .optional(),
              pieza_referenciada_id: z.string().optional(),
              menciones: z
                .array(
                  z.enum(['titular', 'lead', 'cuerpo', 'destacado', 'pie_foto']),
                )
                .optional(),
              fecha_rastreo: z.string().optional(),
              notas: z.string().optional(),
            })
            .passthrough(),
        )
        .default([]),
    })
    .passthrough(),
});

export const collections = {
  casos,
  personas,
  organizaciones,
  documentos,
  delitos,
  glosario,
  hitos,
  hechos,
  roles,
  relaciones,
  vinculos,
  coberturaMediatica,
};
