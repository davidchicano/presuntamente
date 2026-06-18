#!/usr/bin/env node
/**
 * Archivado en archive.org de URLs sin url_archivo.
 *
 * Fuentes:
 *   - content/documentos/*.yaml — documentos N4 (campo url_canonica)
 *   - content/cobertura-mediatica/*.yaml — noticias del corpus (campo url por ítem)
 *   - content/casos/<slug>/caso.yaml — contenido_no_modelado[].fuentes[] (campo url)
 *
 * Modos:
 *   --staged-only      Solo YAML en staging (tope 5 URLs por defecto; uso manual).
 *   --catchup          Todo el backlog pendiente del repo.
 *   --caso=<slug>      Filtra por caso.
 *   --dry-run          Lista pendientes sin llamar a archive.org.
 *   --hook-max=<n>     Tope en --staged-only.
 *   --force-save       Siempre llama a /save/; no reutiliza snapshots existentes.
 *   --limit=<n>        Procesa como máximo n URLs (útil para pruebas).
 *
 * Velocidad:
 *   1. wayback/available: si ya hay snapshot, reutiliza (segundos, sin /save/).
 *   2. ARCHIVAR_WAIT_MS: pausa entre URLs (catchup default 2s; staged-only default 8s).
 *   3. /save/ solo si no hay snapshot o --force-save (30s–2min por URL).
 *
 * Variables de entorno:
 *   ARCHIVAR_WAIT_MS, ARCHIVAR_HOOK_MAX, ARCHIVAR_SKIP_REUSE=1
 */

import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { glob } from 'glob';
import { parse as parseYaml } from 'yaml';

const SAVE_ENDPOINT = 'https://web.archive.org/save/';
const AVAILABLE_ENDPOINT = 'https://archive.org/wayback/available';
const DEFAULT_WAIT_HOOK_MS = 8_000;
const DEFAULT_WAIT_CATCHUP_MS = 2_000;
const WAIT_AFTER_REUSE_MS = 800;
const REQUEST_TIMEOUT_MS = 180_000;
const AVAILABLE_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 2;
const RATE_LIMIT_BACKOFF_MS = 60_000;
const DEFAULT_HOOK_MAX = 5;
const UA = 'presuntamente.org/archivar-n4 (https://github.com/davidchicano/presuntamente)';

const args = process.argv.slice(2);
const stagedOnly = args.includes('--staged-only');
const catchup = args.includes('--catchup');
const dryRun = args.includes('--dry-run');
const forceSave = args.includes('--force-save');
const skipReuse = forceSave || process.env.ARCHIVAR_SKIP_REUSE === '1';
const casoArg = args.find((a) => a.startsWith('--caso='));
const hookMaxArg = args.find((a) => a.startsWith('--hook-max='));
const limitArg = args.find((a) => a.startsWith('--limit='));
const casoFilter = casoArg ? casoArg.slice('--caso='.length) : null;

let limit = null;
if (limitArg) {
  const n = Number.parseInt(limitArg.slice('--limit='.length), 10);
  if (!Number.isNaN(n) && n > 0) limit = n;
}

let hookMax = DEFAULT_HOOK_MAX;
if (process.env.ARCHIVAR_HOOK_MAX != null && process.env.ARCHIVAR_HOOK_MAX !== '') {
  hookMax = Number.parseInt(process.env.ARCHIVAR_HOOK_MAX, 10);
}
if (hookMaxArg) {
  hookMax = Number.parseInt(hookMaxArg.slice('--hook-max='.length), 10);
}
if (Number.isNaN(hookMax) || hookMax < 0) {
  hookMax = DEFAULT_HOOK_MAX;
}

function resolveWaitMs() {
  if (process.env.ARCHIVAR_WAIT_MS != null && process.env.ARCHIVAR_WAIT_MS !== '') {
    const n = Number.parseInt(process.env.ARCHIVAR_WAIT_MS, 10);
    if (!Number.isNaN(n) && n >= 0) return n;
  }
  return stagedOnly ? DEFAULT_WAIT_HOOK_MS : DEFAULT_WAIT_CATCHUP_MS;
}

const waitMs = resolveWaitMs();

if (!stagedOnly && !catchup) {
  console.error(
    'Uso: node scripts/archivar-n4.mjs (--staged-only|--catchup) [--caso=<slug>] [--dry-run] [--hook-max=<n>] [--limit=<n>] [--force-save]',
  );
  process.exit(2);
}

function listStagedPaths(globPath) {
  const out = execFileSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=AM', '--', globPath],
    { encoding: 'utf-8' },
  );
  return out.split('\n').filter((l) => l.endsWith('.yaml'));
}

