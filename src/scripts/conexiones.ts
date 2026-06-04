import cytoscape, {
  type Core,
  type EdgeSingular,
  type ElementDefinition,
  type LayoutOptions,
  type NodeSingular,
  type StylesheetStyle,
} from "cytoscape";
import fcose from "cytoscape-fcose";

// Layout force-directed rápido (init espectral + pocas iteraciones). Sustituye
// al `cose` base, que a escala de inventario tardaba ~2 s y pintaba una
// colocación intermedia antes del salto final. fcose calcula en una pasada.
cytoscape.use(fcose);

type NodeKind = "caso" | "persona" | "organizacion" | "documento";
type FocusKind = NodeKind | "inventario";
type EdgeKind = "procesal" | "institucional" | "caso_caso" | "documental";

interface GraphNode {
  id: string;
  rawId: string;
  kind: NodeKind;
  label: string;
  sublabel?: string;
  href?: string;
  search: string;
  meta?: Record<string, string | number | boolean | undefined>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  label: string;
  detail?: string;
  date?: string;
  sourceLevel?: number;
  meta?: Record<string, string | number | boolean | undefined>;
}

interface GraphPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const EDGE_LABEL: Record<EdgeKind, string> = {
  procesal: "Procesal",
  institucional: "Institucional",
  caso_caso: "Caso-caso",
  documental: "Documental",
};

const FOCUS_LABEL: Record<FocusKind, string> = {
  inventario: "Inventario completo",
  caso: "Caso",
  persona: "Persona",
  organizacion: "Organización",
  documento: "Documento",
};

const LAYOUT_LABEL: Record<string, string> = {
  cose: "Red viva",
  breadthfirst: "Profundidad",
};

const NODE_LABEL: Record<NodeKind, string> = {
  caso: "Caso",
  persona: "Persona",
  organizacion: "Organización",
  documento: "Documento",
};

function checkboxSummary(root: ParentNode, selector: string): string {
  const inputs = qsa<HTMLInputElement>(root, selector);
  const checked = inputs.filter((input) => input.checked);
  if (checked.length === 0) return "Ninguno";
  if (checked.length === inputs.length) return "Todos";
  return checked
    .map((input) => {
      const label = input.closest("label");
      return label?.textContent?.replace(/\s+/g, " ").trim() ?? input.value;
    })
    .join(", ");
}

function checkboxSummaryCompact(root: ParentNode, selector: string): string | null {
  const summary = checkboxSummary(root, selector);
  if (summary === "Todos") return null;
  return summary.split(", ").join(" · ");
}

function checksMatchDefault<T extends string>(
  root: ParentNode,
  selector: string,
  defaults: Set<T>,
): boolean {
  const checked = getChecked<T>(root, selector);
  if (checked.size !== defaults.size) return false;
  return [...defaults].every((value) => checked.has(value));
}

function renderFilterSummary(root: HTMLElement) {
  const panel = qs<HTMLElement>(root, "[data-graph-filter-summary]");
  if (!panel) return;

  const focusType = getFocusKind(root);
  const depth = qs<HTMLInputElement>(root, "[data-graph-depth]")?.value ?? "1";
  const layout =
    qs<HTMLSelectElement>(root, "[data-graph-layout]")?.value ?? "cose";

  const context: string[] = [];
  if (focusType === "inventario") {
    context.push(FOCUS_LABEL.inventario);
  } else {
    const labels = getFocusLabels(root, focusType);
    const focusName =
      labels.length === 0
        ? "Sin foco"
        : labels.length === 1
          ? labels[0]
          : `${labels.length} seleccionados`;
    context.push(`${FOCUS_LABEL[focusType]}: ${focusName}`, `p.${depth}`);
  }
  context.push(LAYOUT_LABEL[layout] ?? layout);

  panel.replaceChildren();
  const primary = document.createElement("p");
  primary.className = "graph-panel__summary-line";
  primary.textContent = context.join(" · ");
  panel.append(primary);

  const edgesDefault = checksMatchDefault(
    root,
    "[data-edge-kind]",
    DEFAULT_EDGE_KINDS,
  );
  const nodesDefault = checksMatchDefault(
    root,
    "[data-node-kind]",
    DEFAULT_NODE_KINDS,
  );
  if (edgesDefault && nodesDefault) return;

  const filters: string[] = [];
  const relations = checkboxSummaryCompact(root, "[data-edge-kind]");
  const nodes = checkboxSummaryCompact(root, "[data-node-kind]");
  if (relations) filters.push(relations);
  if (nodes) filters.push(nodes);

  if (filters.length > 0) {
    const secondary = document.createElement("p");
    secondary.className = "graph-panel__summary-line";
    secondary.textContent = filters.join(" · ");
    panel.append(secondary);
  }
}

const DEFAULT_EDGE_KINDS = new Set<EdgeKind>([
  "procesal",
  "institucional",
  "caso_caso",
]);
const DEFAULT_NODE_KINDS = new Set<NodeKind>([
  "caso",
  "persona",
  "organizacion",
]);
const FOCUS_KINDS: FocusKind[] = [
  "inventario",
  "caso",
  "persona",
  "organizacion",
  "documento",
];
const MESH_DRAG_SCRATCH = "graphMeshDragLastPosition";
const renderedEdgesByRoot = new WeakMap<HTMLElement, Map<string, GraphEdge>>();

function qs<T extends Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector);
}

function qsa<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

function getChecked<T extends string>(
  root: ParentNode,
  selector: string,
): Set<T> {
  return new Set(
    qsa<HTMLInputElement>(root, selector)
      .filter((input) => input.checked)
      .map((input) => input.value as T),
  );
}

const DETAIL_PREVIEW_MAX = 220;

