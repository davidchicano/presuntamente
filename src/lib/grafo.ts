import type { CollectionEntry } from 'astro:content';
import {
  faseLabel,
  naturalezaVinculoLabel,
  rolLabel,
  tipoDocLabel,
  tipoOrgLabel,
} from '@/lib/labels';

export type GraphNodeKind = 'caso' | 'persona' | 'organizacion' | 'documento';
export type GraphEdgeKind = 'procesal' | 'institucional' | 'caso_caso' | 'documental';

export interface GraphNode {
  id: string;
  rawId: string;
  kind: GraphNodeKind;
  label: string;
  sublabel?: string;
  href?: string;
  search: string;
  meta?: Record<string, string | number | boolean | undefined>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: GraphEdgeKind;
  label: string;
  detail?: string;
  date?: string;
  sourceLevel?: number;
  meta?: Record<string, string | number | boolean | undefined>;
}

export interface GraphPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    casos: number;
    personas: number;
    organizaciones: number;
    documentos: number;
    relaciones: number;
  };
}

interface BuildGraphInput {
  casos: CollectionEntry<'casos'>[];
  personas: CollectionEntry<'personas'>[];
  organizaciones: CollectionEntry<'organizaciones'>[];
  documentos: CollectionEntry<'documentos'>[];
  roles: CollectionEntry<'roles'>[];
  vinculos: CollectionEntry<'vinculos'>[];
  relaciones: CollectionEntry<'relaciones'>[];
  hitos: CollectionEntry<'hitos'>[];
  hechos: CollectionEntry<'hechos'>[];
}

const CASES_EXCLUDED_FROM_GRAPH = new Set([
  'pendiente',
  'borrador',
  'retirado_temporalmente',
  'retirado_definitivamente',
]);

const VINCULO_EN_CASO = new Set([
  'acusacion_institucional_en_caso',
  'perjudicado_institucional_en_caso',
  'entidad_investigada_en_caso',
  'ambito_administrativo_directo_del_acto_en_caso',
  'afectacion_indirecta_en_caso',
]);

function nodeId(kind: GraphNodeKind, rawId: string): string {
  return `${kind}:${rawId}`;
}

function appendSearch(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(' ').toLowerCase();
}

function edgeId(kind: GraphEdgeKind, source: string, target: string, rawId: string): string {
  return `${kind}:${rawId}:${source}->${target}`;
}

function docRefsFromUnknown(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'documento_id' in item) {
        return String((item as { documento_id: unknown }).documento_id);
      }
      return undefined;
    })
    .filter((id): id is string => Boolean(id));
}

