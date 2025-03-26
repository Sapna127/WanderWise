import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    // Get userId from token instead of params
    const token = await getToken({ req: request });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.id;

    const savedItineraries = await prisma.savedItinerary.findMany({
      where: { userId },
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

    return NextResponse.json(publicItineraries);
  } catch (error) {
    console.error("Error fetching saved itineraries:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved itineraries" },
      { status: 500 }
    );
  }
}