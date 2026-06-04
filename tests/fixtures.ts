// Mini-inventario sintético para los unit tests de la API. No toca disco ni red:
// se le pasa directamente a `buildApiContext`. Cubre, a propósito:
//   - un caso beta (visible) y uno borrador (debe quedar fuera por el gate),
//   - un hecho normal, uno con importe y uno RETRACTADO (debe excluirse),
//   - afectación directa (entidad investigada) + indirecta (partido),
//   - acusación popular (papel procesal, no afectación),
//   - un vínculo retirado (no debe contar),
//   - órgano judicial y querellante (aristas org→caso),
//   - una persona y una organización que SÓLO aparecen en el borrador (no visibles),
//   - el campo interno `promocion_propuesta` (no debe salir en el detalle).
import type { ApiInput } from '@/lib/api';

type Entry = { id: string; collection: string; data: Record<string, unknown> };
const e = (collection: string, data: Record<string, unknown>): Entry => ({
  id: String(data.id ?? data.caso_id ?? ''),
  collection,
  data,
});

export function mkInput(): ApiInput {
  const casos = [
    e('casos', {
      id: 'caso-a',
      nombre_oficial: 'Caso A (oficial)',
      nombre_mediatico: 'Caso A',
      estado_publicacion: 'beta_publica',
      organo_judicial_id: 'org-juzgado',
      querellante_inicial_id: 'org-querellante',
      fase_actual: 'instruccion',
      fecha_apertura: '2020-01-01',
      origen_denuncia: 'oficio_judicial',
      delitos_atribuidos_en_la_causa: ['d1'],
      nivel_relevancia_editorial: 'capital',
      // Campo INTERNO: debe quedar fuera del payload.
      promocion_propuesta: { estado_propuesto: 'publicado', propuesto_por: 'test', fecha: '2026-01-01', razon: 'x' },
    }),
    e('casos', {
      id: 'caso-b',
      nombre_oficial: 'Caso B (oficial)',
      nombre_mediatico: 'Caso B',
      estado_publicacion: 'borrador',
      organo_judicial_id: 'org-solo-borrador',
      fase_actual: 'instruccion',
      fecha_apertura: '2021-01-01',
      origen_denuncia: 'oficio_judicial',
      delitos_atribuidos_en_la_causa: [],
    }),
    e('casos', {
      id: 'caso-c',
      nombre_oficial: 'Caso C (oficial)',
      nombre_mediatico: 'Caso C',
      estado_publicacion: 'publicado',
      organo_judicial_id: 'org-juzgado',
      fase_actual: 'juicio_oral',
      fecha_apertura: '2019-06-01',
      origen_denuncia: 'oficio_judicial',
      delitos_atribuidos_en_la_causa: ['d2'],
    }),
  ];

  const personas = [
    e('personas', { id: 'p-investigado', nombre_completo: 'Persona Investigada', es_figura_publica: true, estado_publicacion: 'borrador' }),
    e('personas', { id: 'p-juez', nombre_completo: 'Persona Juez', es_figura_publica: true, estado_publicacion: 'publicado' }),
    e('personas', { id: 'p-solo-borrador', nombre_completo: 'Persona Solo Borrador', es_figura_publica: true, estado_publicacion: 'borrador' }),
  ];

  const organizaciones = [
    e('organizaciones', { id: 'org-investigada', nombre: 'Investigada SL', tipo: 'empresa', cif: 'B62704887', estado_publicacion: 'publicado' }),
    e('organizaciones', { id: 'org-partido', nombre: 'Partido X', siglas: 'PX', tipo: 'partido_politico', cif: 'G28570927', estado_publicacion: 'publicado' }),
    e('organizaciones', { id: 'org-acusacion', nombre: 'Acusación Popular Y', tipo: 'asociacion_acusacion_popular', estado_publicacion: 'publicado' }),
    e('organizaciones', { id: 'org-juzgado', nombre: 'Juzgado Z', tipo: 'juzgado', estado_publicacion: 'publicado' }),
    e('organizaciones', { id: 'org-querellante', nombre: 'Organismo Querellante', tipo: 'organismo_publico', cif: 'S2816001H', estado_publicacion: 'publicado' }),
    e('organizaciones', { id: 'org-solo-borrador', nombre: 'Solo Borrador SL', tipo: 'empresa', estado_publicacion: 'publicado' }),
    // Implicada en un Hecho de caso-a SIN vínculo institucional: debe enlazarse igual.
    e('organizaciones', { id: 'org-implicada-hecho', nombre: 'Implicada Por Hecho SA', tipo: 'empresa', cif: 'A28019206', estado_publicacion: 'publicado' }),
  ];

  const delitos = [
    e('delitos', { id: 'd1', nombre_tipico: 'Cohecho', familia: 'contra_la_administracion', articulos_cp: ['art. 419 CP'] }),
    e('delitos', { id: 'd2', nombre_tipico: 'Malversación', familia: 'contra_la_administracion', articulos_cp: ['art. 432 CP'] }),
  ];

  const roles = [
    e('roles', { id: 'r1', caso_id: 'caso-a', sujeto_tipo: 'persona', sujeto_persona_id: 'p-investigado', rol: 'investigado', delitos_atribuidos: ['d1'], fecha_inicio: '2020-02-01' }),
    e('roles', { id: 'r2', caso_id: 'caso-a', sujeto_tipo: 'persona', sujeto_persona_id: 'p-juez', rol: 'juez_instructor', fecha_inicio: '2020-01-01' }),
    e('roles', { id: 'r3', caso_id: 'caso-a', sujeto_tipo: 'organizacion', sujeto_organizacion_id: 'org-acusacion', rol: 'acusacion_popular', fecha_inicio: '2020-03-01' }),
    e('roles', { id: 'rb', caso_id: 'caso-b', sujeto_tipo: 'persona', sujeto_persona_id: 'p-solo-borrador', rol: 'investigado', fecha_inicio: '2021-02-01' }),
    e('roles', { id: 'rc', caso_id: 'caso-c', sujeto_tipo: 'persona', sujeto_persona_id: 'p-investigado', rol: 'acusado', delitos_atribuidos: ['d2'], fecha_inicio: '2019-07-01' }),
  ];

  const hitos = [
    e('hitos', { id: 'hito-a1', caso_id: 'caso-a', tipo: 'auto_procesamiento', fecha: '2020-02-01', fecha_precision: 'dia', titulo: 'Auto', documento_principal_id: 'doc1' }),
  ];

  const hechos = [
    e('hechos', { id: 'h1', caso_id: 'caso-a', enunciado: 'Hecho vigente', tipo: 'investigado', estado_publicacion: 'borrador', vigencia: 'vigente', fecha_o_periodo: { desde: '2020-01-01', precision: 'anio' }, documentos_respaldo: [{ documento_id: 'doc1' }], nivel_fuente_efectivo: 2, personas_implicadas: ['p-investigado'], organizaciones_implicadas: ['org-implicada-hecho'] }),
    e('hechos', { id: 'h2-retractado', caso_id: 'caso-a', enunciado: 'Hecho retractado que NO debe salir', tipo: 'investigado', estado_publicacion: 'retirado_definitivamente', vigencia: 'retirado', fecha_o_periodo: { desde: '2020-01-01', precision: 'anio' }, documentos_respaldo: [{ documento_id: 'doc1' }] }),
    e('hechos', { id: 'h3-importe', caso_id: 'caso-a', enunciado: 'Fondo público concedido', tipo: 'investigado', estado_publicacion: 'publicado', vigencia: 'vigente', fecha_o_periodo: { desde: '2021-01-01', precision: 'anio' }, documentos_respaldo: [{ documento_id: 'doc1' }], importe: 53000000, importe_moneda: 'EUR', importe_clase: 'objeto', importe_alcance: 'total_caso', importe_naturaleza: 'fondo_publico_concedido' }),
    e('hechos', { id: 'hc1', caso_id: 'caso-c', enunciado: 'Hecho del caso C', tipo: 'investigado', estado_publicacion: 'publicado', vigencia: 'vigente', fecha_o_periodo: { desde: '2019-01-01', precision: 'anio' }, documentos_respaldo: [{ documento_id: 'doc1' }] }),
    e('hechos', { id: 'hc2-retractado', caso_id: 'caso-c', enunciado: 'Retirado C', tipo: 'investigado', estado_publicacion: 'retirado_definitivamente', vigencia: 'retirado', fecha_o_periodo: { desde: '2019-01-01', precision: 'anio' }, documentos_respaldo: [{ documento_id: 'doc1' }] }),
  ];

  const vinculos = [
    e('vinculos', { id: 'v-investigada', naturaleza: 'entidad_investigada_en_caso', descripcion: 'Investigada en el caso', sujeto_organizacion_id: 'org-investigada', objeto_organizacion_id: 'org-juzgado', desde: '2020-01-01', relevancia_para_caso_ids: ['caso-a'], nivel_afectacion: 'directa', justificacion_afectacion: 'Es la entidad investigada', documentos_respaldo: [{ documento_id: 'doc1' }], estado_publicacion: 'publicado' }),
    e('vinculos', { id: 'v-partido', naturaleza: 'afectacion_indirecta_en_caso', descripcion: 'Partido del cargo', sujeto_organizacion_id: 'org-partido', objeto_organizacion_id: 'org-juzgado', desde: '2020-01-01', relevancia_para_caso_ids: ['caso-a', 'caso-c'], nivel_afectacion: 'indirecta', justificacion_afectacion: 'Partido del cargo investigado', documentos_respaldo: [{ documento_id: 'doc1' }], estado_publicacion: 'publicado' }),
    e('vinculos', { id: 'v-acusacion', naturaleza: 'acusacion_institucional_en_caso', descripcion: 'Ejerce acusación popular', sujeto_organizacion_id: 'org-acusacion', objeto_organizacion_id: 'org-juzgado', desde: '2020-01-01', relevancia_para_caso_ids: ['caso-a'], documentos_respaldo: [{ documento_id: 'doc1' }], estado_publicacion: 'publicado' }),
    e('vinculos', { id: 'v-retirado', naturaleza: 'afectacion_indirecta_en_caso', descripcion: 'Vínculo retirado', sujeto_organizacion_id: 'org-investigada', objeto_organizacion_id: 'org-juzgado', desde: '2020-01-01', relevancia_para_caso_ids: ['caso-a'], nivel_afectacion: 'indirecta', justificacion_afectacion: 'x', documentos_respaldo: [{ documento_id: 'doc1' }], estado_publicacion: 'retirado_definitivamente' }),
  ];

  const relaciones = [
    e('relaciones', { id: 'rel1', caso_a_id: 'caso-a', caso_b_id: 'caso-c', tipo: 'misma_trama', descripcion: 'Misma trama', documentos_respaldo: ['doc1'], estado_publicacion: 'publicado' }),
    e('relaciones', { id: 'rel-borrador', caso_a_id: 'caso-a', caso_b_id: 'caso-b', tipo: 'conexion_factual', descripcion: 'Con borrador', documentos_respaldo: ['doc1'], estado_publicacion: 'publicado' }),
  ];

  const documentos = [
    e('documentos', { id: 'doc1', titulo: 'Auto de procesamiento', tipo: 'auto_judicial', nivel_fuente: 2, fecha_documento: '2020-01-01', estado_acceso: 'publico', idioma: 'es', caso_principal_id: 'caso-a', productor_organizacion_id: 'org-juzgado', estado_publicacion: 'publicado' }),
  ];

  return { casos, personas, organizaciones, documentos, delitos, roles, hitos, hechos, vinculos, relaciones } as unknown as ApiInput;
}
