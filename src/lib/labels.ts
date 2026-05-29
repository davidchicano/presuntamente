// Mapeos enum → label legible (castellano administrativo).
// Reusable por todas las páginas del sitio. Cuando entre el catalán (i18n
// nativo), añadir aquí una segunda rama indexada por idioma.

export type Lang = 'es' | 'ca';

// --- Roles procesales --------------------------------------------------------

const ROL_LABEL_ES: Record<string, string> = {
  denunciante: 'Denunciante',
  querellante: 'Querellante',
  acusacion_particular: 'Acusación particular',
  acusacion_popular: 'Acusación popular',
  investigado: 'Investigado',
  procesado: 'Procesado',
  acusado: 'Acusado',
  condenado_no_firme: 'Condenado (no firme)',
  condenado_firme: 'Condenado (firme)',
  absuelto: 'Absuelto',
  desimputado: 'Desimputado',
  testigo: 'Testigo',
  perjudicado: 'Perjudicado',
  juez_instructor: 'Juez instructor',
  juez_ponente: 'Juez ponente',
  fiscal: 'Fiscal',
  abogado_defensa: 'Abogado defensa',
  abogado_acusacion: 'Abogado acusación',
  perito_judicial: 'Perito judicial',
  perito_parte: 'Perito de parte',
  secretario_judicial: 'Letrado de la Administración de Justicia',
};

export function rolLabel(rol: string, _lang: Lang = 'es'): string {
  return ROL_LABEL_ES[rol] ?? rol;
}

// Agrupación por categoría que usa la ficha (doc 02, sección "Personas implicadas").
// El grupo `condenado` cubre ambos sub-roles (firme y no firme): editorialmente
// ambos van en la sección de condenados, pero el badge UI los distingue.
const ROL_GRUPO: Record<string, 'imputacion_activa' | 'condenado' | 'exculpado' | 'otros' | 'funcional'> = {
  investigado: 'imputacion_activa',
  procesado: 'imputacion_activa',
  acusado: 'imputacion_activa',
  condenado_no_firme: 'condenado',
  condenado_firme: 'condenado',
  absuelto: 'exculpado',
  desimputado: 'exculpado',
  testigo: 'otros',
  perjudicado: 'otros',
  denunciante: 'otros',
  querellante: 'otros',
  acusacion_particular: 'otros',
  acusacion_popular: 'otros',
  juez_instructor: 'funcional',
  juez_ponente: 'funcional',
  fiscal: 'funcional',
  abogado_defensa: 'funcional',
  abogado_acusacion: 'funcional',
  perito_judicial: 'funcional',
  perito_parte: 'funcional',
  secretario_judicial: 'funcional',
};

export function rolGrupo(rol: string) {
  return ROL_GRUPO[rol] ?? 'otros';
}

// Familia visual del badge: F-estado (rol del lado acusado, dot + fondo suave sin borde) vs
// F-función (acusación civil, parte civil, aparato judicial, con border-left
// grueso + SVG + fondo neutro). Centraliza la lógica para que RolBadge la
// consulte y nadie más tenga que saberlo. Ver DESIGN.md — "Sistema de badges".
const ROL_FAMILIA: Record<string, 'estado' | 'funcion-civil' | 'funcion-aparato'> = {
  investigado: 'estado',
  procesado: 'estado',
  acusado: 'estado',
  condenado_no_firme: 'estado',
  condenado_firme: 'estado',
  absuelto: 'estado',
  desimputado: 'estado',
  testigo: 'estado',
  denunciante: 'funcion-civil',
  querellante: 'funcion-civil',
  acusacion_particular: 'funcion-civil',
  acusacion_popular: 'funcion-civil',
  perjudicado: 'funcion-civil',
  juez_instructor: 'funcion-aparato',
  juez_ponente: 'funcion-aparato',
  fiscal: 'funcion-aparato',
  abogado_defensa: 'funcion-aparato',
  abogado_acusacion: 'funcion-aparato',
  perito_judicial: 'funcion-aparato',
  perito_parte: 'funcion-aparato',
  secretario_judicial: 'funcion-aparato',
};

export function rolFamilia(rol: string) {
  return ROL_FAMILIA[rol] ?? 'estado';
}

// --- Tipos de Organización ---------------------------------------------------

const TIPO_ORG_LABEL_ES: Record<string, string> = {
  juzgado: 'Juzgado',
  tribunal: 'Tribunal',
  fiscalia: 'Fiscalía',
  partido_politico: 'Partido político',
  empresa: 'Empresa',
  asociacion_acusacion_popular: 'Asociación / acusación popular',
  organismo_publico: 'Organismo público',
  policia_judicial_unidad: 'Policía judicial',
  medio_comunicacion: 'Medio de comunicación',
  sindicato: 'Sindicato',
  fundacion: 'Fundación',
  entidad_financiera: 'Entidad financiera',
  consultora: 'Consultora',
  otra: 'Otra',
};
export function tipoOrgLabel(tipo: string, _lang: Lang = 'es'): string {
  return TIPO_ORG_LABEL_ES[tipo] ?? tipo;
}

