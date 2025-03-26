import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id: itineraryId } = params;

  if (!itineraryId) {
    return new Response(JSON.stringify({ error: "Itinerary ID is required" }), {
      status: 400,
    });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { itineraryId },
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const token = await getToken({ req });
  
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { itineraryId, rating, comment } = await req.json();

  if (!itineraryId || !rating || !comment) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    const review = await prisma.review.create({
      data: { 
        itineraryId, 
        rating: parseInt(rating), 
        comment,
        userId: token.id 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return new Response(JSON.stringify(review), { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return new Response(JSON.stringify({ error: "Failed to add review" }), {
      status: 500,
    });
  }
}