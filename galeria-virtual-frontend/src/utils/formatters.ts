/**
 * Formatea un número como moneda local.
 * @param value - El número que se desea formatear.
 * @param locale - Localización (por defecto 'es-CO' para Colombia).
 * @param currency - Tipo de moneda (por defecto 'COP' para pesos colombianos).
 * @returns Una cadena formateada como moneda.
 */
export function formatCurrency(
  value: number,
  locale: string = 'es-CO',
  currency: string = 'COP'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}
