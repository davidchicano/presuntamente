// Helpers de agregación reutilizables para páginas de datos (/cifras, /graficas).
// Sólo build-time: cuentan y agrupan entradas de las content collections.
// Extraídos de PgCifras para no duplicar la lógica de tally + sort entre páginas.

export type Counter = Map<string, number>;

/** Incrementa el contador de `key` en `by` (1 por defecto). */
export function bump(map: Counter, key: string, by = 1): void {
  map.set(key, (map.get(key) ?? 0) + by);
}

/** Entradas del contador ordenadas por valor descendente. */
export function entries(map: Counter): Array<[string, number]> {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

/** Cuenta ocurrencias de la clave derivada de cada item. Ignora claves nulas. */
export function tally<T>(
  items: Iterable<T>,
  keyFn: (item: T) => string | null | undefined,
): Counter {
  const map: Counter = new Map();
  for (const item of items) {
    const k = keyFn(item);
    if (k == null || k === '') continue;
    bump(map, k);
  }
  return map;
}

/** Año (YYYY) extraído de una fecha ISO `YYYY-MM-DD`. `null` si no parseable. */
export function yearOf(fecha: string | undefined | null): number | null {
  if (!fecha) return null;
  const m = /^(-?\d{4})/.exec(fecha.trim());
  return m ? Number(m[1]) : null;
}

/**
 * Serie densa de conteos por año entre `[min, max]` (ambos incluidos), con los
 * años sin datos a 0. Útil para que una gráfica temporal no tenga huecos.
 */
export function denseYearSeries(
  counts: Map<number, number>,
  min: number,
  max: number,
): Array<{ year: number; value: number }> {
  const out: Array<{ year: number; value: number }> = [];
  for (let y = min; y <= max; y++) {
    out.push({ year: y, value: counts.get(y) ?? 0 });
  }
  return out;
}
