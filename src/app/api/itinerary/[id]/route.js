import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  console.log("Fetch itinerary route hit!");

  // ✅ Fix: Use async `req.nextUrl` for params extraction
  const id = req.nextUrl.pathname.split("/").pop(); 

  if (!id) {
    return Response.json({ error: "Itinerary ID is required" }, { status: 400 });
  }

  console.log("Params received:", id);

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: { user: true, collaborators: true, reviews: true },
    });

    if (!itinerary) {
      return Response.json({ error: "Itinerary not found" }, { status: 404 });
    }

    return Response.json(itinerary);
  } catch (error) {
    console.error("Fetch itinerary error:", error);
    return Response.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}