// --- Tipos de Hito -----------------------------------------------------------

const TIPO_HITO_LABEL_ES: Record<string, string> = {
  denuncia_presentada: 'Denuncia presentada',
  querella_presentada: 'Querella presentada',
  querella_admitida: 'Querella admitida',
  querella_inadmitida: 'Querella inadmitida',
  imputacion: 'Imputación',
  declaracion_imputado: 'Declaración del investigado',
  auto_procesamiento: 'Auto de procesamiento',
  auto_transformacion: 'Auto de transformación',
  escrito_conclusiones_provisionales: 'Escrito de conclusiones provisionales',
  apertura_juicio_oral: 'Apertura de juicio oral',
  inicio_vista_oral: 'Inicio de vista oral',
  sentencia_primera_instancia: 'Sentencia de 1ª instancia',
  recurso_apelacion: 'Recurso de apelación',
  sentencia_apelacion: 'Sentencia de apelación',
  recurso_casacion: 'Recurso de casación',
  sentencia_firme: 'Sentencia firme',
  archivo_provisional: 'Archivo provisional',
  sobreseimiento_libre: 'Sobreseimiento libre',
  desimputacion: 'Desimputación',
  cambio_juez: 'Cambio de juez',
  cambio_organo: 'Cambio de órgano',
  acumulacion_causas: 'Acumulación de causas',
  separacion_pieza: 'Separación de pieza',
  comparecencia_congreso: 'Comparecencia en el Congreso',
  comision_investigacion_creada: 'Comisión de investigación',
  informe_organismo_publico: 'Informe institucional',
  dimision: 'Dimisión',
  cese: 'Cese',
  aforamiento_perdido_o_ganado: 'Aforamiento',
  publicacion_investigacion_periodistica: 'Investigación periodística',
};
export function tipoHitoLabel(tipo: string): string {
  return TIPO_HITO_LABEL_ES[tipo] ?? tipo;
}

export function tipoHitoFamilia(tipo: string): 'jurisdiccional' | 'politico' | 'mediatico' {
  if (
    tipo === 'dimision' ||
    tipo === 'cese' ||
    tipo === 'comparecencia_congreso' ||
    tipo === 'comision_investigacion_creada' ||
    tipo === 'aforamiento_perdido_o_ganado'
  ) {
    return 'politico';
  }
  if (tipo === 'publicacion_investigacion_periodistica') {
    return 'mediatico';
  }
  return 'jurisdiccional';
}

// --- Fases procesales --------------------------------------------------------

const FASE_LABEL_ES: Record<string, string> = {
  denuncia_o_querella: 'Denuncia o querella',
  instruccion: 'Instrucción',
  fase_intermedia: 'Fase intermedia',
  juicio_oral: 'Juicio oral',
  sentencia_primera_instancia: 'Sentencia de 1ª instancia',
  recurso: 'En recurso',
  sentencia_firme: 'Sentencia firme',
  ejecucion: 'En ejecución',
  archivo_provisional: 'Archivo provisional',
  archivo_libre: 'Archivo libre',
};
export function faseLabel(fase: string): string {
  return FASE_LABEL_ES[fase] ?? fase;
}

// --- Tipos de Documento ------------------------------------------------------

const TIPO_DOC_LABEL_ES: Record<string, string> = {
  auto_judicial: 'Auto judicial',
  sentencia: 'Sentencia',
  escrito_fiscalia: 'Escrito de Fiscalía',
  dictamen_fiscal: 'Dictamen fiscal',
  escrito_defensa: 'Escrito de defensa',
  escrito_acusacion_particular: 'Escrito de acusación particular',
  escrito_acusacion_popular: 'Escrito de acusación popular',
  atestado_policial: 'Atestado policial',
  informe_uco: 'Informe UCO',
  informe_udef: 'Informe UDEF',
  informe_pericial: 'Informe pericial',
  acta_congreso: 'Acta del Congreso',
  acta_senado: 'Acta del Senado',
  video_comparecencia_congreso: 'Vídeo comparecencia Congreso',
  informe_tribunal_cuentas: 'Informe del Tribunal de Cuentas',
  informe_airef: 'Informe AIReF',
  informe_cgpj: 'Informe del CGPJ',
  dictamen_consejo_estado: 'Dictamen del Consejo de Estado',
  boletin_oficial: 'Boletín oficial',
  articulo_prensa: 'Artículo de prensa',
  reportaje_audiovisual: 'Reportaje audiovisual',
  libro: 'Libro',
  paper_academico: 'Paper académico',
  nota_prensa_institucional: 'Nota de prensa institucional',
  comunicado_partido: 'Comunicado de partido',
  declaracion_jurada: 'Declaración jurada',
  otro: 'Otro',
};
export function tipoDocLabel(tipo: string): string {
  return TIPO_DOC_LABEL_ES[tipo] ?? tipo;
}

