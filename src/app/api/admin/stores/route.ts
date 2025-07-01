import { stores as mockStores } from "@/data/stores";
import type { NextRequest } from "next/server";
import { AdminStore } from "@/types/admin";

// In-memory admin stores collection
const adminStores: AdminStore[] = mockStores.map((s) => ({ ...s, isActive: true }));

export async function GET() {
  return Response.json(adminStores, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<AdminStore>;
  const id = `store-${Date.now()}`;
  const item: AdminStore = {
    id,
    name: body.name ?? "Unnamed",
    address: body.address ?? "",
    region: body.region ?? "",
    lat: body.lat ?? 0,
    lng: body.lng ?? 0,
    isActive: body.isActive ?? true,
  };
  adminStores.push(item);
  return Response.json(item, { status: 201 });
}
