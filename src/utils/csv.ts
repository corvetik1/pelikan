import { products } from "@/data/mock";

export interface CsvItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Генерирует CSV-строку из позиций.
 */
export function generateCsv(items: Array<{ id: string; quantity: number }>, prices: Record<string, number>): string {
  const header = ["SKU", "Название", "Цена", "Количество", "Сумма"].join(",");
  const lines = items.map((it) => {
    const product = products.find((p) => p.id === it.id);
    const unitPrice = prices[it.id] ?? product?.price ?? 0;
    const total = unitPrice * it.quantity;
    return [it.id, product?.name ?? it.id, unitPrice, it.quantity, total].join(",");
  });
  return [header, ...lines].join("\n");
}