function flatDetail(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function shortDetail(value: string | undefined, max = DETAIL_PREVIEW_MAX): string {
  const flat = flatDetail(value);
  if (flat.length <= max) return flat;
  const slice = flat.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 90 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

function isDetailTruncated(
  value: string | undefined,
  max = DETAIL_PREVIEW_MAX,
): boolean {
  const flat = flatDetail(value);
  return flat.length > 0 && shortDetail(value, max) !== flat;
}

const DETAILS_CLOSE_BUTTON = `<button type="button" class="graph-panel__collapse graph-details__close" data-graph-close-details aria-label="Ocultar panel de detalle">Cerrar</button>`;

function detailsTopMarkup(kind: string, titleHtml: string): string {
  return `
      <div class="graph-details__head">
        <p class="graph-details__kind">${kind}</p>
        ${DETAILS_CLOSE_BUTTON}
      </div>
      <h2 class="graph-details__title">${titleHtml}</h2>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function summaryMarkup(
  preview: string,
  full: string,
  expandable: boolean,
): string {
  if (!expandable) {
    return `<p class="graph-details__summary">${escapeHtml(preview)}</p>`;
  }
  return `<div class="graph-details__summary-block">
      <p class="graph-details__summary"><span class="graph-details__summary-body" data-full-text="${escapeHtml(full)}" data-preview-text="${escapeHtml(preview)}">${escapeHtml(preview)}</span></p>
      <button type="button" class="graph-details__expand-btn" data-graph-expand-details aria-expanded="false">Ver más</button>
    </div>`;
}

function toggleDetailsSummaryExpand(button: HTMLButtonElement) {
  const body = button
    .closest(".graph-details__summary-block")
    ?.querySelector<HTMLElement>(".graph-details__summary-body");
  if (!body) return;
  const expanded = button.getAttribute("aria-expanded") === "true";
  if (expanded) {
    body.textContent = body.dataset.previewText ?? "";
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Ver más";
    return;
  }
  body.textContent = body.dataset.fullText ?? "";
  button.setAttribute("aria-expanded", "true");
  button.textContent = "Ver menos";
}

function shortNodeLabel(value: string, kind: NodeKind): string {
  const max = kind === "caso" ? 28 : 22;
  const flat = value.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const slice = flat.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 9 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

function nodeById(payload: GraphPayload): Map<string, GraphNode> {
  return new Map(payload.nodes.map((node) => [node.id, node]));
}

function getFocusKind(root: HTMLElement): FocusKind {
  return (qs<HTMLSelectElement>(root, "[data-graph-focus-type]")?.value ??
    "inventario") as FocusKind;
}

function activeFocusPicker(root: HTMLElement, type = getFocusKind(root)): HTMLElement | null {
  if (type === "inventario") return null;
  return qs<HTMLElement>(root, `[data-graph-focus-picker="${type}"]`);
}

function getFocusRawIds(root: HTMLElement, type = getFocusKind(root)): string[] {
  const picker = activeFocusPicker(root, type);
  const raw = qs<HTMLInputElement>(picker ?? root, "[data-msf-value]")?.value ?? "";
  return raw.split(",").map((value) => value.trim()).filter(Boolean);
}

function getFocusNodeIds(root: HTMLElement): string[] {
  const type = getFocusKind(root);
  if (type === "inventario") return [];
  return getFocusRawIds(root, type).map((id) => `${type}:${id}`);
}

function getFocusLabels(root: HTMLElement, type = getFocusKind(root)): string[] {
  const picker = activeFocusPicker(root, type);
  if (!picker) return [];
  return getFocusRawIds(root, type).map((value) => {
    const opt = qs<HTMLElement>(
      picker,
      `[data-msf-opt][data-value="${CSS.escape(value)}"] .msf__opt-label`,
    );
    return opt?.textContent?.replace(/\s+/g, " ").trim() ?? value;
  });
}

function setMultiSelectValues(root: HTMLElement, values: string[]) {
  const selected = new Set(values);
  qsa<HTMLInputElement>(root, "[data-msf-checkbox]").forEach((checkbox) => {
    checkbox.checked = selected.has(checkbox.value);
  });
  const globalWindow = window as Window & {
    __msfCommit?: (root: HTMLElement) => void;
  };
  if (globalWindow.__msfCommit) {
    globalWindow.__msfCommit(root);
    return;
  }
  const hidden = qs<HTMLInputElement>(root, "[data-msf-value]");
  if (hidden) hidden.value = values.join(",");
}

function syncFocusPickers(root: HTMLElement) {
  const type = getFocusKind(root);
  qsa<HTMLElement>(root, "[data-graph-focus-picker]").forEach((picker) => {
    picker.hidden = picker.dataset.graphFocusPicker !== type;
  });
  const all = qs<HTMLElement>(root, "[data-graph-focus-all]");
  if (all) all.hidden = type !== "inventario";
}

function closeGraphSelect(widget: HTMLElement) {
  widget.classList.remove("gsel--open");
  const trigger = qs<HTMLButtonElement>(widget, "[data-gsel-trigger]");
  const menu = qs<HTMLElement>(widget, "[data-gsel-menu]");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
  if (menu) menu.hidden = true;
}

function openGraphSelect(widget: HTMLElement) {
  qsa<HTMLElement>(document, ".gsel--open").forEach((openWidget) => {
    if (openWidget !== widget) closeGraphSelect(openWidget);
  });
  widget.classList.add("gsel--open");
  const trigger = qs<HTMLButtonElement>(widget, "[data-gsel-trigger]");
  const menu = qs<HTMLElement>(widget, "[data-gsel-menu]");
  if (trigger) trigger.setAttribute("aria-expanded", "true");
  if (menu) menu.hidden = false;
  qs<HTMLInputElement>(widget, "[data-gsel-search]")?.focus();
}

function refreshGraphSelect(select: HTMLSelectElement | null) {
  if (!select) return;
  const widget =
    select.nextElementSibling instanceof HTMLElement &&
    select.nextElementSibling.matches("[data-gsel]")
      ? select.nextElementSibling
      : null;
  if (!widget) return;

  const trigger = qs<HTMLButtonElement>(widget, "[data-gsel-trigger]");
  const label = qs<HTMLElement>(widget, "[data-gsel-label]");
  const menu = qs<HTMLElement>(widget, "[data-gsel-menu]");
  const selected = select.selectedOptions[0] ?? select.options[0];
  widget.classList.toggle("gsel--disabled", select.disabled);
  if (trigger) {
    trigger.disabled = select.disabled;
    trigger.setAttribute("aria-disabled", String(select.disabled));
  }
  if (label) label.textContent = selected?.textContent ?? "";
  if (!menu) return;

  menu.textContent = "";
  const options = Array.from(select.options);
  const optionButtons: HTMLButtonElement[] = [];

  if (options.length > 8) {
    const searchItem = document.createElement("li");
    searchItem.className = "gsel__search-row";
    const search = document.createElement("input");
    search.type = "search";
    search.className = "gsel__search";
    search.placeholder = "Buscar...";
    search.autocomplete = "off";
    search.dataset.gselSearch = "";
    search.addEventListener("click", (event) => event.stopPropagation());
    search.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeGraphSelect(widget);
        trigger?.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        optionButtons.find((button) => !button.hidden)?.focus();
      }
    });
    search.addEventListener("input", () => {
      const query = search.value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();
      optionButtons.forEach((button) => {
        const labelText = (button.textContent ?? "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        const hidden = query.length > 0 && !labelText.includes(query);
        button.hidden = hidden;
        button.closest("li")!.hidden = hidden;
      });
    });
    searchItem.append(search);
    menu.append(searchItem);
  }

  options.forEach((option) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gsel__option";
    button.role = "option";
    button.dataset.value = option.value;
    button.textContent = option.textContent;
    button.setAttribute(
      "aria-selected",
      option.value === select.value ? "true" : "false",
    );
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      select.value = option.value;
      refreshGraphSelect(select);
      select.dispatchEvent(new Event("change", { bubbles: true }));
      closeGraphSelect(widget);
      trigger?.focus();
    });
    button.addEventListener("keydown", (event) => {
      const visibleOptions = qsa<HTMLButtonElement>(
        menu,
        ".gsel__option",
      ).filter((item) => !item.hidden);
      const currentIndex = visibleOptions.indexOf(button);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        visibleOptions[(currentIndex + 1) % visibleOptions.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentIndex <= 0)
          qs<HTMLInputElement>(widget, "[data-gsel-search]")?.focus();
        else visibleOptions[currentIndex - 1]?.focus();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        button.click();
      } else if (event.key === "Escape") {
        closeGraphSelect(widget);
        trigger?.focus();
      }
    });
    optionButtons.push(button);
    item.append(button);
    menu.append(item);
  });
}

function enhanceGraphSelects(root: HTMLElement) {
  const globalWindow = window as Window & {
    __graphSelectClickInited?: boolean;
  };
  if (!globalWindow.__graphSelectClickInited) {
    globalWindow.__graphSelectClickInited = true;
    document.addEventListener("click", (event) => {
      qsa<HTMLElement>(document, ".gsel--open").forEach((widget) => {
        if (!widget.contains(event.target as Node)) closeGraphSelect(widget);
      });
    });
  }

  for (const select of qsa<HTMLSelectElement>(root, "[data-graph-select]")) {
    if (select.dataset.gselEnhanced === "true") {
      refreshGraphSelect(select);
      continue;
    }
    select.dataset.gselEnhanced = "true";
    const widget = document.createElement("div");
    widget.className = "gsel";
    widget.dataset.gsel = "";
    widget.innerHTML = `
      <button type="button" class="gsel__trigger" aria-haspopup="listbox" aria-expanded="false" data-gsel-trigger>
        <span class="gsel__label" data-gsel-label></span>
        <span class="gsel__caret" aria-hidden="true"></span>
      </button>
      <ul class="gsel__menu" role="listbox" data-gsel-menu hidden></ul>
    `;
    const trigger = qs<HTMLButtonElement>(widget, "[data-gsel-trigger]");
    trigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (select.disabled) return;
      widget.classList.contains("gsel--open")
        ? closeGraphSelect(widget)
        : openGraphSelect(widget);
    });
    trigger?.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openGraphSelect(widget);
        qs<HTMLButtonElement>(widget, ".gsel__option")?.focus();
      } else if (event.key === "Escape") {
        closeGraphSelect(widget);
      }
    });
    select.insertAdjacentElement("afterend", widget);
    refreshGraphSelect(select);
  }
}

function refreshGraphSelects(root: HTMLElement) {
  qsa<HTMLSelectElement>(root, "[data-graph-select]").forEach(
    refreshGraphSelect,
  );
}

function syncDepthControl(root: HTMLElement) {
  const input = qs<HTMLInputElement>(root, "[data-graph-depth]");
  const output = qs<HTMLOutputElement>(root, "[data-graph-depth-value]");
  if (!input || !output) return;
  output.value = input.value;
  output.textContent = input.value;
  output.toggleAttribute("aria-disabled", input.disabled);
}

function syncLayoutControl(root: HTMLElement) {
  const select = qs<HTMLSelectElement>(root, "[data-graph-layout]");
  if (!select) return;
  qsa<HTMLButtonElement>(root, "[data-graph-layout-choice]").forEach(
    (button) => {
      const selected = button.dataset.graphLayoutChoice === select.value;
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
    },
  );
}

function bindLayoutControls(root: HTMLElement) {
  const select = qs<HTMLSelectElement>(root, "[data-graph-layout]");
  if (!select) return;
  const buttons = qsa<HTMLButtonElement>(root, "[data-graph-layout-choice]");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.graphLayoutChoice;
      if (!choice || select.value === choice) return;
      select.value = choice;
      syncLayoutControl(root);
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    button.addEventListener("keydown", (event) => {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowUp"
      )
        return;
      event.preventDefault();
      const direction =
        event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const next = buttons[(index + direction + buttons.length) % buttons.length];
      next?.focus();
      next?.click();
    });
  });
  syncLayoutControl(root);
}

function updateFocusOptions(root: HTMLElement, payload: GraphPayload) {
  const typeSelect = qs<HTMLSelectElement>(root, "[data-graph-focus-type]");
  const depthInput = qs<HTMLInputElement>(root, "[data-graph-depth]");
  if (!typeSelect) return;

  const type = typeSelect.value as FocusKind;
  syncFocusPickers(root);
  if (type === "inventario") {
    if (depthInput) depthInput.disabled = true;
    syncDepthControl(root);
    return;
  }

  if (depthInput) depthInput.disabled = false;
  const current = getFocusRawIds(root, type);
  const nodes = payload.nodes.filter((node) => node.kind === type);
  if (current.length === 0 && nodes[0]) {
    const picker = activeFocusPicker(root, type);
    if (picker) setMultiSelectValues(picker, [nodes[0].rawId]);
  }
  syncDepthControl(root);
}

function parseUrlState(root: HTMLElement, payload: GraphPayload) {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("focus") as FocusKind | null;
  const id = params.get("id");
  const depth = params.get("depth");
  const layout = params.get("layout");
  const typeSelect = qs<HTMLSelectElement>(root, "[data-graph-focus-type]");
  const depthInput = qs<HTMLInputElement>(root, "[data-graph-depth]");
  const layoutSelect = qs<HTMLSelectElement>(root, "[data-graph-layout]");

  if (type && FOCUS_KINDS.includes(type) && typeSelect) {
    typeSelect.value = type;
  }
  updateFocusOptions(root, payload);
  if (id && typeSelect?.value !== "inventario") {
    const focusType = typeSelect?.value as FocusKind;
    const valid = new Set(
      payload.nodes
        .filter((node) => node.kind === focusType)
        .map((node) => node.rawId),
    );
    const ids = id.split(",").filter((value) => valid.has(value));
    const picker = activeFocusPicker(root, focusType);
    if (ids.length > 0 && picker) setMultiSelectValues(picker, ids);
  }
  if (depth && depthInput && ["1", "2", "3"].includes(depth))
    depthInput.value = depth;
  if (layout && layoutSelect && ["breadthfirst", "cose"].includes(layout))
    layoutSelect.value = layout;
  refreshGraphSelects(root);
  syncDepthControl(root);
  syncLayoutControl(root);
}

function pushUrlState(root: HTMLElement) {
  const type = getFocusKind(root);
  const ids = getFocusRawIds(root, type);
  const depth = qs<HTMLInputElement>(root, "[data-graph-depth]")?.value ?? "1";
  const layout =
    qs<HTMLSelectElement>(root, "[data-graph-layout]")?.value ?? "cose";
  const params = new URLSearchParams({ focus: type, layout });
  if (type !== "inventario") {
    if (ids.length > 0) params.set("id", ids.join(","));
    params.set("depth", depth);
  }
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`,
  );
}

function allowedSubgraph(
  root: HTMLElement,
  payload: GraphPayload,
): {
  nodes: Set<string>;
  edges: GraphEdge[];
  depthByNode: Map<string, number>;
} {
  const edgeKinds = getChecked<EdgeKind>(root, "[data-edge-kind]");
  const nodeKinds = getChecked<NodeKind>(root, "[data-node-kind]");
  const focusType = getFocusKind(root);
  const focuses = getFocusNodeIds(root);
  const edgePool = payload.edges.filter((edge) => edgeKinds.has(edge.kind));

  if (focusType === "inventario" || focuses.length === 0) {
    const visibleNodes = new Set(
      payload.nodes
        .filter((node) => nodeKinds.has(node.kind))
        .map((node) => node.id),
    );
    const visibleEdges = edgePool.filter(
      (edge) => visibleNodes.has(edge.source) && visibleNodes.has(edge.target),
    );
    return {
      nodes: visibleNodes,
      edges: visibleEdges,
      depthByNode: new Map(Array.from(visibleNodes).map((id) => [id, 1])),
    };
  }

  const depth = Number(
    qs<HTMLInputElement>(root, "[data-graph-depth]")?.value ?? "1",
  );
  const adjacency = new Map<string, GraphEdge[]>();
  for (const edge of edgePool) {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
    adjacency.get(edge.source)!.push(edge);
    adjacency.get(edge.target)!.push(edge);
  }

  const visibleNodes = new Set<string>(focuses);
  const visibleEdges = new Map<string, GraphEdge>();
  const depthByNode = new Map<string, number>(focuses.map((id) => [id, 0]));
  const queue: Array<{ id: string; depth: number }> = focuses.map((id) => ({
    id,
    depth: 0,
  }));

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= depth) continue;
    for (const edge of adjacency.get(current.id) ?? []) {
      const next = edge.source === current.id ? edge.target : edge.source;
      const node = payload.nodes.find((item) => item.id === next);
      if (!node) continue;
      if (!nodeKinds.has(node.kind) && !focuses.includes(next)) continue;
      visibleEdges.set(edge.id, edge);
      if (!visibleNodes.has(next)) {
        visibleNodes.add(next);
        depthByNode.set(next, current.depth + 1);
        queue.push({ id: next, depth: current.depth + 1 });
      }
    }
  }

  return {
    nodes: visibleNodes,
    edges: Array.from(visibleEdges.values()).filter(
      (edge) => visibleNodes.has(edge.source) && visibleNodes.has(edge.target),
    ),
    depthByNode,
  };
}

