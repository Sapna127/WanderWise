import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  console.log("Fetch itinerary route hit!");
  const userId = req.headers.authorization;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: { user: true, collaborators: true, reviews: true },
    });

    if (!itinerary) return Response.json({ error: "Itinerary not found" }, { status: 404 });

    // Ensure only the owner or collaborators can access private itineraries
    const isAuthorized = itinerary.visibility === "public" ||
                         itinerary.userId === userId ||
                         itinerary.collaborators.some((c) => c.userId === userId);

    if (!isAuthorized) {
      return Response.json({ error: "This itinerary is private" }, { status: 403 });
    }

    return Response.json(itinerary, { status: 200 });
  } catch (error) {
    console.error("Fetch itinerary error:", error);
    return Response.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  console.log("Update itinerary route hit!");
  const userId = req.headers.authorization;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const body = await req.json();

  try {
    const updatedItinerary = await prisma.itinerary.update({
      where: { id, userId }, // Ensures only the owner can update
      data: body,
    });

    return Response.json(updatedItinerary, { status: 200 });
  } catch (error) {
    console.error("Itinerary update error:", error);
    return Response.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}
