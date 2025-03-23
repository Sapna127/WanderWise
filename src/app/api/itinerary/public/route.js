import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const publicItineraries = await prisma.itinerary.findMany({
      where: { visibility: "PUBLIC" },
      include: { user: true },
    });

    return new Response(JSON.stringify(publicItineraries), { status: 200 });
  } catch (error) {
    console.error("Error fetching public itineraries:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch public itineraries" }),
      { status: 500 }
    );
  }
}