async function loadCandidateDocFiles() {
  if (stagedOnly) {
    return listStagedPaths('content/documentos/');
  }
  return glob('content/documentos/*.yaml');
}

async function loadCandidateCoberturaFiles() {
  if (stagedOnly) {
    return listStagedPaths('content/cobertura-mediatica/');
  }
  return glob('content/cobertura-mediatica/*.yaml');
}

async function loadCandidateCasoFiles() {
  if (stagedOnly) {
    return listStagedPaths('content/casos/').filter((p) => p.endsWith('/caso.yaml'));
  }
  return glob('content/casos/*/caso.yaml');
}

async function loadParsed(files) {
  const out = [];
  for (const file of files) {
    let raw;
    try {
      raw = await readFile(file, 'utf-8');
    } catch {
      continue;
    }
    let data;
    try {
      data = parseYaml(raw);
    } catch {
      continue;
    }
    out.push({ file, raw, data });
  }
  return out;
}

function pickPendingDocumentos(parsedDocs) {
  return parsedDocs
    .filter(({ data }) => data?.nivel_fuente === 4)
    .filter(({ data }) => typeof data?.url_canonica === 'string' && data.url_canonica.length > 0)
    .filter(({ data }) => !data?.url_archivo)
    .filter(({ data }) => !data?.url_archivo_no_disponible)
    .filter(({ data }) => (casoFilter ? data?.caso_principal_id === casoFilter : true))
    .map(({ file, raw, data }) => ({
      source: 'documento',
      file,
      raw,
      id: data.id,
      url: data.url_canonica,
    }));
}

function pickPendingCobertura(parsedCobertura) {
  const items = [];
  for (const { file, raw, data } of parsedCobertura) {
    if (!data?.caso_id) continue;
    if (casoFilter && data.caso_id !== casoFilter) continue;
    const noticias = Array.isArray(data.noticias) ? data.noticias : [];
    for (const noticia of noticias) {
      if (!noticia?.id || typeof noticia.url !== 'string' || !noticia.url) continue;
      if (noticia.url_archivo) continue;
      items.push({
        source: 'cobertura',
        file,
        raw,
        id: noticia.id,
        url: noticia.url,
      });
    }
  }
  return items;
}

function pickPendingContenidoNoModelado(parsedCasos) {
  const items = [];
  for (const { file, raw, data } of parsedCasos) {
    if (!data?.id) continue;
    if (casoFilter && data.id !== casoFilter) continue;
    const decisiones = Array.isArray(data.contenido_no_modelado) ? data.contenido_no_modelado : [];
    for (const decision of decisiones) {
      if (!decision?.id) continue;
      const fuentes = Array.isArray(decision.fuentes) ? decision.fuentes : [];
      for (const fuente of fuentes) {
        if (typeof fuente.url !== 'string' || !fuente.url) continue;
        if (fuente.url_archivo) continue;
        const medio = fuente.medio_id ? `${fuente.medio_id}: ` : '';
        items.push({
          source: 'no_modelado',
          file,
          raw,
          id: `${decision.id} · ${medio}${fuente.fecha ?? 's/f'}`,
          itemId: decision.id,
          url: fuente.url,
        });
      }
    }
  }
  return items;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeArchiveUrl(url) {
  if (url.startsWith('http://web.archive.org/')) {
    return 'https://web.archive.org/' + url.slice('http://web.archive.org/'.length);
  }
  return url;
}

async function findExistingSnapshot(url, attempt = 1) {
  const apiUrl = `${AVAILABLE_ENDPOINT}?url=${encodeURIComponent(url)}`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), AVAILABLE_TIMEOUT_MS);
  try {
    const resp = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'application/json' },
    });
    if (resp.status === 429 || resp.status === 503) {
      if (attempt < MAX_ATTEMPTS) {
        clearTimeout(t);
        await sleep(RATE_LIMIT_BACKOFF_MS);
        return findExistingSnapshot(url, attempt + 1);
      }
      return { ok: false, error: `available API HTTP ${resp.status}` };
    }
    if (!resp.ok) {
      return { ok: false, error: `available API HTTP ${resp.status}` };
    }
    let data;
    try {
      data = await resp.json();
    } catch {
      return { ok: false, error: 'available API: respuesta no JSON' };
    }
    const closest = data?.archived_snapshots?.closest;
    if (closest?.available === true && typeof closest.url === 'string' && closest.url.length > 0) {
      return { ok: true, archiveUrl: normalizeArchiveUrl(closest.url), method: 'reuse' };
    }
    return { ok: false, error: 'sin snapshot en Wayback' };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, error: `available API timeout (${AVAILABLE_TIMEOUT_MS / 1000}s)` };
    }
    return { ok: false, error: err.message };
  } finally {
    clearTimeout(t);
  }
}