function edgePairKey(edge: GraphEdge): string {
  return [edge.source, edge.target].sort().join("::");
}

function aggregateEdges(edges: GraphEdge[]): GraphEdge[] {
  const groups = new Map<string, GraphEdge[]>();
  for (const edge of edges) {
    const key = edgePairKey(edge);
    groups.set(key, [...(groups.get(key) ?? []), edge]);
  }

  return Array.from(groups.values()).map((group) => {
    if (group.length === 1) return group[0];
    const first = group[0];
    const kinds = Array.from(new Set(group.map((edge) => edge.kind)));
    const preferredKind =
      (
        ["procesal", "institucional", "caso_caso", "documental"] as EdgeKind[]
      ).find((kind) => kinds.includes(kind)) ?? first.kind;
    const detail = group
      .map(
        (edge) =>
          `${EDGE_LABEL[edge.kind]}: ${edge.label}${edge.detail ? ` - ${shortDetail(edge.detail, 120)}` : ""}`,
      )
      .join("\n");

    return {
      ...first,
      id: `aggregate:${edgePairKey(first)}`,
      kind: preferredKind,
      label: `${group.length} relaciones`,
      detail,
      date: undefined,
      sourceLevel: undefined,
      meta: {
        ...(first.meta ?? {}),
        aggregate_count: group.length,
        aggregate_kinds: kinds.map((kind) => EDGE_LABEL[kind]).join(", "),
      },
    };
  });
}