// --- Vínculos institucionales -----------------------------------------------

const NATURALEZA_VINCULO_LABEL_ES: Record<string, string> = {
  cargo_publico_electo: 'Cargo público electo',
  cargo_publico_designado: 'Cargo público designado',
  cargo_judicial: 'Cargo judicial',
  cargo_organico_partido: 'Cargo orgánico de partido',
  cargo_directivo_empresa_publica: 'Cargo directivo en empresa pública',
  cargo_directivo_organizacion_privada: 'Cargo directivo en organización privada',
  cargo_academico_publico: 'Cargo académico público',
  cargo_organizacion_civica: 'Cargo en organización cívica',
  nombramiento_por_gobierno: 'Nombramiento por gobierno',
  acusacion_institucional_en_caso: 'Acusación institucional en caso',
  perjudicado_institucional_en_caso: 'Perjudicado institucional en caso',
  entidad_investigada_en_caso: 'Entidad investigada en caso',
  ambito_administrativo_directo_del_acto_en_caso: 'Ámbito administrativo del acto',
  afectacion_indirecta_en_caso: 'Afectación indirecta en caso',
  vinculo_familiar_publico: 'Vínculo familiar público',
  vinculo_economico_documentado: 'Vínculo económico documentado',
  vinculo_profesional_documentado: 'Vínculo profesional documentado',
};

export function naturalezaVinculoLabel(naturaleza: string, _lang: Lang = 'es'): string {
  return NATURALEZA_VINCULO_LABEL_ES[naturaleza] ?? naturaleza;
}

/** Etiqueta corta de la naturaleza de afectación institucional en un caso.
 *  Usada en listados y hover cards de org afectada — más legible que el slug
 *  del vínculo. Canon: docs/diseno/08-afectacion-directa-indirecta.md. */
const NATURALEZA_AFECTACION_LABEL_ES: Record<string, string> = {
  entidad_investigada_en_caso: 'Persona jurídica investigada',
  perjudicado_institucional_en_caso: 'Perjudicado institucional',
  ambito_administrativo_directo_del_acto_en_caso: 'Ámbito administrativo del acto',
  afectacion_indirecta_en_caso: 'Afectación indirecta',
};

export function naturalezaAfectacionLabel(naturaleza: string, _lang: Lang = 'es'): string {
  return NATURALEZA_AFECTACION_LABEL_ES[naturaleza] ?? naturaleza;
}

// --- Cobertura mediática general --------------------------------------------

const TIPO_PIEZA_MEDIATICA_LABEL_ES: Record<string, string> = {
  noticia: 'Noticia',
  reportaje: 'Reportaje',
  entrevista: 'Entrevista',
  analisis: 'Análisis',
  editorial: 'Editorial',
  opinion: 'Opinión',
  columna: 'Columna',
  pieza_agencia: 'Pieza de agencia',
  suelto: 'Suelto',
  tv_radio: 'TV / radio',
  investigacion_periodistica: 'Investigación periodística',
};

export function tipoPiezaMediaticaLabel(tipo: string, _lang: Lang = 'es'): string {
  return TIPO_PIEZA_MEDIATICA_LABEL_ES[tipo] ?? tipo;
}

