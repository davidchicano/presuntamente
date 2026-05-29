// Ajuste por inflación (IPC) para presentar importes en euros constantes.
//
// Fuente: Instituto Nacional de Estadística (INE), calculadora oficial de
// variación del IPC (índice general nacional):
// https://www.ine.es/varipc/  — fecha de consulta: 2026-05-29.
//
// Cada valor es la variación acumulada del IPC general nacional desde ENERO
// del año indicado hasta DICIEMBRE de 2025 (referencia fija). El factor para
// pasar un importe nominal de ese año a euros constantes de 2025 es
// `1 + variacion/100`. Convención editorial: el "año del importe" es el inicio
// del periodo del Hecho (fecha_o_periodo.desde); es una aproximación honesta,
// no una imputación contable exacta. Se rehace cuando cambie la referencia.

/** Variación acumulada del IPC (%) desde enero de cada año hasta diciembre de
 *  2025, según el INE. Años ≥ 2025 = 0 (ya en la referencia o posteriores). */
const VARIACION_IPC_A_DIC_2025: Record<number, number> = {
  2001: 77.8,
  2002: 72.5,
  2003: 66.3,
  2004: 62.6,
  2005: 57.7,
  2006: 51.4,
  2007: 47.8,
  2008: 41.8,
  2009: 40.6,
  2010: 39.2,
  2011: 34.8,
  2012: 32.2,
  2013: 28.7,
  2014: 28.5,
  2015: 30.2,
  2016: 30.5,
  2017: 26.8,
  2018: 26.1,
  2019: 24.8,
  2020: 23.5,
  2021: 22.9,
  2022: 15.8,
  2023: 9.4,
  2024: 5.8,
  2025: 0,
  2026: 0,
};

/** Año de referencia al que se ajustan los importes constantes. */
export const ANIO_REFERENCIA_CONSTANTE = 2025;

const MIN_ANIO = Math.min(...Object.keys(VARIACION_IPC_A_DIC_2025).map(Number));
const MAX_ANIO = Math.max(...Object.keys(VARIACION_IPC_A_DIC_2025).map(Number));

/** Factor multiplicativo nominal → € constantes de 2025 para un año dado.
 *  Para años fuera de la serie usa el extremo más cercano (conservador). */
export function factorConstante2025(anio: number): number {
  const y = Math.min(MAX_ANIO, Math.max(MIN_ANIO, anio));
  const variacion = VARIACION_IPC_A_DIC_2025[y] ?? 0;
  return 1 + variacion / 100;
}

/** Importe nominal (euros del año del hecho) → euros constantes de 2025. */
export function aConstante2025(euros: number, anio: number): number {
  return euros * factorConstante2025(anio);
}