function renderDetails(
  root: HTMLElement,
  payload: GraphPayload,
  selectedId: string,
) {
  const panel = qs<HTMLElement>(root, "[data-graph-details]");
  if (!panel) return;
  const node = payload.nodes.find((item) => item.id === selectedId);
  const edge =
    renderedEdgesByRoot.get(root)?.get(selectedId) ??
    payload.edges.find((item) => item.id === selectedId);
  if (node) {
    const sublabelFull = flatDetail(node.sublabel);
    const sublabelPreview = sublabelFull ? shortDetail(node.sublabel) : "";
    const titleHtml = node.href
      ? `<a href="${escapeHtml(node.href)}">${escapeHtml(node.label)}</a>`
      : escapeHtml(node.label);
    panel.innerHTML = `
      ${detailsTopMarkup(NODE_LABEL[node.kind], titleHtml)}
      ${sublabelPreview ? summaryMarkup(sublabelPreview, sublabelFull, isDetailTruncated(node.sublabel)) : ""}
      <dl class="graph-details__meta">
        <div><dt>ID</dt><dd class="mono">${escapeHtml(node.rawId)}</dd></div>
        <div><dt>Tipo</dt><dd>${NODE_LABEL[node.kind]}</dd></div>
      </dl>
    `;
    return;
  }
  if (edge) {
    const nodes = nodeById(payload);
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);
    const detailFull = flatDetail(edge.detail);
    const detailFallback = "Relación derivada del modelo de datos.";
    const detailPreview = detailFull ? shortDetail(edge.detail) : detailFallback;
    panel.innerHTML = `
      ${detailsTopMarkup(EDGE_LABEL[edge.kind], escapeHtml(edge.label))}
      ${summaryMarkup(
        detailPreview,
        detailFull || detailFallback,
        isDetailTruncated(edge.detail),
      )}
      <dl class="graph-details__meta">
        <div><dt>Origen</dt><dd>${escapeHtml(source?.label ?? edge.source)}</dd></div>
        <div><dt>Destino</dt><dd>${escapeHtml(target?.label ?? edge.target)}</dd></div>
        ${edge.date ? `<div><dt>Fecha</dt><dd class="mono">${escapeHtml(edge.date)}</dd></div>` : ""}
        ${edge.sourceLevel ? `<div><dt>Nivel</dt><dd>N${edge.sourceLevel}</dd></div>` : ""}
      </dl>
    `;
  }
}

