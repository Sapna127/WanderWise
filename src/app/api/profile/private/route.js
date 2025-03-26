import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    const token = await getToken({ req: request });
    
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const itineraries = await prisma.itinerary.findMany({
      where: { 
        userId: token.id,
        visibility: "PRIVATE" 
      },
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
    console.error("Error fetching private itineraries:", error);
    return NextResponse.json(
      { error: "Failed to fetch private itineraries" },
      { status: 500 }
    );
  }
}