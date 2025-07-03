export interface B2BPrice {
  id: string;
  price: number;
}

// Simulated realistic B2B price-list. Values can be adjusted later or replaced by real backend data.
// Keep ids in sync with `products` array from mock data.
export const b2bPrices: B2BPrice[] = [
  { id: "p1", price: 1299 },
  { id: "p2", price: 899 },
  { id: "p3", price: 699 },
  { id: "p4", price: 499 },
  { id: "p5", price: 1199 },
  { id: "p6", price: 1050 },
];

export default b2bPrices;