function renderTable(
  root: HTMLElement,
  payload: GraphPayload,
  edges: GraphEdge[],
) {
  const tbody = qs<HTMLTableSectionElement>(root, "[data-graph-table-body]");
  const count = qs<HTMLElement>(root, "[data-graph-visible-count]");
  if (!tbody) return;
  const nodes = nodeById(payload);
  tbody.textContent = "";
  for (const edge of edges) {
    const source = nodes.get(edge.source);
    const target = nodes.get(edge.target);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge badge--cat">${EDGE_LABEL[edge.kind]}</span></td>
      <td>${source?.href ? `<a href="${source.href}">${source.label}</a>` : (source?.label ?? edge.source)}</td>
      <td>${edge.label}</td>
      <td>${target?.href ? `<a href="${target.href}">${target.label}</a>` : (target?.label ?? edge.target)}</td>
      <td>${edge.date ? `<span class="c-date">${edge.date}</span>` : '<span class="muted">—</span>'}</td>
    `;
    tbody.append(tr);
  }
  if (count) count.textContent = String(edges.length);
}

function syncPanelButtons(root: HTMLElement) {
  const tableOpen = root.hasAttribute("data-table-open");
  qsa<HTMLButtonElement>(root, "[data-graph-toggle-table]").forEach(
    (button) => {
      button.setAttribute("aria-pressed", String(tableOpen));
      button.classList.toggle("is-active", tableOpen);
      const label = qs<HTMLElement>(button, "[data-graph-table-label]");
      if (label) label.textContent = tableOpen ? "Cerrar relaciones" : "Ver relaciones";
    },
  );
}

function setPanelOpen(
  root: HTMLElement,
  attr: "data-details-open" | "data-table-open",
  open: boolean,
) {
  root.toggleAttribute(attr, open);
  syncPanelButtons(root);
}

function setCenteredState(root: HTMLElement, centered: boolean) {
  const button = qs<HTMLButtonElement>(root, "[data-graph-fit]");
  if (!button) return;
  const label = qs<HTMLElement>(button, "[data-graph-fit-label]");
  if (label) label.textContent = centered ? "Centrado" : "Recentrar";
  button.setAttribute("aria-pressed", String(centered));
  button.classList.toggle("is-active", centered);
}

function graphSeparationFactor(root: HTMLElement): number {
  const value = Number.parseFloat(
    qs<HTMLInputElement>(root, "[data-graph-separation]")?.value ?? "1",
  );
  return Number.isFinite(value) ? value : 1;
}

function syncSeparationControl(root: HTMLElement) {
  const value = graphSeparationFactor(root);
  const label = qs<HTMLElement>(root, "[data-graph-separation-value]");
  if (label) label.textContent = `${value.toFixed(1)}x`;
}

const GRAPH_MIN_ZOOM = 0.18;
const GRAPH_MAX_ZOOM = 3;

function syncZoomControl(root: HTMLElement, cy: Core) {
  const slider = qs<HTMLInputElement>(root, "[data-graph-zoom-slider]");
  if (!slider) return;
  const zoom = Math.min(
    GRAPH_MAX_ZOOM,
    Math.max(GRAPH_MIN_ZOOM, cy.zoom()),
  );
  slider.value = String(zoom);
  slider.setAttribute("aria-valuenow", zoom.toFixed(2));
}

function setGraphZoom(root: HTMLElement, cy: Core, zoom: number) {
  const next = Math.min(
    GRAPH_MAX_ZOOM,
    Math.max(GRAPH_MIN_ZOOM, zoom),
  );
  root.dataset.graphZoomFromControl = "true";
  cy.zoom({
    level: next,
    renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
  });
  syncZoomControl(root, cy);
  delete root.dataset.graphZoomFromControl;
  setCenteredState(root, false);
}

function bindZoomControls(root: HTMLElement, getCy: () => Core | null) {
  const slider = qs<HTMLInputElement>(root, "[data-graph-zoom-slider]");
  const zoomIn = qs<HTMLButtonElement>(root, "[data-graph-zoom-in]");
  const zoomOut = qs<HTMLButtonElement>(root, "[data-graph-zoom-out]");
  if (!slider) return;

  slider.addEventListener("input", () => {
    const cy = getCy();
    if (!cy) return;
    setGraphZoom(root, cy, Number.parseFloat(slider.value));
  });

  zoomIn?.addEventListener("click", () => {
    const cy = getCy();
    if (!cy) return;
    setGraphZoom(root, cy, cy.zoom() * 1.22);
  });

  zoomOut?.addEventListener("click", () => {
    const cy = getCy();
    if (!cy) return;
    setGraphZoom(root, cy, cy.zoom() / 1.22);
  });
}

function syncMobileControlsLayout(root: HTMLElement) {
  const narrow = isNarrowGraphViewport(graphViewportWidth(root));
  root.toggleAttribute("data-graph-narrow", narrow);
  if (!narrow) {
    root.style.removeProperty("--graph-dock-offset");
    return;
  }
  queueMobileDockMeasure(root);
}

function queueMobileDockMeasure(root: HTMLElement) {
  if (!root.hasAttribute("data-graph-narrow")) return;
  window.requestAnimationFrame(() => {
    const panel = qs<HTMLElement>(root, ".graph-panel--controls");
    if (!panel) return;
    const height = Math.ceil(panel.getBoundingClientRect().height);
    root.style.setProperty("--graph-dock-offset", `${height + 12}px`);
  });
}

function setControlsMinimized(root: HTMLElement, minimized: boolean) {
  root.toggleAttribute("data-controls-minimized", minimized);
  const button = qs<HTMLButtonElement>(root, "[data-graph-toggle-controls]");
  const label = qs<HTMLElement>(root, "[data-graph-toggle-label]");
  const summary = qs<HTMLElement>(root, "[data-graph-filter-summary]");
  if (summary) summary.hidden = !minimized;
  if (button) {
    button.setAttribute("aria-expanded", String(!minimized));
    button.setAttribute(
      "aria-label",
      minimized
        ? "Expandir controles del grafo"
        : "Minimizar controles del grafo",
    );
  }
  if (label) label.textContent = minimized ? "Expandir" : "Minimizar";
  queueMobileDockMeasure(root);
}

function closeRelationInfoPopovers(root: HTMLElement, except?: HTMLElement) {
  qsa<HTMLButtonElement>(root, "[data-graph-info]").forEach((button) => {
    const popover = button.getAttribute("aria-controls")
      ? document.getElementById(button.getAttribute("aria-controls")!)
      : null;
    if (button === except) return;
    button.setAttribute("aria-expanded", "false");
    if (popover) popover.hidden = true;
  });
}

function clearGraphHighlight(cy: Core) {
  cy.elements().removeClass("is-dim is-highlight is-focus");
  cy.nodes().forEach((node) => {
    node.data("displayLabel", node.data("shortLabel"));
  });
}

function highlightGraphNeighborhood(
  cy: Core,
  targetId: string,
  revealLabel = false,
) {
  const target = cy.getElementById(targetId);
  if (target.empty()) {
    clearGraphHighlight(cy);
    return;
  }
  cy.nodes().forEach((node) => {
    node.data("displayLabel", node.data("shortLabel"));
  });
  let neighborhood;
  if (target.isEdge()) {
    neighborhood = target.union(target.connectedNodes());
  } else {
    neighborhood = (target as NodeSingular).closedNeighborhood();
  }
  cy.elements().removeClass("is-dim is-highlight is-focus");
  cy.elements().difference(neighborhood).addClass("is-dim");
  neighborhood.addClass("is-highlight");
  target.addClass("is-focus");
  if (revealLabel && target.isNode()) {
    target.data("displayLabel", target.data("fullLabel"));
  }
}

function makeElements(
  payload: GraphPayload,
  visibleNodes: Set<string>,
  visibleEdges: GraphEdge[],
  depthByNode: Map<string, number>,
): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  for (const node of payload.nodes) {
    if (!visibleNodes.has(node.id)) continue;
    elements.push({
      group: "nodes",
      data: {
        id: node.id,
        label: node.label,
        shortLabel: shortNodeLabel(node.label, node.kind),
        fullLabel: node.label,
        displayLabel: shortNodeLabel(node.label, node.kind),
        kind: node.kind,
        href: node.href,
        depth: depthByNode.get(node.id) ?? 0,
      },
      classes: [
        `kind-${node.kind}`,
        `depth-${depthByNode.get(node.id) ?? 0}`,
      ].join(" "),
    });
  }
  for (const edge of visibleEdges) {
    elements.push({
      group: "edges",
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        kind: edge.kind,
      },
      classes: [`edge-${edge.kind}`].join(" "),
    });
  }
  return elements;
}

const GRAPH_NARROW_MAX_WIDTH = 760;

function isNarrowGraphViewport(width: number): boolean {
  return width < GRAPH_NARROW_MAX_WIDTH;
}

function graphViewportWidth(root: HTMLElement): number {
  const canvas = qs<HTMLElement>(root, "[data-graph-canvas]");
  return canvas?.clientWidth ?? window.innerWidth;
}

function fitPaddingForNodeCount(
  nodeCount: number,
  focusType: FocusKind,
  narrow: boolean,
): number {
  const focused = focusType !== "inventario";
  let padding: number;
  if (nodeCount <= 3) padding = focused ? 200 : 168;
  else if (nodeCount <= 8) padding = focused ? 160 : 132;
  else if (nodeCount <= 16) padding = focused ? 128 : 108;
  else if (nodeCount <= 30) padding = focused ? 104 : 88;
  else padding = focused ? 84 : 72;

  if (!narrow) return padding;

  padding = Math.round(padding * 0.38);
  return Math.max(padding, focused ? 24 : 32);
}

function maxZoomForNodeCount(
  nodeCount: number,
  narrow: boolean,
): number | null {
  if (narrow) return null;

  if (nodeCount <= 2) return 0.8;
  if (nodeCount <= 5) return 1.05;
  if (nodeCount <= 10) return 1.35;
  if (nodeCount <= 20) return 1.65;
  return null;
}

function minZoomForNodeCount(
  nodeCount: number,
  narrow: boolean,
): number | null {
  if (!narrow) return null;
  if (nodeCount <= 3) return 1.05;
  if (nodeCount <= 8) return 0.9;
  if (nodeCount <= 16) return 0.72;
  if (nodeCount <= 30) return 0.58;
  return null;
}

function applyViewportFit(
  cy: Core,
  nodeCount: number,
  focusType: FocusKind,
  root?: HTMLElement,
) {
  const narrow = isNarrowGraphViewport(cy.width());
  const padding = fitPaddingForNodeCount(nodeCount, focusType, narrow);
  cy.fit(undefined, padding);

  const maxZoom = maxZoomForNodeCount(nodeCount, narrow);
  if (maxZoom !== null && cy.zoom() > maxZoom) {
    cy.zoom(maxZoom);
    cy.center();
  }

  const minZoom = minZoomForNodeCount(nodeCount, narrow);
  if (minZoom !== null && cy.zoom() < minZoom) {
    cy.zoom(minZoom);
    cy.center();
  }

  if (root) syncZoomControl(root, cy);
}

function layoutFor(root: HTMLElement, nodeCount: number): LayoutOptions {
  const focusType = getFocusKind(root);
  const narrow = isNarrowGraphViewport(graphViewportWidth(root));
  const padding = fitPaddingForNodeCount(nodeCount, focusType, narrow);
  const separation = graphSeparationFactor(root);
  const name =
    qs<HTMLSelectElement>(root, "[data-graph-layout]")?.value ?? "cose";
  if (name === "cose") {
    const inventario = focusType === "inventario";
    // Repulsión base de los nodos NO-caso (satélites: personas, orgs, docs).
    const baseRepulsion = inventario ? 8000 : 7000;
    // Los casos son los "núcleos": se repelen mucho más fuerte entre sí para
    // que cada caso forme su propia galaxia, separada de las demás. No es
    // separación global de nodos: sólo los casos empujan fuerte.
    const casoRepulsionFactor = 8;
    const baseEdgeLength = inventario ? 90 : 120;
    // El selector de la UI mantiene el valor "cose" (modo "orgánico"); el
    // motor real es fcose. Sin animación de asentamiento: fcose calcula el
    // layout en una sola pasada (init espectral + pocas iteraciones) y pinta
    // ya colocado, sin la colocación-intermedia-luego-salto del cose base.
    // Nota de escalas: fcose NO usa la misma escala que cose para
    // `edgeElasticity` (cose ~32-120, fcose ~0.45) ni para `gravity`.
    return {
      name: "fcose",
      quality: "default",
      randomize: true,
      animate: false,
      fit: false,
      padding,
      nodeRepulsion: (node: NodeSingular) => {
        const degree = node.connectedEdges().length;
        const hubBoost = Math.min(degree, 14) / 14;
        // Sólo los casos reciben el factor de núcleo; el resto se queda suave
        // para no disgregar el satélite de su caso.
        const kindFactor = node.data("kind") === "caso" ? casoRepulsionFactor : 1;
        return (
          baseRepulsion * kindFactor * separation * (1 + hubBoost * (separation - 0.6))
        );
      },
      idealEdgeLength: (edge: EdgeSingular) => {
        const degree = Math.max(
          edge.source().connectedEdges().length,
          edge.target().connectedEdges().length,
        );
        const hubBoost = Math.min(degree, 14) / 14;
        // `caso_caso` (núcleo↔núcleo): arista larga, casos relacionados pero a
        // distancia. El resto (caso→satélite, vínculos): arista corta para que
        // el satélite se pegue a su núcleo.
        const kindLength =
          edge.data("kind") === "caso_caso"
            ? baseEdgeLength * 3.5
            : baseEdgeLength * 0.72;
        return kindLength * separation * (1 + hubBoost * 0.42);
      },
      edgeElasticity: (edge: EdgeSingular) =>
        // Muelle rígido para sujetar el satélite a su caso pese a la repulsión
        // del núcleo; `caso_caso` más blando para no pelear con la separación.
        edge.data("kind") === "caso_caso" ? 0.2 : 0.55,
      nodeSeparation: 75 * separation,
      gravity: (inventario ? 0.16 : 0.32) / Math.max(separation, 0.8),
      gravityRange: 3.8,
      numIter: inventario ? 3000 : 1800,
      tile: true,
      packComponents: true,
    } as unknown as LayoutOptions;
  }
  return {
    name: "breadthfirst",
    roots: getFocusNodeIds(root).length > 0 ? getFocusNodeIds(root) : undefined,
    directed: false,
    animate: false,
    fit: false,
    padding,
    spacingFactor: (nodeCount <= 8 ? 1.55 : 1.25) * separation,
    avoidOverlap: true,
  };
}

function applyLocalMeshDrag(node: NodeSingular) {
  const last = node.scratch(MESH_DRAG_SCRATCH) as
    | { x: number; y: number }
    | undefined;
  const current = node.position();
  if (!last) {
    node.scratch(MESH_DRAG_SCRATCH, { x: current.x, y: current.y });
    return;
  }

  const dx = current.x - last.x;
  const dy = current.y - last.y;
  if (Math.abs(dx) + Math.abs(dy) < 0.5) return;

  const touched = new Set<string>([node.id()]);
  const firstDegree = node.connectedEdges().connectedNodes().difference(node);
  firstDegree.forEach((neighbor) => {
    if (neighbor.grabbed()) return;
    const position = neighbor.position();
    neighbor.position({ x: position.x + dx * 0.18, y: position.y + dy * 0.18 });
    touched.add(neighbor.id());
  });

  const secondDegree = firstDegree
    .connectedEdges()
    .connectedNodes()
    .difference(node)
    .difference(firstDegree);
  secondDegree.forEach((neighbor) => {
    if (neighbor.grabbed() || touched.has(neighbor.id())) return;
    const position = neighbor.position();
    neighbor.position({
      x: position.x + dx * 0.045,
      y: position.y + dy * 0.045,
    });
  });

  node.scratch(MESH_DRAG_SCRATCH, { x: current.x, y: current.y });
}

// Paleta del grafo (Cytoscape pinta en canvas, así que no hereda las CSS
// custom properties: hay que resolver los colores en JS). Dos juegos
// coherentes con los tokens de global.css; se elige por data-theme y se
// reaplica al vuelo cuando el visitante tira de la cuerda de lámpara.
interface GraphColors {
  nodeBg: string;
  nodeBorder: string;
  nodeLabel: string;
  casoBg: string;
  casoBorder: string;
  casoLabel: string;
  casoTextBg: string;
  personaBg: string;
  personaBorder: string;
  orgBg: string;
  orgBorder: string;
  docBg: string;
  docBorder: string;
  edge: string;
  edgeLabel: string;
  edgeTextBg: string;
  focus: string;
  edgeProcesal: string;
  edgeInstitucional: string;
  edgeCasoCaso: string;
  edgeDocumental: string;
}

const GRAPH_COLORS_LIGHT: GraphColors = {
  nodeBg: "#9aa6b7",
  nodeBorder: "#ffffff",
  nodeLabel: "#20252c",
  casoBg: "#1f3a68",
  casoBorder: "#1f3a68",
  casoLabel: "#a78100",
  casoTextBg: "#ffffff",
  personaBg: "#ffffff",
  personaBorder: "#1f3a68",
  orgBg: "#d7dfeb",
  orgBorder: "#4a6694",
  docBg: "#fafafa",
  docBorder: "#8b949e",
  edge: "#8b949e",
  edgeLabel: "#5d6672",
  edgeTextBg: "#fafafa",
  focus: "#c89b00",
  edgeProcesal: "#1f3a68",
  edgeInstitucional: "#4a6694",
  edgeCasoCaso: "#c89b00",
  edgeDocumental: "#9aa1aa",
};

const GRAPH_COLORS_DARK: GraphColors = {
  nodeBg: "#6b7689",
  nodeBorder: "#15171a",
  nodeLabel: "#f0efe9",
  casoBg: "#3f6bab",
  casoBorder: "#3f6bab",
  casoLabel: "#e0bb5c",
  casoTextBg: "#23262b",
  personaBg: "#cdd6e6",
  personaBorder: "#7fa3d6",
  orgBg: "#33455f",
  orgBorder: "#7fa3d6",
  docBg: "#23262b",
  docBorder: "#76777a",
  edge: "#6b7280",
  edgeLabel: "#a8a59a",
  edgeTextBg: "#23262b",
  focus: "#e0bb5c",
  edgeProcesal: "#7fa3d6",
  edgeInstitucional: "#8aa3c9",
  edgeCasoCaso: "#e0bb5c",
  edgeDocumental: "#6b7280",
};

function graphColors(): GraphColors {
  return document.documentElement.dataset.theme === "dark"
    ? GRAPH_COLORS_DARK
    : GRAPH_COLORS_LIGHT;
}

function buildGraphStyle(c: GraphColors): StylesheetStyle[] {
  return [
    {
      selector: "node",
      style: {
        width: 18,
        height: 18,
        shape: "ellipse",
        "background-color": c.nodeBg,
        "border-width": 1.2,
        "border-color": c.nodeBorder,
        label: "data(displayLabel)",
        color: c.nodeLabel,
        "font-family": "Gill Sans, Lato, Source Sans 3, sans-serif",
        "font-size": 9,
        "font-weight": 600,
        "text-wrap": "none",
        "text-max-width": "96px",
        "text-valign": "bottom",
        "text-halign": "center",
        "text-margin-y": 5,
        "z-index-compare": "manual",
        "z-index": 3,
        "overlay-opacity": 0,
        "transition-property":
          "opacity, border-width, background-color, line-color, target-arrow-color, width",
        "transition-duration": 130,
      },
    },
    {
      selector: "node.kind-caso",
      style: {
        width: 34,
        height: 34,
        "background-color": c.casoBg,
        "border-color": c.casoBorder,
        color: c.casoLabel,
        "font-weight": 600,
        "font-size": 14,
        "text-wrap": "wrap",
        "text-max-width": "172px",
        "text-margin-y": 8,
        "text-background-color": c.casoTextBg,
        "text-background-opacity": 0.8,
        "text-background-padding": "3px",
        "text-background-shape": "rectangle",
        "z-index": 18,
      },
    },
    {
      selector: "node.kind-persona",
      style: {
        width: 22,
        height: 22,
        "background-color": c.personaBg,
        "border-color": c.personaBorder,
      },
    },
    {
      selector: "node.kind-organizacion",
      style: {
        width: 24,
        height: 24,
        "background-color": c.orgBg,
        "border-color": c.orgBorder,
      },
    },
    {
      selector: "node.kind-documento",
      style: {
        width: 14,
        height: 14,
        "background-color": c.docBg,
        "border-color": c.docBorder,
        "border-style": "dashed",
        "font-size": 8,
      },
    },
    {
      selector: "node.depth-2, node.depth-3",
      style: {
        opacity: 0.72,
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.2,
        "line-color": c.edge,
        "target-arrow-color": c.edge,
        "target-arrow-shape": "triangle",
        "target-arrow-fill": "filled",
        "curve-style": "bezier",
        color: c.edgeLabel,
        "font-size": 0,
        "font-family": "Gill Sans, Lato, Source Sans 3, sans-serif",
        "text-background-color": c.edgeTextBg,
        "text-background-opacity": 0.86,
        "text-background-padding": "2px",
        "text-rotation": "autorotate",
        opacity: 0.22,
        "z-index-compare": "manual",
        "z-index": 0,
        "transition-property":
          "opacity, width, line-color, target-arrow-color",
        "transition-duration": 130,
      },
    },
    {
      selector: "node.is-dim",
      style: {
        opacity: 0.12,
      },
    },
    {
      selector: "edge.is-dim",
      style: {
        opacity: 0.035,
      },
    },
    {
      selector: "node.is-highlight",
      style: {
        opacity: 1,
        "z-index": 14,
      },
    },
    {
      selector: "edge.is-highlight",
      style: {
        opacity: 0.86,
        width: 2,
        "z-index": 2,
      },
    },
    {
      selector: "node.is-focus",
      style: {
        "border-width": 3,
        "border-color": c.focus,
        "z-index": 24,
        "text-wrap": "wrap",
        "text-max-width": "158px",
      },
    },
    {
      selector: "node.kind-caso.is-focus",
      style: {
        "font-size": 15,
        "text-max-width": "190px",
        "text-background-opacity": 0.78,
        "text-background-padding": "4px",
        color: c.focus,
        "z-index": 32,
      },
    },
    {
      selector: "edge.is-focus",
      style: {
        opacity: 1,
        width: 2.5,
        "line-color": c.focus,
        "target-arrow-color": c.focus,
        "z-index": 4,
      },
    },
    {
      selector: "edge.edge-procesal",
      style: {
        "line-color": c.edgeProcesal,
        "target-arrow-color": c.edgeProcesal,
      },
    },
    {
      selector: "edge.edge-institucional",
      style: {
        "line-color": c.edgeInstitucional,
        "target-arrow-color": c.edgeInstitucional,
      },
    },
    {
      selector: "edge.edge-caso_caso",
      style: {
        "line-color": c.edgeCasoCaso,
        "target-arrow-color": c.edgeCasoCaso,
        "line-style": "dashed",
      },
    },
    {
      selector: "edge.edge-documental",
      style: {
        "line-color": c.edgeDocumental,
        "target-arrow-color": c.edgeDocumental,
        "line-style": "dotted",
      },
    },
    {
      selector: ":selected",
      style: {
        "border-width": 3,
        "border-color": c.focus,
        "background-color": c.focus,
        "line-color": c.focus,
        "target-arrow-color": c.focus,
      },
    },
  ];
}

function renderGraph(
  root: HTMLElement,
  payload: GraphPayload,
  cy: Core | null,
): Core {
  const container = qs<HTMLElement>(root, "[data-graph-canvas]");
  if (!container) throw new Error("Missing graph container");
  const subgraph = allowedSubgraph(root, payload);
  const focuses = getFocusNodeIds(root);
  const displayEdges = aggregateEdges(subgraph.edges);
  renderedEdgesByRoot.set(
    root,
    new Map(displayEdges.map((edge) => [edge.id, edge])),
  );
  const elements = makeElements(
    payload,
    subgraph.nodes,
    displayEdges,
    subgraph.depthByNode,
  );

  if (!cy) {
    cy = cytoscape({
      container,
      elements,
      minZoom: GRAPH_MIN_ZOOM,
      maxZoom: GRAPH_MAX_ZOOM,
      wheelSensitivity: 1.6,
      style: buildGraphStyle(graphColors()),
    });
    // Reaplica la paleta del grafo cuando cambia el tema (la cuerda de
    // lámpara escribe data-theme en <html>). Cytoscape pinta en canvas, así
    // que no reacciona solo a las CSS custom properties.
    const themeObserver = new MutationObserver(() => {
      cy!.style(buildGraphStyle(graphColors()));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    let lockedHighlightId = "";
    cy.on("mouseover", "node, edge", (event) => {
      if (lockedHighlightId) return;
      highlightGraphNeighborhood(cy!, event.target.id(), true);
    });
    cy.on("mouseout", "node, edge", () => {
      if (lockedHighlightId) return;
      clearGraphHighlight(cy!);
    });
    cy.on("tap", "node, edge", (event) => {
      lockedHighlightId = event.target.id();
      root.dataset.graphSelectedId = lockedHighlightId;
      highlightGraphNeighborhood(cy!, lockedHighlightId, true);
      renderDetails(root, payload, event.target.id());
      if (!root.hasAttribute("data-details-suppressed")) {
        setPanelOpen(root, "data-details-open", true);
      }
    });
    cy.on("tap", (event) => {
      if (event.target !== cy) return;
      lockedHighlightId = "";
      delete root.dataset.graphSelectedId;
      clearGraphHighlight(cy!);
    });
    cy.on("dbltap", "node", (event) => {
      const href = event.target.data("href");
      if (href) window.location.href = href;
    });
    cy.on("pan drag", () => {
      if (root.dataset.graphViewportLocked === "true") return;
      setCenteredState(root, false);
    });
    cy.on("zoom", () => {
      if (root.dataset.graphViewportLocked === "true") return;
      if (root.dataset.graphZoomFromControl === "true") return;
      syncZoomControl(root, cy!);
      setCenteredState(root, false);
    });
    cy.on("grab", "node", (event) => {
      const node = event.target as NodeSingular;
      node.scratch(MESH_DRAG_SCRATCH, node.position());
    });
    cy.on("drag", "node", (event) => {
      if (
        (qs<HTMLSelectElement>(root, "[data-graph-layout]")?.value ??
          "cose") !== "cose"
      )
        return;
      applyLocalMeshDrag(event.target as NodeSingular);
    });
    cy.on("dragfree", "node", (event) => {
      setCenteredState(root, false);
      (event.target as NodeSingular).removeScratch(MESH_DRAG_SCRATCH);
    });
  } else {
    cy.elements().remove();
    cy.add(elements);
  }

  root.dataset.graphViewportLocked = "true";
  const nodeCount = subgraph.nodes.size;
  const focusType = getFocusKind(root);
  const layout = cy.layout(layoutFor(root, nodeCount));
  layout.one("layoutstop", () => {
    applyViewportFit(cy!, nodeCount, focusType, root);
    delete root.dataset.graphViewportLocked;
    setCenteredState(root, true);
    // El grafo ya está colocado: retira el skeleton de carga (sólo la primera
    // vez; las relayout por filtro de fcose son rápidas y no lo remuestran).
    root.dataset.graphReady = "true";
  });
  layout.run();
  renderTable(root, payload, displayEdges);
  const visibleNodes = qs<HTMLElement>(root, "[data-graph-node-count]");
  if (visibleNodes) visibleNodes.textContent = String(subgraph.nodes.size);
  if (focuses.length === 1) renderDetails(root, payload, focuses[0]);
  renderFilterSummary(root);
  syncPanelButtons(root);
  queueMobileDockMeasure(root);
  return cy;
}

function init(root: HTMLElement) {
  const dataEl = qs<HTMLScriptElement>(root, "[data-graph-data]");
  if (!dataEl?.textContent) return;
  const payload = JSON.parse(dataEl.textContent) as GraphPayload;
  const form = qs<HTMLFormElement>(root, "[data-graph-form]");
  if (!form) return;

  for (const input of qsa<HTMLInputElement>(root, "[data-edge-kind]")) {
    input.checked = DEFAULT_EDGE_KINDS.has(input.value as EdgeKind);
  }
  for (const input of qsa<HTMLInputElement>(root, "[data-node-kind]")) {
    input.checked = DEFAULT_NODE_KINDS.has(input.value as NodeKind);
  }

  enhanceGraphSelects(root);
  bindLayoutControls(root);
  parseUrlState(root, payload);
  syncMobileControlsLayout(root);
  if (isNarrowGraphViewport(graphViewportWidth(root))) {
    setControlsMinimized(root, true);
  }
  let cy: Core | null = null;
  const rerender = () => {
    syncDepthControl(root);
    syncLayoutControl(root);
    pushUrlState(root);
    syncSeparationControl(root);
    cy = renderGraph(root, payload, cy);
  };

  bindZoomControls(root, () => cy);
  qsa<HTMLButtonElement>(root, "[data-graph-info]").forEach((button) => {
    const popover = button.getAttribute("aria-controls")
      ? document.getElementById(button.getAttribute("aria-controls")!)
      : null;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = button.getAttribute("aria-expanded") === "true";
      closeRelationInfoPopovers(root, button);
      button.setAttribute("aria-expanded", String(!open));
      if (popover) popover.hidden = open;
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeRelationInfoPopovers(root);
        button.focus();
      }
    });
  });
  document.addEventListener("click", (event) => {
    if (root.contains(event.target as Node)) {
      const target = event.target as HTMLElement;
      if (target.closest("[data-graph-info]") || target.closest(".graph-info-popover")) return;
    }
    closeRelationInfoPopovers(root);
  });
  qs<HTMLButtonElement>(root, "[data-graph-toggle-controls]")?.addEventListener(
    "click",
    () => {
      setControlsMinimized(
        root,
        !root.hasAttribute("data-controls-minimized"),
      );
    },
  );

  window.addEventListener("resize", () => {
    syncMobileControlsLayout(root);
    queueMobileDockMeasure(root);
  });

  if (typeof ResizeObserver !== "undefined") {
    const panel = qs<HTMLElement>(root, ".graph-panel--controls");
    if (panel) {
      const dockObserver = new ResizeObserver(() => queueMobileDockMeasure(root));
      dockObserver.observe(panel);
    }
  }

  qs<HTMLSelectElement>(root, "[data-graph-focus-type]")?.addEventListener(
    "change",
    () => {
      updateFocusOptions(root, payload);
      refreshGraphSelects(root);
    },
  );
  form.addEventListener("input", rerender);
  form.addEventListener("change", rerender);
  form.addEventListener("submit", (event) => event.preventDefault());
  qs<HTMLButtonElement>(root, "[data-graph-fit]")?.addEventListener(
    "click",
    () => {
      if (!cy) return;
      root.dataset.graphViewportLocked = "true";
      applyViewportFit(cy, cy.nodes().length, getFocusKind(root), root);
      setCenteredState(root, true);
      window.setTimeout(() => {
        delete root.dataset.graphViewportLocked;
      }, 90);
    },
  );
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-graph-close-details]")) {
      setPanelOpen(root, "data-details-open", false);
      return;
    }
    const expand = target.closest<HTMLButtonElement>(
      "[data-graph-expand-details]",
    );
    if (expand) {
      event.preventDefault();
      toggleDetailsSummaryExpand(expand);
    }
  });
  qs<HTMLInputElement>(root, "[data-graph-suppress-details]")?.addEventListener(
    "change",
    (event) => {
      const input = event.currentTarget as HTMLInputElement;
      root.toggleAttribute("data-details-suppressed", input.checked);
      if (input.checked) {
        setPanelOpen(root, "data-details-open", false);
      } else {
        syncPanelButtons(root);
      }
    },
  );
  qsa<HTMLButtonElement>(root, "[data-graph-toggle-table]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        setPanelOpen(
          root,
          "data-table-open",
          !root.hasAttribute("data-table-open"),
        );
      });
    },
  );
  qs<HTMLButtonElement>(root, "[data-graph-copy]")?.addEventListener(
    "click",
    async () => {
      const status = qs<HTMLElement>(root, "[data-graph-copy-status]");
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (status) status.textContent = "Enlace copiado";
      } catch {
        if (status) status.textContent = "No se pudo copiar";
      }
    },
  );

  rerender();
}

document.querySelectorAll<HTMLElement>("[data-graph-root]").forEach(init);
