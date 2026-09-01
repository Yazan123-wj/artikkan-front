/**
 * Dynamic catalogue piece message keys for next-intl.
 * Product ids are open-ended strings; EN/AR message files include every id.
 */
export function productPieceKey(
  nameKey: string,
  field: 'name' | 'alt',
): 'pieces.candle-holder.name' {
  return `pieces.${nameKey}.${field}` as 'pieces.candle-holder.name';
}
