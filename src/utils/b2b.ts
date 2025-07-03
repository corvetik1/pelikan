
export interface B2BItem {
  id: string;
  quantity: number;
}

export interface CalcTotalResult {
  net: number; // сумма без НДС
  vat: number; // сумма НДС
  gross: number; // сумма c НДС
}

const VAT_RATE = 0.2; // 20 % НДС

/**
 * Рассчитывает итоговую стоимость позиций B2B-калькулятора.
 * @param items массив позиций {id, quantity}
 * @param prices словарь цен {id: price}
 */
export function calcTotal(items: B2BItem[], prices: Record<string, number>): CalcTotalResult {
  const net = items.reduce((sum, it) => sum + (prices[it.id] ?? 0) * it.quantity, 0);
  const vat = Math.round(net * VAT_RATE);
  return {
    net,
    vat,
    gross: net + vat,
  };
}
