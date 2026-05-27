// git-meta.ts — última fecha de modificación de un path según el historial git.
//
// Se evalúa en build (Astro estático) y queda inlineada en el HTML generado.
// El uso típico es "última actualización editorial de la ficha del caso X",
// derivado de `git log -1 --format=%aI -- content/casos/<slug>/`.
//
// Notas operativas:
//   - En Cloudflare Pages el clone puede ser shallow; en ese caso `git log`
//     devuelve sólo lo que cabe en la profundidad disponible. Para los paths
//     no tocados en HEAD, la fecha puede salir vacía (devolvemos null).
//   - Cacheamos por path para no llamar a `git` N veces durante el build.
//   - Si `git` no está disponible (entorno raro), devolvemos null y los
//     consumidores aplican su propio fallback (típicamente la fecha del
//     último hito del caso).

import { execSync } from 'node:child_process';

const cache = new Map<string, string | null>();

function runGitLog(pathArg: string): string | null {
  try {
    const iso = execSync(`git log -1 --format=%aI -- ${pathArg}`, {
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 1024 * 1024,
    })
      .toString()
      .trim();
    return iso === '' ? null : iso;
  } catch {
    return null;
  }
}

/**
 * Última fecha ISO (yyyy-mm-ddTHH:MM:SS±zz) en que git registra cambio en el
 * path indicado. Devuelve `null` si git no encuentra historial accesible.
 */
export function lastCommitISO(path: string): string | null {
  if (cache.has(path)) return cache.get(path) ?? null;
  const value = runGitLog(path);
  cache.set(path, value);
  return value;
}

/**
 * Fecha (yyyy-mm-dd) del último cambio editorial de la ficha de un caso.
 * Mira sólo bajo `content/casos/<slug>/`. Devuelve `null` si el historial
 * git accesible no toca ese directorio (típico en clones shallow donde el
 * último commit no afecta a ese caso).
 */
export function ultimaActualizacionDeCaso(slug: string): string | null {
  const iso = lastCommitISO(`content/casos/${slug}/`);
  return iso ? iso.slice(0, 10) : null;
}
