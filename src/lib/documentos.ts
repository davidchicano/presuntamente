export interface DocumentoUrls {
  ruta_local?: string;
  url_canonica?: string;
  url_archivo?: string;
}

/** Best URL to open the document itself: local copy, then canonical, then archive. */
export function documentoPrimaryHref(doc: DocumentoUrls): string | undefined {
  const ruta = doc.ruta_local?.trim();
  if (ruta) return ruta;
  const canon = doc.url_canonica?.trim();
  if (canon) return canon;
  const arch = doc.url_archivo?.trim();
  if (arch) return arch;
  return undefined;
}

export function documentoBibliotecaAnchor(docId: string): string {
  return `#doc-${docId}`;
}

/** Prefer opening the document; fall back to a biblioteca anchor when no URL exists. */
export function documentoRespaldoHref(
  docId: string,
  doc: DocumentoUrls | undefined,
  bibliotecaBaseHref?: string,
): string | undefined {
  if (!doc) return undefined;
  const primary = documentoPrimaryHref(doc);
  if (primary) return primary;
  const anchor = documentoBibliotecaAnchor(docId);
  return bibliotecaBaseHref ? `${bibliotecaBaseHref}${anchor}` : anchor;
}

export function documentoHrefIsExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
