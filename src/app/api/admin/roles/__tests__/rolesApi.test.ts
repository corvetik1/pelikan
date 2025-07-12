import { NextRequest } from "next/server";
import { GET as getRoles, POST as postRole } from "../route";
import { PATCH as patchRole, DELETE as deleteRole } from "../[id]/route";
import type { AdminRole } from "@/types/admin";

type RoleCreate = Pick<AdminRole, "name" | "description" | "permissions">;

// --- Mock prisma ---
const roles: AdminRole[] = [
  { id: "r1", name: "Role1", description: "role1", permissions: ["read"] },
  { id: "r2", name: "Role2", description: "role2", permissions: ["write"] },
];

jest.mock("@/lib/prisma", () => {
  return {
    __esModule: true,
    default: {
      role: {
        findMany: jest.fn(async () => roles),
        create: jest.fn(async ({ data }: { data: RoleCreate }) => {
          const role: AdminRole = { id: `r${Date.now()}`, ...data } as AdminRole;
          roles.push(role);
          return role;
        }),
        update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<AdminRole> }) => {
          const idx = roles.findIndex((r) => r.id === where.id);
          if (idx === -1) throw new Error("Not found");
          roles[idx] = { ...roles[idx], ...data } as AdminRole;
          return roles[idx];
        }),
        delete: jest.fn(async ({ where }: { where: { id: string } }) => {
          const idx = roles.findIndex((r) => r.id === where.id);
          if (idx === -1) throw new Error("Not found");
          roles.splice(idx, 1);
          return { ok: true } as unknown as AdminRole;
        }),
      },
    },
  };
});

// Helper to create NextRequest with JSON body
const jsonRequest = (method: string, url: string, body?: unknown): NextRequest => {
  const reqInit: RequestInit = { method };
  if (body !== undefined) {
    reqInit.body = JSON.stringify(body);
    reqInit.headers = { "Content-Type": "application/json" };
  }
  return new NextRequest(new Request(url, reqInit));
};

// --- Tests ---

describe("/api/admin/roles route", () => {
  it("GET returns roles list", async () => {
    const res = await getRoles();
    expect(res.status).toBe(200);
    const json = (await res.json()) as AdminRole[];
    expect(json).toHaveLength(2);
  });

  it("POST creates role", async () => {
    const payload: RoleCreate = { name: "New", description: "", permissions: [] };
    const req = jsonRequest("POST", "http://localhost/api/admin/roles", payload);
    const res = await postRole(req);
    expect(res.status).toBe(201);
    const json = (await res.json()) as AdminRole;
    expect(json.name).toBe("New");
    expect(roles).toHaveLength(3);
  });

  it("PATCH updates role", async () => {
    const patch = { description: "updated" };
    const req = jsonRequest("PATCH", "http://localhost/api/admin/roles/r1", patch);
    // patchRole expects params argument
    const res = await patchRole(req, { params: Promise.resolve({ id: "r1" }) });
    expect(res.status).toBe(200);
    const json = (await res.json()) as AdminRole;
    expect(json.description).toBe("updated");
  });

  it("DELETE removes role", async () => {
    const req = jsonRequest("DELETE", "http://localhost/api/admin/roles/r2");
    const res = await deleteRole(req, { params: Promise.resolve({ id: "r2" }) });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
    expect(roles.find((r) => r.id === "r2")).toBeUndefined();
  });
});
