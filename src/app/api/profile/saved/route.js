import prisma from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const token = authHeader.split(" ")[1];
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
    
        if (!userId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
    

    const savedItineraries = await prisma.savedItinerary.findMany({
      where: { id: userId },
      include: { 
        itinerary: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    const publicItineraries = savedItineraries
      .map((saved) => saved.itinerary)
      .filter((itinerary) => itinerary?.visibility === "PUBLIC");

    return Response.json(publicItineraries);
  } catch (error) {
    console.error("Error fetching saved itineraries:", error);
    return Response.json(
      { error: "Failed to fetch saved itineraries" },
      { status: 500 }
    );
  }
}