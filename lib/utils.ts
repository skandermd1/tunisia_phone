/**
 * Formats a price number to Tunisian Dinar display format.
 * Example: 1149 -> "1 149 DT"
 */
export function formatPrice(price: number): string {
  const formatted = price
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} DT`;
}
