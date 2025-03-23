import prisma from "@/lib/prisma";
export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    const savedItineraries = await prisma.savedItinerary.findMany({
      where: { userId },
      include: { itinerary: true },
    });

    const publicItineraries = savedItineraries
      .map((saved) => saved.itinerary)
      .filter((itinerary) => itinerary.visibility === "PUBLIC");

    return new Response(JSON.stringify(publicItineraries), { status: 200 });
  } catch (error) {
    console.error("Error fetching saved itineraries:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch saved itineraries" }),
      { status: 500 }
    );
  }
}