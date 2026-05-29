// Formato monetario canónico del sitio (euros). Una sola fuente de verdad
// para que la cifra inline en prosa (RichProse) y la cifra estructurada de los
// Hechos (ficha de caso, /graficas, /casos) se rendericen idénticas.
//
// Convención española: coma decimal, punto de miles. No usamos
// `toLocaleString('es-ES')` porque en este runtime no aplica el grouping de
// forma fiable (verificado: (4743.53).toLocaleString('es-ES') → "4743,53").

/** Número con punto de miles y coma decimal (máx 2 decimales, sin ceros
 *  sobrantes a la derecha). Ej.: 4743.53 → "4.743,53"; 53000000 → "53.000.000". */
export function formatGroupedNumber(num: number): string {
  const negative = num < 0;
  const abs = Math.abs(num);
  const rounded = Math.round(abs * 100) / 100;
  const intPart = Math.trunc(rounded);
  const decPart = rounded - intPart;
  const intStr = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  let out = intStr;
  if (decPart > 0) {
    const dec = decPart.toFixed(2).slice(2).replace(/0+$/, '');
    if (dec) out += `,${dec}`;
  }
  return negative ? `-${out}` : out;
}

/** Forma compacta para titulares y chips: a partir de 1 M€ se acorta a "53 M€"
 *  / "33,4 M€"; por debajo del millón se deja completa en euros ("770.000 €"). */
export function formatEurosCompact(euros: number): string {
  if (Math.abs(euros) >= 1_000_000) {
    return `${formatGroupedNumber(euros / 1_000_000)} M€`;
  }
  return `${formatGroupedNumber(euros)} €`;
}

/** Forma exacta y completa, siempre en euros con separador de miles
 *  ("53.000.000 €"). Para tooltips y la cifra literal verificable. */
export function formatEurosFull(euros: number): string {
  return `${formatGroupedNumber(euros)} €`;
}
