import prisma from "@/lib/prisma";
export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    const privateItineraries = await prisma.itinerary.findMany({
      where: { userId, visibility: "PRIVATE" },
    });

    return new Response(JSON.stringify(privateItineraries), { status: 200 });
  } catch (error) {
    console.error("Error fetching private itineraries:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch private itineraries" }),
      { status: 500 }
    );
  }
}