export function buildGraphPayload(input: BuildGraphInput): GraphPayload {
  const visibleCases = input.casos.filter((c) => !CASES_EXCLUDED_FROM_GRAPH.has(c.data.estado_publicacion));
  const visibleCaseIds = new Set(visibleCases.map((c) => c.data.id));
  const personaIndex = new Map(input.personas.map((p) => [p.data.id, p.data]));
  const orgIndex = new Map(input.organizaciones.map((o) => [o.data.id, o.data]));
  const docIndex = new Map(input.documentos.map((d) => [d.data.id, d.data]));
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();

  function addNode(node: GraphNode | undefined) {
    if (!node) return;
    if (!nodes.has(node.id)) nodes.set(node.id, node);
  }

  function addCaseNode(caseId: string) {
    const c = visibleCases.find((entry) => entry.data.id === caseId)?.data;
    if (!c) return;
    addNode({
      id: nodeId('caso', c.id),
      rawId: c.id,
      kind: 'caso',
      label: c.nombre_mediatico,
      sublabel: faseLabel(c.fase_actual),
      href: `/casos/${c.id}`,
      search: appendSearch(c.nombre_mediatico, c.nombre_oficial, c.numero_procedimiento),
      meta: {
        fase: c.fase_actual,
        estado_publicacion: c.estado_publicacion,
        numero_procedimiento: c.numero_procedimiento,
      },
    });
  }

  function addPersonaNode(personaId: string) {
    const p = personaIndex.get(personaId);
    if (!p) return;
    addNode({
      id: nodeId('persona', p.id),
      rawId: p.id,
      kind: 'persona',
      label: p.nombre_completo,
      sublabel: p.cargo_publico_actual ?? (p.es_figura_publica ? 'Figura pública' : 'Persona privada'),
      href: `/personas/${p.id}`,
      search: appendSearch(p.nombre_completo, p.cargo_publico_actual, p.biografia_corta),
      meta: {
        es_figura_publica: p.es_figura_publica,
        estado_publicacion: p.estado_publicacion,
      },
    });
  }

  function addOrgNode(orgId: string) {
    const o = orgIndex.get(orgId);
    if (!o) return;
    addNode({
      id: nodeId('organizacion', o.id),
      rawId: o.id,
      kind: 'organizacion',
      label: o.nombre,
      sublabel: tipoOrgLabel(o.tipo),
      href: `/organizaciones/${o.id}`,
      search: appendSearch(o.nombre, o.siglas, tipoOrgLabel(o.tipo), o.descripcion_corta),
      meta: {
        tipo: o.tipo,
        estado_publicacion: o.estado_publicacion,
      },
    });
  }

  function addDocNode(docId: string) {
    const d = docIndex.get(docId);
    if (!d) return;
    addNode({
      id: nodeId('documento', d.id),
      rawId: d.id,
      kind: 'documento',
      label: d.titulo,
      sublabel: `N${d.nivel_fuente} · ${tipoDocLabel(d.tipo)}`,
      href: `/biblioteca#doc-${d.id}`,
      search: appendSearch(d.titulo, tipoDocLabel(d.tipo), d.productor_organizacion_id),
      meta: {
        nivel_fuente: d.nivel_fuente,
        tipo: d.tipo,
        fecha: d.fecha_documento,
      },
    });
  }

  function addEdge(edge: GraphEdge) {
    if (edge.source === edge.target) return;
    if (!nodes.has(edge.source) || !nodes.has(edge.target)) return;
    if (!edges.has(edge.id)) edges.set(edge.id, edge);
  }

  for (const c of visibleCases) {
    addCaseNode(c.data.id);
    if (c.data.organo_judicial_id) {
      addOrgNode(c.data.organo_judicial_id);
      addEdge({
        id: edgeId('procesal', nodeId('caso', c.data.id), nodeId('organizacion', c.data.organo_judicial_id), 'organo-judicial'),
        source: nodeId('caso', c.data.id),
        target: nodeId('organizacion', c.data.organo_judicial_id),
        kind: 'procesal',
        label: 'Órgano judicial',
        detail: `${orgIndex.get(c.data.organo_judicial_id)?.nombre ?? c.data.organo_judicial_id} tramita ${c.data.nombre_mediatico}.`,
        date: c.data.fecha_apertura,
      });
    }
    if (c.data.querellante_inicial_id) {
      const org = orgIndex.get(c.data.querellante_inicial_id);
      const persona = personaIndex.get(c.data.querellante_inicial_id);
      if (org) addOrgNode(org.id);
      if (persona) addPersonaNode(persona.id);
      const target = org ? nodeId('organizacion', org.id) : persona ? nodeId('persona', persona.id) : undefined;
      if (target) {
        addEdge({
          id: edgeId('procesal', target, nodeId('caso', c.data.id), 'querellante-inicial'),
          source: target,
          target: nodeId('caso', c.data.id),
          kind: 'procesal',
          label: 'Querellante inicial',
          detail: `Figura como querellante o denunciante inicial en ${c.data.nombre_mediatico}.`,
          date: c.data.fecha_apertura,
        });
      }
    }
  }

  for (const r of input.roles) {
    if (!visibleCaseIds.has(r.data.caso_id)) continue;
    addCaseNode(r.data.caso_id);
    const caseNode = nodeId('caso', r.data.caso_id);
    const subject =
      r.data.sujeto_tipo === 'persona' && r.data.sujeto_persona_id
        ? nodeId('persona', r.data.sujeto_persona_id)
        : r.data.sujeto_tipo === 'organizacion' && r.data.sujeto_organizacion_id
          ? nodeId('organizacion', r.data.sujeto_organizacion_id)
          : undefined;
    if (!subject) continue;
    if (r.data.sujeto_tipo === 'persona' && r.data.sujeto_persona_id) addPersonaNode(r.data.sujeto_persona_id);
    if (r.data.sujeto_tipo === 'organizacion' && r.data.sujeto_organizacion_id) addOrgNode(r.data.sujeto_organizacion_id);
    addEdge({
      id: edgeId('procesal', subject, caseNode, r.data.id),
      source: subject,
      target: caseNode,
      kind: 'procesal',
      label: rolLabel(r.data.rol),
      detail: r.data.notas,
      date: r.data.fecha_inicio,
      meta: {
        rol: r.data.rol,
        activo: !r.data.fecha_fin,
        fecha_fin: r.data.fecha_fin,
      },
    });
  }

  for (const v of input.vinculos) {
    const subject = v.data.sujeto_persona_id
      ? nodeId('persona', v.data.sujeto_persona_id)
      : v.data.sujeto_organizacion_id
        ? nodeId('organizacion', v.data.sujeto_organizacion_id)
        : undefined;
    const object = v.data.objeto_persona_id
      ? nodeId('persona', v.data.objeto_persona_id)
      : v.data.objeto_organizacion_id
        ? nodeId('organizacion', v.data.objeto_organizacion_id)
        : undefined;
    if (v.data.sujeto_persona_id) addPersonaNode(v.data.sujeto_persona_id);
    if (v.data.sujeto_organizacion_id) addOrgNode(v.data.sujeto_organizacion_id);
    if (v.data.objeto_persona_id) addPersonaNode(v.data.objeto_persona_id);
    if (v.data.objeto_organizacion_id) addOrgNode(v.data.objeto_organizacion_id);

    if (subject && object) {
      addEdge({
        id: edgeId('institucional', subject, object, v.data.id),
        source: subject,
        target: object,
        kind: 'institucional',
        label: naturalezaVinculoLabel(v.data.naturaleza),
        detail: v.data.descripcion,
        date: v.data.desde,
        meta: {
          naturaleza: v.data.naturaleza,
          vigente: v.data.vigente,
        },
      });
    }

    if (subject && VINCULO_EN_CASO.has(v.data.naturaleza)) {
      for (const caseId of v.data.relevancia_para_caso_ids ?? []) {
        if (!visibleCaseIds.has(caseId)) continue;
        addCaseNode(caseId);
        addEdge({
          id: edgeId('institucional', subject, nodeId('caso', caseId), `${v.data.id}-caso`),
          source: subject,
          target: nodeId('caso', caseId),
          kind: 'institucional',
          label: naturalezaVinculoLabel(v.data.naturaleza),
          detail: v.data.descripcion,
          date: v.data.desde,
          meta: {
            naturaleza: v.data.naturaleza,
            vigente: v.data.vigente,
          },
        });
      }
    }
  }

  for (const rel of input.relaciones) {
    if (!visibleCaseIds.has(rel.data.caso_a_id) || !visibleCaseIds.has(rel.data.caso_b_id)) continue;
    addCaseNode(rel.data.caso_a_id);
    addCaseNode(rel.data.caso_b_id);
    addEdge({
      id: edgeId('caso_caso', nodeId('caso', rel.data.caso_a_id), nodeId('caso', rel.data.caso_b_id), rel.data.id),
      source: nodeId('caso', rel.data.caso_a_id),
      target: nodeId('caso', rel.data.caso_b_id),
      kind: 'caso_caso',
      label: rel.data.tipo.replaceAll('_', ' '),
      detail: rel.data.descripcion,
      date: rel.data.fecha_inicio,
      meta: {
        tipo: rel.data.tipo,
      },
    });
  }

  const docCasePairs = new Map<string, { docId: string; caseId: string; reason: string }>();
  function addDocCase(docId: string, caseId: string, reason: string) {
    if (!visibleCaseIds.has(caseId) || !docIndex.has(docId)) return;
    docCasePairs.set(`${docId}:${caseId}:${reason}`, { docId, caseId, reason });
  }
  for (const d of input.documentos) {
    if (d.data.caso_principal_id) addDocCase(d.data.id, d.data.caso_principal_id, 'Documento del caso');
  }
  for (const h of input.hitos) {
    if (h.data.documento_principal_id) addDocCase(h.data.documento_principal_id, h.data.caso_id, 'Documento de hito');
    for (const docId of docRefsFromUnknown((h.data as { documentos_relacionados?: unknown }).documentos_relacionados)) {
      addDocCase(docId, h.data.caso_id, 'Documento relacionado');
    }
  }
  for (const h of input.hechos) {
    for (const docId of docRefsFromUnknown((h.data as { documentos_respaldo?: unknown }).documentos_respaldo)) {
      addDocCase(docId, h.data.caso_id, 'Respaldo de hecho');
    }
  }
  for (const v of input.vinculos) {
    const docIds = v.data.documentos_respaldo.map((ref) => ref.documento_id);
    for (const caseId of v.data.relevancia_para_caso_ids ?? []) {
      for (const docId of docIds) addDocCase(docId, caseId, 'Respaldo de vínculo');
    }
  }
  for (const rel of input.relaciones) {
    for (const docId of rel.data.documentos_respaldo) {
      addDocCase(docId, rel.data.caso_a_id, 'Respaldo de relación');
      addDocCase(docId, rel.data.caso_b_id, 'Respaldo de relación');
    }
  }
  for (const { docId, caseId, reason } of docCasePairs.values()) {
    const doc = docIndex.get(docId);
    if (!doc) continue;
    addDocNode(docId);
    addCaseNode(caseId);
    addEdge({
      id: edgeId('documental', nodeId('documento', docId), nodeId('caso', caseId), reason),
      source: nodeId('documento', docId),
      target: nodeId('caso', caseId),
      kind: 'documental',
      label: reason,
      detail: doc.titulo,
      date: doc.fecha_documento,
      sourceLevel: doc.nivel_fuente,
      meta: {
        nivel_fuente: doc.nivel_fuente,
        tipo_documento: doc.tipo,
      },
    });
  }

  const resultNodes = Array.from(nodes.values()).sort((a, b) => {
    const kindOrder = ['caso', 'persona', 'organizacion', 'documento'];
    const diff = kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind);
    return diff || a.label.localeCompare(b.label, 'es');
  });
  const resultEdges = Array.from(edges.values()).sort((a, b) => a.label.localeCompare(b.label, 'es'));

  return {
    nodes: resultNodes,
    edges: resultEdges,
    stats: {
      casos: resultNodes.filter((n) => n.kind === 'caso').length,
      personas: resultNodes.filter((n) => n.kind === 'persona').length,
      organizaciones: resultNodes.filter((n) => n.kind === 'organizacion').length,
      documentos: resultNodes.filter((n) => n.kind === 'documento').length,
      relaciones: resultEdges.length,
    },
  };
}