const RELEVANCIA_EDITORIAL_LABEL_ES: Record<string, string> = {
  capital: 'Capital',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

export function relevanciaEditorialLabel(relevancia: string, _lang: Lang = 'es'): string {
  return RELEVANCIA_EDITORIAL_LABEL_ES[relevancia] ?? relevancia;
}

// --- Importe (cifras económicas del Hecho) ----------------------------------
// Canon de enums y reglas: docs/diseno/01-modelo-de-datos.md §2.6.

const IMPORTE_NATURALEZA_LABEL_ES: Record<string, string> = {
  perjuicio: 'Perjuicio económico',
  objeto_contrato: 'Objeto del contrato',
  fondo_publico_concedido: 'Fondo público concedido',
  comision_ilicita: 'Comisión presuntamente ilícita',
  cobro_indebido: 'Cobro presuntamente indebido',
  multa_penal: 'Multa penal',
  responsabilidad_civil: 'Responsabilidad civil',
  gasto_publico_cuestionado: 'Gasto público cuestionado',
  otro: 'Otra cifra',
};
export function importeNaturalezaLabel(naturaleza: string, _lang: Lang = 'es'): string {
  return IMPORTE_NATURALEZA_LABEL_ES[naturaleza] ?? naturaleza;
}

const IMPORTE_CLASE_LABEL_ES: Record<string, string> = {
  objeto: 'Dinero presuntamente atribuido',
  consecuencia: 'Consecuencias económicas',
};
export function importeClaseLabel(clase: string, _lang: Lang = 'es'): string {
  return IMPORTE_CLASE_LABEL_ES[clase] ?? clase;
}

const IMPORTE_ALCANCE_LABEL_ES: Record<string, string> = {
  total_caso: 'Total del caso',
  componente: 'Partida (no acumula)',
  individual: 'Atribución individual',
};
export function importeAlcanceLabel(alcance: string, _lang: Lang = 'es'): string {
  return IMPORTE_ALCANCE_LABEL_ES[alcance] ?? alcance;
}

// Papel económico de un sujeto en el importe de un Hecho (importe_atribucion).
// Distinto del rol procesal. Cuida la presunción de inocencia: `activo` no
// afirma percepción del dinero; `beneficiario` sí (cuando consta).
const IMPORTE_PAPEL_LABEL_ES: Record<string, string> = {
  activo: 'Conducta atribuida',
  beneficiario: 'Presunto beneficiario',
  perjudicado: 'Perjudicado',
  obligado: 'Obligado al pago',
  acreedor: 'A su favor',
};
export function importePapelLabel(papel: string, _lang: Lang = 'es'): string {
  return IMPORTE_PAPEL_LABEL_ES[papel] ?? papel;
}

// Encabezado de cada cubeta de cifras en la ficha de un sujeto. La redacción es
// el guardarraíl de presunción de inocencia: nunca "dinero que se llevó".
const IMPORTE_PAPEL_SECCION_ES: Record<string, string> = {
  activo: 'Cifras de los hechos que se le atribuyen',
  beneficiario: 'Dinero que presuntamente percibió o se le adjudica',
  perjudicado: 'Quebranto económico que figura como sufrido',
  obligado: 'Consecuencias económicas a su cargo',
  acreedor: 'Cantidades fijadas a su favor',
};
export function importePapelSeccionLabel(papel: string, _lang: Lang = 'es'): string {
  return IMPORTE_PAPEL_SECCION_ES[papel] ?? papel;
}

// --- Familia de Delito -------------------------------------------------------

const FAMILIA_DELITO_LABEL_ES: Record<string, string> = {
  contra_administracion_publica: 'Contra la Administración Pública',
  contra_patrimonio_y_orden_socioeconomico: 'Contra el patrimonio y el orden socioeconómico',
  falsedad_documental: 'Falsedad documental',
  delitos_electorales: 'Delitos electorales',
  blanqueo_capitales: 'Blanqueo de capitales',
  pertenencia_organizacion_criminal: 'Pertenencia a organización criminal',
  cohecho_y_trafico_influencias: 'Cohecho y tráfico de influencias',
  otros: 'Otros',
};
export function familiaDelitoLabel(familia: string, _lang: Lang = 'es'): string {
  return FAMILIA_DELITO_LABEL_ES[familia] ?? familia;
}

// --- Origen de denuncia ------------------------------------------------------

const ORIGEN_LABEL_ES: Record<string, string> = {
  fiscalia_anticorrupcion: 'Fiscalía Anticorrupción',
  fiscalia_ordinaria: 'Fiscalía ordinaria',
  oficio_judicial: 'Oficio judicial',
  querella_particular: 'Querella particular',
  querella_partido_politico: 'Querella de partido',
  querella_asociacion_acusacion_popular: 'Querella de acusación popular',
  denuncia_organismo_publico: 'Denuncia de organismo público',
  denuncia_periodistica: 'Denuncia periodística',
  comparecencia_congreso: 'Comparecencia en el Congreso',
  otro: 'Otro',
};
export function origenLabel(o: string): string {
  return ORIGEN_LABEL_ES[o] ?? o;
}

// --- Utilidades --------------------------------------------------------------

/** Iniciales para PersonaCard: primera letra del primer nombre + primera del
 *  primer apellido. Para nombres compuestos españoles ("José Luis Rodríguez
 *  Zapatero") la heurística es palabra[0] + última palabra significativa, así
 *  Zapatero → JZ y Calama Teixeira → JT, NO ambos JL como pasaría tomando los
 *  dos nombres. Si sólo hay una palabra, primeras dos letras de esa palabra.
 */
export function iniciales(nombre: string): string {
  const stop = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'i', 'da', 'do', 'van', 'von']);
  const palabras = nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stop.has(w.toLowerCase()));
  if (palabras.length === 0) return '?';
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
}
