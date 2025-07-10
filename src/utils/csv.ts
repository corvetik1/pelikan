
export interface CsvItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Генерирует CSV-строку из позиций.
 */
export function generateCsv(
  items: Array<{ id: string; quantity: number }>,
  prices: Record<string, number>,
  names: Record<string, string>
): string {
    const header = ["SKU", "Название", "Цена", "Количество", "Сумма"].join(",");
    const lines = items.map((it) => {
    const unitPrice = prices[it.id] ?? 0;
    const total = unitPrice * it.quantity;
    return [it.id, names[it.id] ?? it.id, unitPrice, it.quantity, total].join(",");
  });
  return [header, ...lines].join("\n");
}