async function saveOne(url, attempt = 1) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const resp = await fetch(SAVE_ENDPOINT + url, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
    });

    if (resp.status === 429 || resp.status === 503) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RATE_LIMIT_BACKOFF_MS);
        return saveOne(url, attempt + 1);
      }
      return { ok: false, error: `rate limit (HTTP ${resp.status}) tras ${attempt} intentos` };
    }

    const location = resp.headers.get('location');
    const contentLocation = resp.headers.get('content-location');

    if (location && location.startsWith('https://web.archive.org/web/')) {
      return { ok: true, archiveUrl: location, method: 'capture' };
    }
    if (contentLocation && contentLocation.startsWith('/web/')) {
      return { ok: true, archiveUrl: 'https://web.archive.org' + contentLocation, method: 'capture' };
    }
    if (location && location.startsWith('/web/')) {
      return { ok: true, archiveUrl: 'https://web.archive.org' + location, method: 'capture' };
    }

    return { ok: false, error: `respuesta sin Location utilizable (HTTP ${resp.status})` };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, error: `timeout (${REQUEST_TIMEOUT_MS / 1000}s)` };
    }
    return { ok: false, error: err.message };
  } finally {
    clearTimeout(t);
  }
}

async function resolveArchiveUrl(url) {
  if (!skipReuse) {
    const existing = await findExistingSnapshot(url);
    if (existing.ok) {
      return existing;
    }
  }
  return saveOne(url);
}

function insertUrlArchivoDocumento(rawYaml, archiveUrl) {
  const lines = rawYaml.split('\n');
  const idx = lines.findIndex((l) => /^url_canonica:\s/.test(l));
  if (idx < 0) {
    return null;
  }
  // url_canonica puede ser un escalar plegado/literal (`>-`, `>`, `|`, `|-`): su valor
  // ocupa las líneas indentadas siguientes. Hay que avanzar hasta el final del nodo para
  // insertar url_archivo DESPUÉS del bloque; insertarlo en idx+1 partiría el escalar y
  // rompería el YAML (incidente caja-b 2026-06-04).
  let end = idx;
  const inline = lines[idx].slice(lines[idx].indexOf(':') + 1).trim();
  if (/^[>|]/.test(inline)) {
    let j = idx + 1;
    while (j < lines.length && /^\s+\S/.test(lines[j])) {
      end = j;
      j++;
    }
  }
  const next = lines[end + 1];
  if (next && /^url_archivo:\s/.test(next)) {
    lines[end + 1] = `url_archivo: "${archiveUrl}"`;
  } else {
    lines.splice(end + 1, 0, `url_archivo: "${archiveUrl}"`);
  }
  return lines.join('\n');
}

