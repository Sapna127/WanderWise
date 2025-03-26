import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { visibility: "PUBLIC" },
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(itineraries);
  } catch (error) {
    console.error("Error fetching public itineraries:", error);
    return NextResponse.json(
      { error: "Failed to fetch public itineraries" },
      { status: 500 }
    );
  }
}