/**
 * Normaliza una cadena de texto pasando a minúsculas y eliminando signos diacríticos (tildes).
 * Permite realizar búsquedas insensibles a mayúsculas y tildes.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