function insertUrlArchivoCobertura(rawYaml, targetUrl, archiveUrl) {
  const lines = rawYaml.split('\n');
  const needle = targetUrl.replace(/"/g, '');
  for (let i = 0; i < lines.length; i++) {
    if (!/^    url:\s/.test(lines[i])) continue;
    if (!lines[i].includes(needle)) continue;
    const next = lines[i + 1];
    if (next && /^    url_archivo:\s/.test(next)) {
      lines[i + 1] = `    url_archivo: "${archiveUrl}"`;
    } else {
      lines.splice(i + 1, 0, `    url_archivo: "${archiveUrl}"`);
    }
    return lines.join('\n');
  }
  return null;
}

function insertUrlArchivoContenidoNoModelado(rawYaml, targetItemId, targetUrl, archiveUrl) {
  const lines = rawYaml.split('\n');
  const itemRe = new RegExp(`^  - id:\\s*"?${targetItemId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"?\\s*$`);
  const start = lines.findIndex((l) => itemRe.test(l));
  if (start < 0) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^  - id:\s/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const needle = targetUrl.replace(/"/g, '');
  for (let i = start; i < end; i++) {
    if (!/^        url:\s/.test(lines[i])) continue;
    if (!lines[i].includes(needle)) continue;
    const next = lines[i + 1];
    if (next && /^        url_archivo:\s/.test(next)) {
      lines[i + 1] = `        url_archivo: "${archiveUrl}"`;
    } else {
      lines.splice(i + 1, 0, `        url_archivo: "${archiveUrl}"`);
    }
    return lines.join('\n');
  }
  return null;
}

function gitAdd(file) {
  try {
    execFileSync('git', ['add', file], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function pauseAfterItem(method) {
  if (method === 'reuse') {
    return sleep(WAIT_AFTER_REUSE_MS);
  }
  return sleep(waitMs);
}

async function main() {
  const docFiles = await loadCandidateDocFiles();
  const cobFiles = await loadCandidateCoberturaFiles();
  const casoFiles = await loadCandidateCasoFiles();

  if (docFiles.length === 0 && cobFiles.length === 0 && casoFiles.length === 0) {
    if (catchup) console.log('✅ No hay YAML de documentos, cobertura mediática ni casos para revisar.');
    return;
  }

  const parsedDocs = docFiles.length ? await loadParsed(docFiles) : [];
  const parsedCob = cobFiles.length ? await loadParsed(cobFiles) : [];
  const parsedCasos = casoFiles.length ? await loadParsed(casoFiles) : [];

  let pending = [
    ...pickPendingDocumentos(parsedDocs),
    ...pickPendingCobertura(parsedCob),
    ...pickPendingContenidoNoModelado(parsedCasos),
  ];

  if (pending.length === 0) {
    if (catchup) console.log('✅ Ninguna URL pendiente de archivar (documentos N4 + cobertura mediática + contenido no modelado).');
    return;
  }

  const totalPending = pending.length;
  let deferred = 0;
  if (stagedOnly && hookMax > 0 && pending.length > hookMax) {
    deferred = pending.length - hookMax;
    pending = pending.slice(0, hookMax);
  }
  if (limit != null && pending.length > limit) {
    pending = pending.slice(0, limit);
  }

  const ctx = stagedOnly ? '(staged)' : '(catchup)';
  const reuseNote = skipReuse ? 'sin reutilizar snapshots' : 'reutiliza Wayback si existe';
  const label = `${pending.length} URL(s)${deferred ? ` (${deferred} aplazada(s) por tope de --staged-only)` : ''}`;
  console.log(
    `📚 archivar-n4 ${ctx}: ${label}${casoFilter ? ` — caso=${casoFilter}` : ''} · wait=${waitMs}ms · ${reuseNote}`,
  );

  if (dryRun) {
    for (const d of pending) {
      console.log(`  [${d.source}] ${d.id}`);
      console.log(`    ${d.url}`);
    }
    if (deferred) {
      console.log(`  … y ${deferred} más no listadas (tope --hook-max)`);
    }
    console.log('(dry-run: no se ha hecho ninguna llamada)');
    return;
  }

  let okCount = 0;
  let failCount = 0;
  let reuseCount = 0;
  let captureCount = 0;
  const fileCache = new Map();

  for (let i = 0; i < pending.length; i++) {
    const d = pending[i];
    process.stdout.write(`  [${i + 1}/${pending.length}] [${d.source}] ${d.id} … `);

    const r = await resolveArchiveUrl(d.url);
    if (r.ok) {
      let raw = fileCache.get(d.file) ?? d.raw;
      let updated = null;
      if (d.source === 'documento') {
        updated = insertUrlArchivoDocumento(raw, r.archiveUrl);
      } else if (d.source === 'cobertura') {
        updated = insertUrlArchivoCobertura(raw, d.url, r.archiveUrl);
      } else if (d.source === 'no_modelado') {
        updated = insertUrlArchivoContenidoNoModelado(raw, d.itemId, d.url, r.archiveUrl);
      }

      if (updated) {
        await writeFile(d.file, updated, 'utf-8');
        fileCache.set(d.file, updated);
        if (stagedOnly) gitAdd(d.file);
        const tag = r.method === 'reuse' ? 'OK (reuse)' : 'OK (capture)';
        console.log(tag);
        okCount++;
        if (r.method === 'reuse') reuseCount++;
        else captureCount++;
      } else {
        console.log('OK (archivado) pero NO se pudo insertar url_archivo en el YAML');
        failCount++;
      }
    } else {
      console.log(`FAIL — ${r.error}`);
      failCount++;
    }

    if (i < pending.length - 1) {
      await pauseAfterItem(r.ok ? r.method : 'capture');
    }
  }

  console.log(
    `📝 ${okCount} archivado(s) (${reuseCount} reuse · ${captureCount} capture) · ${failCount} fallido(s)`,
  );
  if (failCount > 0) {
    console.log('   Los fallidos quedan sin url_archivo; reintenta con pnpm archive:catchup.');
  }
  if (deferred > 0) {
    console.log(`   Quedan ${deferred} URL(s) pendiente(s) en este staging — ejecuta: pnpm archive:catchup`);
  }
  if (catchup && totalPending > pending.length) {
    // catchup has no cap; this branch unused
  }
}

main().catch((err) => {
  console.error('archivar-n4 (no bloquea commit):', err.message);
  process.exit(0);
});
