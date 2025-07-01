import { products } from "@/data/mock";

// Mock API route returning { id, price } for each product
export async function GET() {
  // Ensure we only expose fields required for pricing
  const payload = products.map(({ id, price }) => ({ id, price }));
  return Response.json(payload, { status: 200 });
}
