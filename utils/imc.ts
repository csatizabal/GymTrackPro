/**
 * Calcula el Índice de Masa Corporal (IMC) redondeado a un decimal.
 * Fórmula: peso (kg) / estatura (m)²
 */
export function calcularImc(pesoKg: number, estaturaM: number): number {
  if (estaturaM <= 0) return 0;
  const imc = pesoKg / (estaturaM * estaturaM);
  return Math.round(imc * 10) / 10;
}

/**
 * Retorna la clasificación OMS según el valor de IMC:
 * - Bajo peso: < 18,5
 * - Peso normal: 18,5 a 24,9
 * - Sobrepeso: 25,0 a 29,9
 * - Obesidad grado I: 30,0 a 34,9
 * - Obesidad grado II: 35,0 a 39,9
 * - Obesidad grado III: >= 40,0
 */
export function clasificarImc(imc: number): string {
  if (imc < 18.5) {
    return 'Bajo peso';
  }
  if (imc < 25.0) {
    return 'Peso normal';
  }
  if (imc < 30.0) {
    return 'Sobrepeso';
  }
  if (imc < 35.0) {
    return 'Obesidad grado I';
  }
  if (imc < 40.0) {
    return 'Obesidad grado II';
  }
  return 'Obesidad grado III';
}
