import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  console.log("Fetch itinerary route hit!");

  // Access params.id correctly
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Itinerary ID is required" }), {
      status: 400,
    });
  }

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: { user: true, collaborators: true, reviews: true },
    });

    if (!itinerary) {
      return new Response(JSON.stringify({ error: "Itinerary not found" }), {
        status: 404,
      });
    }

    // Ensure only the owner or collaborators can access private itineraries
    const isAuthorized =
      itinerary.visibility === "PUBLIC" ||
      itinerary.userId === userId ||
      itinerary.collaborators.some((c) => c.userId === userId);

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: "This itinerary is private" }),
        { status: 403 }
      );
    }

    return new Response(JSON.stringify(itinerary), { status: 200 });
  } catch (error) {
    console.error("Fetch itinerary error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch itinerary" }), {
      status: 500,
    });
  }
}