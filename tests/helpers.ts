// Validación del dígito de control de un CIF/NIF de entidad español.
// Algoritmo oficial: letra inicial + 7 dígitos + carácter de control (dígito o
// letra según el tipo de entidad). Usado por el test de contrato para garantizar
// que ningún CIF emitido por la API tiene una errata.
export function validCIF(cifRaw: string): boolean {
  const cif = cifRaw.toUpperCase();
  if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(cif)) return false;
  const letter = cif[0];
  const digits = cif.slice(1, 8);
  const control = cif[8];
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    let n = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      // posiciones impares (1ª, 3ª, 5ª, 7ª): ×2 y suma de dígitos
      n *= 2;
      if (n > 9) n = Math.floor(n / 10) + (n % 10);
    }
    sum += n;
  }
  const e = (10 - (sum % 10)) % 10;
  const controlLetter = 'JABCDEFGHI'[e];
  if ('NPQRSW'.includes(letter)) return control === controlLetter;
  if ('ABEH'.includes(letter)) return control === String(e);
  return control === String(e) || control === controlLetter; // C,D,F,G,J,U,V
}
