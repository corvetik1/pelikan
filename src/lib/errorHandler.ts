import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function handleError(err: unknown): Response {
  if (err instanceof ZodError) {
    return Response.json({ message: "Validation error", issues: err.issues }, { status: 400 });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return Response.json({ message: "Not found" }, { status: 404 });
    }
  }
  console.error(err);
  return Response.json({ message: "Internal server error" }, { status: 500 });
}
