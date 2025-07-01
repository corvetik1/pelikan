// Mock API route for creating a B2B quote (returns URL to PDF)
export async function POST(req: Request): Promise<Response> {
  // In real implementation validate payload, generate PDF, etc.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const body = await req.json();
  return Response.json({ url: "/files/mock-quote.pdf" }, { status: 200 });
}
